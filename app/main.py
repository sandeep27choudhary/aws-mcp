import os
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()

from app.aws import cloudformation, autoscaling, ssm, cloudwatch, lambda_fn, resources
import boto3

app = FastAPI(title="AWS MCP Server")

# CloudFormation endpoints
app.include_router(cloudformation.router, prefix="/cloudformation", tags=["CloudFormation"])
# Auto Scaling endpoints
app.include_router(autoscaling.router, prefix="/autoscaling", tags=["AutoScaling"])
# SSM endpoints
app.include_router(ssm.router, prefix="/ssm", tags=["SSM"])
# CloudWatch endpoints
app.include_router(cloudwatch.router, prefix="/cloudwatch", tags=["CloudWatch"])
# Lambda endpoints
app.include_router(lambda_fn.router, prefix="/lambda", tags=["Lambda"])
# Resources endpoints
app.include_router(resources.router, tags=["Resources"])

@app.get("/resources-list", tags=["Resources"])
def list_resources():
    resources = {}
    # EC2 Instances
    try:
        ec2 = boto3.client('ec2')
        ec2_instances = ec2.describe_instances()
        resources['ec2_instances'] = [
            {
                'InstanceId': i['InstanceId'],
                'State': i['State']['Name'],
                'Type': i['InstanceType'],
                'AZ': i['Placement']['AvailabilityZone']
            }
            for r in ec2_instances['Reservations'] for i in r['Instances']
        ]
    except Exception as e:
        resources['ec2_instances'] = f"Error: {e}"

    # RDS Instances
    try:
        rds = boto3.client('rds')
        rds_instances = rds.describe_db_instances()
        resources['rds_instances'] = [
            {
                'DBInstanceIdentifier': db['DBInstanceIdentifier'],
                'Engine': db['Engine'],
                'Status': db['DBInstanceStatus']
            }
            for db in rds_instances['DBInstances']
        ]
    except Exception as e:
        resources['rds_instances'] = f"Error: {e}"

    # IAM Users
    try:
        iam = boto3.client('iam')
        users = iam.list_users()
        resources['iam_users'] = [u['UserName'] for u in users['Users']]
    except Exception as e:
        resources['iam_users'] = f"Error: {e}"

    # ECS Clusters
    try:
        ecs = boto3.client('ecs')
        clusters = ecs.list_clusters()
        resources['ecs_clusters'] = clusters['clusterArns']
    except Exception as e:
        resources['ecs_clusters'] = f"Error: {e}"

    # S3 Buckets
    try:
        s3 = boto3.client('s3')
        buckets = s3.list_buckets()
        resources['s3_buckets'] = [b['Name'] for b in buckets['Buckets']]
    except Exception as e:
        resources['s3_buckets'] = f"Error: {e}"

    # ALBs (Application Load Balancers)
    try:
        elbv2 = boto3.client('elbv2')
        albs = elbv2.describe_load_balancers()
        resources['albs'] = [lb['LoadBalancerName'] for lb in albs['LoadBalancers'] if lb['Type'] == 'application']
    except Exception as e:
        resources['albs'] = f"Error: {e}"

    # Route53 Records
    try:
        route53 = boto3.client('route53')
        hosted_zones = route53.list_hosted_zones()
        records = []
        for zone in hosted_zones['HostedZones']:
            zone_records = route53.list_resource_record_sets(HostedZoneId=zone['Id'])
            for record in zone_records['ResourceRecordSets']:
                records.append({
                    'ZoneName': zone['Name'],
                    'Name': record['Name'],
                    'Type': record['Type']
                })
        resources['route53_records'] = records
    except Exception as e:
        resources['route53_records'] = f"Error: {e}"

    return resources 