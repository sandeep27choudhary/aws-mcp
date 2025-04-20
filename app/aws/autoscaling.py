from fastapi import APIRouter, HTTPException
import boto3

router = APIRouter()
asg = boto3.client('autoscaling')

@router.post("/scale")
def scale_group(group_name: str, desired_capacity: int):
    try:
        asg.set_desired_capacity(
            AutoScalingGroupName=group_name,
            DesiredCapacity=desired_capacity,
            HonorCooldown=False
        )
        return {"message": f"Scaling {group_name} to {desired_capacity} instances"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 