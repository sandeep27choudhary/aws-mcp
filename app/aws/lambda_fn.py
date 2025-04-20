from fastapi import APIRouter, HTTPException
import boto3
import json

router = APIRouter()
lambda_client = boto3.client('lambda')

@router.post("/invoke")
def invoke_lambda(function_name: str, payload: dict = {}):
    try:
        response = lambda_client.invoke(
            FunctionName=function_name,
            InvocationType='RequestResponse',
            Payload=json.dumps(payload)
        )
        result = response['Payload'].read().decode('utf-8')
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 