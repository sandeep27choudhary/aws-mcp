from fastapi import APIRouter
import boto3
from datetime import datetime

router = APIRouter()

def isoformat(dt):
    if isinstance(dt, str):
        return dt
    if dt is None:
        return ""
    return dt.isoformat() if hasattr(dt, 'isoformat') else str(dt)

@router.get("/resources-list", tags=["Resources"])
def list_resources():
    # EC2 Instances
    ec2Instances = []
    try:
        ec2 = boto3.client('ec2')
        region = ec2.meta.region_name
        reservations = ec2.describe_instances()['Reservations']
        for r in reservations:
            for i in r['Instances']:
                ec2Instances.append({
                    'id': i.get('InstanceId', ''),
                    'name': next((t['Value'] for t in i.get('Tags', []) if t['Key'] == 'Name'), i.get('InstanceId', '')),
                    'type': 'EC2',
                    'region': region,
                    'status': i.get('State', {}).get('Name', ''),
                    'createdAt': isoformat(i.get('LaunchTime')),
                    'instanceType': i.get('InstanceType', ''),
                    'privateIp': i.get('PrivateIpAddress', ''),
                    'publicIp': i.get('PublicIpAddress', ''),
                })
    except Exception as e:
        pass

    # RDS Instances
    rdsInstances = []
    try:
        rds = boto3.client('rds')
        region = rds.meta.region_name
        for db in rds.describe_db_instances()['DBInstances']:
            rdsInstances.append({
                'id': db.get('DBInstanceIdentifier', ''),
                'name': db.get('DBInstanceIdentifier', ''),
                'type': 'RDS',
                'region': region,
                'status': db.get('DBInstanceStatus', ''),
                'createdAt': isoformat(db.get('InstanceCreateTime')),
                'engine': db.get('Engine', ''),
                'size': str(db.get('AllocatedStorage', '')),
                'endpoint': db.get('Endpoint', {}).get('Address', ''),
            })
    except Exception as e:
        pass

    # IAM Users
    iamUsers = []
    try:
        iam = boto3.client('iam')
        for u in iam.list_users()['Users']:
            iamUsers.append({
                'id': u.get('UserId', ''),
                'name': u.get('UserName', ''),
                'type': 'IAM',
                'region': 'global',
                'status': '',
                'createdAt': isoformat(u.get('CreateDate')),
                'arn': u.get('Arn', ''),
                'console_access': True,  # Placeholder
                'last_activity': '',     # Placeholder
            })
    except Exception as e:
        pass

    # ECS Clusters
    ecsClusters = []
    try:
        ecs = boto3.client('ecs')
        region = ecs.meta.region_name
        for arn in ecs.list_clusters()['clusterArns']:
            desc = ecs.describe_clusters(clusters=[arn])['clusters'][0]
            ecsClusters.append({
                'id': desc.get('clusterArn', ''),
                'name': desc.get('clusterName', ''),
                'type': 'ECS',
                'region': region,
                'status': desc.get('status', ''),
                'createdAt': '',
                'serviceCount': desc.get('registeredContainerInstancesCount', 0),
                'taskCount': desc.get('runningTasksCount', 0),
            })
    except Exception as e:
        pass

    # S3 Buckets
    s3Buckets = []
    try:
        s3 = boto3.client('s3')
        for b in s3.list_buckets()['Buckets']:
            bucket_name = b.get('Name', '')
            bucket_region = ''
            try:
                loc = s3.get_bucket_location(Bucket=bucket_name)
                bucket_region = loc.get('LocationConstraint') or 'us-east-1'
            except Exception:
                pass
            s3Buckets.append({
                'id': bucket_name,
                'name': bucket_name,
                'type': 'S3',
                'region': bucket_region,
                'status': '',
                'createdAt': isoformat(b.get('CreationDate')),
                'arnName': '',
                'size': '',
                'objectCount': None,
            })
    except Exception as e:
        pass

    # ALBs
    albs = []
    try:
        elbv2 = boto3.client('elbv2')
        region = elbv2.meta.region_name
        for lb in elbv2.describe_load_balancers()['LoadBalancers']:
            if lb.get('Type') == 'application':
                albs.append({
                    'id': lb.get('LoadBalancerArn', ''),
                    'name': lb.get('LoadBalancerName', ''),
                    'type': 'ALB',
                    'region': region,
                    'status': lb.get('State', {}).get('Code', ''),
                    'createdAt': isoformat(lb.get('CreatedTime')),
                    'dnsName': lb.get('DNSName', ''),
                    'scheme': lb.get('Scheme', ''),
                })
    except Exception as e:
        pass

    # Route53 Records
    route53Records = []
    try:
        route53 = boto3.client('route53')
        for zone in route53.list_hosted_zones()['HostedZones']:
            zone_records = route53.list_resource_record_sets(HostedZoneId=zone['Id'])
            for record in zone_records['ResourceRecordSets']:
                route53Records.append({
                    'id': f"{zone['Id']}:{record['Name']}:{record['Type']}",
                    'name': record.get('Name', ''),
                    'type': 'Route53',
                    'region': 'global',
                    'status': '',
                    'createdAt': '',
                    'recordType': record.get('Type', ''),
                    'recordValue': record.get('ResourceRecords', [{}])[0].get('Value', '') if record.get('ResourceRecords') else '',
                    'ttl': record.get('TTL', None),
                })
    except Exception as e:
        pass

    return {
        'ec2Instances': ec2Instances,
        'rdsInstances': rdsInstances,
        'iamUsers': iamUsers,
        'ecsClusters': ecsClusters,
        's3Buckets': s3Buckets,
        'albs': albs,
        'route53Records': route53Records,
    } 