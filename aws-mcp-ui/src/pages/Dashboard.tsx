import React, { useState, useEffect } from 'react';
import { Database, HardDrive, Users, Package, HardDriveUpload, BookOpen, Globe, Server } from 'lucide-react';
import { ResourceCard, LoadingSpinner, Alert, LineChart } from '../components/ui';
import { getResourcesSummary, getMetricData, getBackendRegion } from '../services/apiService';
import { ResourcesSummary, CloudWatchMetric, MetricDatapoint } from '../types/aws';
import IAMManager from './pages/IAMManager';

const Dashboard: React.FC = () => {
  const [resources, setResources] = useState<ResourcesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpuMetrics, setCpuMetrics] = useState<MetricDatapoint[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [backendRegion, setBackendRegion] = useState<string>('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await getResourcesSummary();
        setResources(data);
        setError(null);
      } catch (err) {
        setError('Failed to load resources. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMetrics = async () => {
      try {
        setMetricsLoading(true);
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        
        const cpuMetric: CloudWatchMetric = {
          namespace: 'AWS/EC2',
          metricName: 'CPUUtilization',
          dimensions: [
            { name: 'Environment', value: 'Production' }
          ]
        };
        
        const metricsData = await getMetricData([cpuMetric], twoHoursAgo, now);
        
        if (metricsData && metricsData.length > 0) {
          setCpuMetrics(metricsData[0].datapoints);
        }
      } catch (err) {
        console.error('Failed to load metrics', err);
      } finally {
        setMetricsLoading(false);
      }
    };

    getBackendRegion().then(setBackendRegion);
    fetchResources();
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading AWS resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Alert type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AWS Control Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Monitor and manage your AWS resources
        </p>
        {backendRegion && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Backend Region:</span> {backendRegion}
          </div>
        )}
      </div>

      {resources && (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resource Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResourceCard 
                title="EC2 Instances" 
                count={resources.ec2Instances.length} 
                resourceType="instances"
                icon={<Server className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                statusSummary={{
                  healthy: resources.ec2Instances.filter(i => i.status === 'running').length,
                  warning: resources.ec2Instances.filter(i => i.status === 'pending').length,
                  error: resources.ec2Instances.filter(i => i.status === 'stopped').length,
                }}
              />
              <ResourceCard 
                title="RDS Databases" 
                count={resources.rdsInstances.length} 
                resourceType="databases"
                icon={<Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                statusSummary={{
                  healthy: resources.rdsInstances.filter(i => i.status === 'available').length,
                  warning: resources.rdsInstances.filter(i => i.status === 'backing-up').length,
                  error: resources.rdsInstances.filter(i => i.status === 'failed').length,
                }}
              />
              <ResourceCard 
                title="S3 Buckets" 
                count={resources.s3Buckets.length} 
                resourceType="buckets"
                icon={<HardDriveUpload className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              />
              <ResourceCard 
                title="IAM Users" 
                count={resources.iamUsers.length} 
                resourceType="users"
                icon={<Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              />
              <ResourceCard 
                title="ECS Clusters" 
                count={resources.ecsClusters.length} 
                resourceType="clusters"
                icon={<Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                statusSummary={{
                  healthy: resources.ecsClusters.filter(i => i.status === 'ACTIVE').length,
                  warning: 0,
                  error: resources.ecsClusters.filter(i => i.status !== 'ACTIVE').length,
                }}
              />
              <ResourceCard 
                title="Load Balancers" 
                count={resources.albs.length} 
                resourceType="ALBs"
                icon={<HardDrive className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              />
              <ResourceCard 
                title="Route53 Records" 
                count={resources.route53Records.length} 
                resourceType="DNS records"
                icon={<Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              />
              <ResourceCard 
                title="Total Resources" 
                count={
                  resources.ec2Instances.length + 
                  resources.rdsInstances.length + 
                  resources.s3Buckets.length + 
                  resources.iamUsers.length + 
                  resources.ecsClusters.length + 
                  resources.albs.length + 
                  resources.route53Records.length
                } 
                resourceType="AWS resources"
                icon={<BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">EC2 CPU Utilization</h3>
                </div>
                <div className="p-4">
                  {metricsLoading ? (
                    <div className="flex items-center justify-center h-52">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <LineChart 
                      data={cpuMetrics}
                      height={200}
                      yAxisLabel="CPU %"
                      color="#F59E0B"
                    />
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">Region Distribution</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {Array.from(new Set([
                      ...resources.ec2Instances.map(i => i.region),
                      ...resources.rdsInstances.map(i => i.region),
                      ...resources.s3Buckets.map(i => i.region),
                      ...resources.ecsClusters.map(i => i.region),
                      ...resources.albs.map(i => i.region),
                    ])).filter(Boolean).map(region => {
                      const count =
                        resources.ec2Instances.filter(i => i.region === region).length +
                        resources.rdsInstances.filter(i => i.region === region).length +
                        resources.s3Buckets.filter(i => i.region === region).length +
                        resources.ecsClusters.filter(i => i.region === region).length +
                        resources.albs.filter(i => i.region === region).length;
                      const total =
                        resources.ec2Instances.length +
                        resources.rdsInstances.length +
                        resources.s3Buckets.length +
                        resources.ecsClusters.length +
                        resources.albs.length;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={region}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{region}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;