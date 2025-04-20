from fastapi import APIRouter, HTTPException
import boto3

router = APIRouter()
ssm = boto3.client('ssm')

@router.post("/run-command")
def run_command(instance_ids: list, document_name: str, parameters: dict = {}):
    try:
        response = ssm.send_command(
            InstanceIds=instance_ids,
            DocumentName=document_name,
            Parameters=parameters
        )
        return {"message": "Command sent", "command_id": response['Command']['CommandId']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 