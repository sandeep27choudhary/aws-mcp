from fastapi import APIRouter, HTTPException
import boto3
from datetime import datetime, timedelta

router = APIRouter()
cw = boto3.client('cloudwatch')

@router.get("/metrics/ec2/{instance_id}")
def get_ec2_cpu_utilization(instance_id: str):
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=1)
        response = cw.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
            StartTime=start_time,
            EndTime=end_time,
            Period=300,
            Statistics=['Average']
        )
        return response['Datapoints']
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 