export interface AWSResource {
  id: string;
  name: string;
  type: string;
  region: string;
  status: string;
  createdAt: string;
}

export interface EC2Instance extends AWSResource {
  instanceType: string;
  privateIp: string;
  publicIp?: string;
}

export interface RDSInstance extends AWSResource {
  engine: string;
  size: string;
  endpoint?: string;
}

export interface IAMUser extends AWSResource {
  arn: string;
  console_access: boolean;
  last_activity?: string;
}

export interface ECSCluster extends AWSResource {
  serviceCount: number;
  taskCount: number;
}

export interface S3Bucket extends AWSResource {
  arnName: string;
  size?: string;
  objectCount?: number;
}

export interface ALB extends AWSResource {
  dnsName: string;
  scheme: string;
}

export interface Route53Record extends AWSResource {
  recordType: string;
  recordValue: string;
  ttl?: number;
}

export interface ResourcesSummary {
  ec2Instances: EC2Instance[];
  rdsInstances: RDSInstance[];
  iamUsers: IAMUser[];
  ecsClusters: ECSCluster[];
  s3Buckets: S3Bucket[];
  albs: ALB[];
  route53Records: Route53Record[];
}

export interface CloudFormationStack {
  stackName: string;
  stackId: string;
  status: string;
  createdTime: string;
  lastUpdatedTime?: string;
  outputs?: { key: string; value: string }[];
}

export interface AutoScalingGroup {
  name: string;
  minSize: number;
  maxSize: number;
  desiredCapacity: number;
  instanceCount: number;
  healthStatus: {
    healthy: number;
    unhealthy: number;
  };
}

export interface SSMDocument {
  name: string;
  documentType: string;
  schemaVersion: string;
  createdDate: string;
  description?: string;
}

export interface SSMCommandResult {
  commandId: string;
  status: string;
  instanceIds: string[];
  successCount: number;
  failedCount: number;
  output?: string;
}

export interface LambdaFunction {
  name: string;
  arn: string;
  runtime: string;
  memory: number;
  timeout: number;
  lastModified: string;
}

export interface LambdaInvocationResult {
  statusCode: number;
  executed: boolean;
  payload?: any;
}

export interface CloudWatchMetric {
  namespace: string;
  metricName: string;
  dimensions?: { name: string; value: string }[];
  period?: number;
  statistics?: string[];
}

export interface MetricDatapoint {
  timestamp: string;
  value: number;
  unit?: string;
}

export interface MetricData {
  metric: CloudWatchMetric;
  datapoints: MetricDatapoint[];
}