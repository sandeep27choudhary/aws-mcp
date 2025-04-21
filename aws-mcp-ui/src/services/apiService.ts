/**
 * AWS API service for the MCP Dashboard
 */

import { 
  ResourcesSummary, 
  CloudFormationStack,
  AutoScalingGroup,
  SSMDocument,
  SSMCommandResult,
  LambdaFunction,
  LambdaInvocationResult,
  CloudWatchMetric,
  MetricData
} from '../types/aws';

// Update with your actual API URL
const API_BASE_URL = '/api';

// Helper function for API requests
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Resources List
export const getResourcesSummary = (): Promise<ResourcesSummary> => {
  return fetchAPI('/resources-list');
};

// CloudFormation
export const getCloudFormationStacks = (): Promise<CloudFormationStack[]> => {
  return fetchAPI('/cloudformation/stacks');
};

export const deployCloudFormationStack = (
  stackName: string, 
  templateUrl: string, 
  parameters: Record<string, string>
): Promise<CloudFormationStack> => {
  return fetchAPI('/cloudformation/deploy', {
    method: 'POST',
    body: JSON.stringify({ stackName, templateUrl, parameters }),
  });
};

// Auto Scaling
export const getAutoScalingGroups = (): Promise<AutoScalingGroup[]> => {
  return fetchAPI('/autoscaling/groups');
};

export const scaleAutoScalingGroup = (
  groupName: string, 
  desiredCapacity: number
): Promise<AutoScalingGroup> => {
  return fetchAPI('/autoscaling/scale', {
    method: 'POST',
    body: JSON.stringify({ groupName, desiredCapacity }),
  });
};

// SSM
export const getSSMDocuments = (): Promise<SSMDocument[]> => {
  return fetchAPI('/ssm/documents');
};

export const runSSMCommand = (
  instanceIds: string[], 
  documentName: string, 
  parameters: Record<string, string[]>
): Promise<SSMCommandResult> => {
  return fetchAPI('/ssm/run-command', {
    method: 'POST',
    body: JSON.stringify({ instanceIds, documentName, parameters }),
  });
};

// CloudWatch
export const getAvailableMetrics = (): Promise<CloudWatchMetric[]> => {
  return fetchAPI('/cloudwatch/available-metrics');
};

export const getMetricData = (
  metrics: CloudWatchMetric[], 
  startTime: Date, 
  endTime: Date
): Promise<MetricData[]> => {
  return fetchAPI('/cloudwatch/metric-data', {
    method: 'POST',
    body: JSON.stringify({ 
      metrics, 
      startTime: startTime.toISOString(), 
      endTime: endTime.toISOString() 
    }),
  });
};

// Lambda
export const getLambdaFunctions = (): Promise<LambdaFunction[]> => {
  return fetchAPI('/lambda/functions');
};

export const invokeLambdaFunction = (
  functionName: string, 
  payload: any
): Promise<LambdaInvocationResult> => {
  return fetchAPI('/lambda/invoke', {
    method: 'POST',
    body: JSON.stringify({ functionName, payload }),
  });
};

export const getBackendRegion = async (): Promise<string> => {
  const res = await fetch('/api/region');
  const data = await res.json();
  return data.region;
};