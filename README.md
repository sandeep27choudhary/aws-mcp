# MCP Server

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root with your AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_DEFAULT_REGION=us-east-1
   ```

3. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

4. Use the OpenAPI docs at `http://localhost:8000/docs` to interact with the API.

## Features

- Deploy and manage CloudFormation stacks
- Scale Auto Scaling Groups
- Run SSM automation commands
- Monitor resources via CloudWatch
- Trigger Lambda functions
- **List all major AWS resources** with `/resources-list` (EC2, RDS, IAM users, ECS, S3, ALBs, Route53)

## Security
- `.env` and `__pycache__/` are included in `.gitignore` to prevent sensitive data and cache files from being committed.