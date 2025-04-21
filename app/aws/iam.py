from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3

router = APIRouter()
iam = boto3.client('iam')

class CreateUserRequest(BaseModel):
    user_name: str

class DeleteUserRequest(BaseModel):
    user_name: str

class PolicyRequest(BaseModel):
    user_name: str
    policy_arn: str

@router.get("/users")
def list_users():
    try:
        users = iam.list_users()
        return {"users": users['Users']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users")
def create_user(req: CreateUserRequest):
    try:
        user = iam.create_user(UserName=req.user_name)
        return {"user": user['User']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/users")
def delete_user(req: DeleteUserRequest):
    try:
        iam.delete_user(UserName=req.user_name)
        return {"message": f"User {req.user_name} deleted."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/attach-policy")
def attach_policy(req: PolicyRequest):
    try:
        iam.attach_user_policy(UserName=req.user_name, PolicyArn=req.policy_arn)
        return {"message": f"Policy {req.policy_arn} attached to {req.user_name}."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/detach-policy")
def detach_policy(req: PolicyRequest):
    try:
        iam.detach_user_policy(UserName=req.user_name, PolicyArn=req.policy_arn)
        return {"message": f"Policy {req.policy_arn} detached from {req.user_name}."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 