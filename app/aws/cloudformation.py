from fastapi import APIRouter, HTTPException
import boto3

router = APIRouter()
cf = boto3.client('cloudformation')

@router.post("/deploy")
def deploy_stack(stack_name: str, template_url: str, parameters: dict = {}):
    try:
        response = cf.create_stack(
            StackName=stack_name,
            TemplateURL=template_url,
            Parameters=[
                {'ParameterKey': k, 'ParameterValue': v} for k, v in parameters.items()
            ],
            Capabilities=['CAPABILITY_NAMED_IAM']
        )
        return {"message": "Stack creation initiated", "stack_id": response['StackId']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status/{stack_name}")
def stack_status(stack_name: str):
    try:
        response = cf.describe_stacks(StackName=stack_name)
        return response['Stacks'][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 