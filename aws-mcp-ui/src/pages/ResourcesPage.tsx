import React, { useState, useEffect } from 'react';
import { getResourcesSummary } from '../services/apiService';
import { ResourcesSummary, EC2Instance, RDSInstance, IAMUser, S3Bucket, ECSCluster, ALB, Route53Record } from '../types/aws';
import { DataTable, StatusBadge, LoadingSpinner, Alert, Button } from '../components/ui';
import { Search, Filter, RefreshCw } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ResourcesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ec2' | 'rds' | 'iam' | 's3' | 'ecs' | 'alb' | 'route53'>('ec2');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);
  
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchResources();
    setRefreshing(false);
  };

  const filterResources = (items: any[]) => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      Object.values(item).some(value => 
        value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const tabs = [
    { id: 'ec2', label: 'EC2' },
    { id: 'rds', label: 'RDS' },
    { id: 'iam', label: 'IAM' },
    { id: 's3', label: 'S3' },
    { id: 'ecs', label: 'ECS' },
    { id: 'alb', label: 'ALB' },
    { id: 'route53', label: 'Route53' },
  ];

  const renderEC2Table = () => {
    const columns = [
      { key: 'name', header: 'Name' },
      { key: 'id', header: 'Instance ID' },
      { key: 'instanceType', header: 'Type' },
      { 
        key: 'status', 
        header: 'Status',
        accessor: (row: EC2Instance) => <StatusBadge status={row.status} />
      },
      { key: 'publicIp', header: 'Public IP' },
      { key: 'privateIp', header: 'Private IP' },
      { key: 'region', header: 'Region' }
    ];

    return (
      <DataTable<EC2Instance>
        columns={columns}
        data={filterResources(resources?.ec2Instances || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderRDSTable = () => {
    const columns = [
      { key: 'name', header: 'Name' },
      { key: 'id', header: 'DB ID' },
      { key: 'engine', header: 'Engine' },
      { key: 'size', header: 'Size' },
      { 
        key: 'status', 
        header: 'Status',
        accessor: (row: RDSInstance) => <StatusBadge status={row.status} />
      },
      { key: 'endpoint', header: 'Endpoint' },
      { key: 'region', header: 'Region' }
    ];

    return (
      <DataTable<RDSInstance>
        columns={columns}
        data={filterResources(resources?.rdsInstances || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderIAMTable = () => {
    const columns = [
      { key: 'name', header: 'Username' },
      { key: 'arn', header: 'ARN' },
      { 
        key: 'console_access', 
        header: 'Console Access',
        accessor: (row: IAMUser) => row.console_access ? 'Yes' : 'No'
      },
      { key: 'last_activity', header: 'Last Activity' },
      { 
        key: 'status', 
        header: 'Status',
        accessor: (row: IAMUser) => <StatusBadge status={row.status} />
      }
    ];

    return (
      <DataTable<IAMUser>
        columns={columns}
        data={filterResources(resources?.iamUsers || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderS3Table = () => {
    const columns = [
      { key: 'name', header: 'Bucket Name' },
      { key: 'region', header: 'Region' },
      { key: 'createdAt', header: 'Created' },
      { 
        key: 'size', 
        header: 'Size',
        accessor: (row: S3Bucket) => row.size || 'Unknown'
      },
      {
        key: 'objectCount',
        header: 'Objects',
        accessor: (row: S3Bucket) => row.objectCount?.toString() || 'Unknown'
      }
    ];

    return (
      <DataTable<S3Bucket>
        columns={columns}
        data={filterResources(resources?.s3Buckets || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderECSTable = () => {
    const columns = [
      { key: 'name', header: 'Cluster Name' },
      { key: 'region', header: 'Region' },
      { key: 'serviceCount', header: 'Services' },
      { key: 'taskCount', header: 'Tasks' },
      { 
        key: 'status', 
        header: 'Status',
        accessor: (row: ECSCluster) => <StatusBadge status={row.status} />
      }
    ];

    return (
      <DataTable<ECSCluster>
        columns={columns}
        data={filterResources(resources?.ecsClusters || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderALBTable = () => {
    const columns = [
      { key: 'name', header: 'Name' },
      { key: 'dnsName', header: 'DNS Name' },
      { key: 'scheme', header: 'Scheme' },
      { key: 'region', header: 'Region' },
      { 
        key: 'status', 
        header: 'Status',
        accessor: (row: ALB) => <StatusBadge status={row.status} />
      }
    ];

    return (
      <DataTable<ALB>
        columns={columns}
        data={filterResources(resources?.albs || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderRoute53Table = () => {
    const columns = [
      { key: 'name', header: 'Record Name' },
      { key: 'recordType', header: 'Type' },
      { key: 'recordValue', header: 'Value' },
      { 
        key: 'ttl', 
        header: 'TTL',
        accessor: (row: Route53Record) => row.ttl?.toString() || 'Auto'
      }
    ];

    return (
      <DataTable<Route53Record>
        columns={columns}
        data={filterResources(resources?.route53Records || [])}
        keyField="id"
        isLoading={loading}
      />
    );
  };

  const renderActiveTable = () => {
    switch (activeTab) {
      case 'ec2': return renderEC2Table();
      case 'rds': return renderRDSTable();
      case 'iam': return renderIAMTable();
      case 's3': return renderS3Table();
      case 'ecs': return renderECSTable();
      case 'alb': return renderALBTable();
      case 'route53': return renderRoute53Table();
      default: return null;
    }
  };

  if (loading && !resources) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading AWS resources...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AWS Resources</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View and manage your AWS resources
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 pr-4 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <Button
            variant="outline"
            icon={<Filter className="h-5 w-5" />}
          >
            Filter
          </Button>
          <Button
            variant="primary"
            icon={<RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            isLoading={refreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="overflow-x-auto">
          {renderActiveTable()}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;