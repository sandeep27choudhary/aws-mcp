import React, { useState, useEffect } from 'react';
import { getCloudFormationStacks, deployCloudFormationStack } from '../services/apiService';
import { CloudFormationStack } from '../types/aws';
import { DataTable, StatusBadge, LoadingSpinner, Alert, Button } from '../components/ui';
import { PlusCircle, RefreshCw } from 'lucide-react';

const CloudFormationPage: React.FC = () => {
  const [stacks, setStacks] = useState<CloudFormationStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [deployFormData, setDeployFormData] = useState({
    stackName: '',
    templateUrl: '',
    parameters: {} as Record<string, string>,
    parameterKeys: [''] as string[],
    parameterValues: [''] as string[]
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      setLoading(true);
      const data = await getCloudFormationStacks();
      setStacks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load CloudFormation stacks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParameter = () => {
    setDeployFormData(prev => ({
      ...prev,
      parameterKeys: [...prev.parameterKeys, ''],
      parameterValues: [...prev.parameterValues, '']
    }));
  };

  const handleRemoveParameter = (index: number) => {
    setDeployFormData(prev => {
      const newKeys = [...prev.parameterKeys];
      const newValues = [...prev.parameterValues];
      newKeys.splice(index, 1);
      newValues.splice(index, 1);
      return {
        ...prev,
        parameterKeys: newKeys,
        parameterValues: newValues
      };
    });
  };

  const handleParameterChange = (index: number, type: 'key' | 'value', value: string) => {
    setDeployFormData(prev => {
      if (type === 'key') {
        const newKeys = [...prev.parameterKeys];
        newKeys[index] = value;
        return { ...prev, parameterKeys: newKeys };
      } else {
        const newValues = [...prev.parameterValues];
        newValues[index] = value;
        return { ...prev, parameterValues: newValues };
      }
    });
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsDeploying(true);
      
      // Build parameters object
      const parameters: Record<string, string> = {};
      deployFormData.parameterKeys.forEach((key, index) => {
        if (key.trim()) {
          parameters[key] = deployFormData.parameterValues[index];
        }
      });
      
      await deployCloudFormationStack(
        deployFormData.stackName,
        deployFormData.templateUrl,
        parameters
      );
      
      // Reset form
      setDeployFormData({
        stackName: '',
        templateUrl: '',
        parameters: {},
        parameterKeys: [''],
        parameterValues: ['']
      });
      
      setShowDeployForm(false);
      setSuccessMessage('Stack deployment initiated successfully');
      
      // Refresh stacks
      fetchStacks();
    } catch (err: any) {
      setError(`Failed to deploy stack: ${err.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const columns = [
    { key: 'stackName', header: 'Stack Name' },
    { key: 'stackId', header: 'Stack ID' },
    { 
      key: 'status', 
      header: 'Status',
      accessor: (row: CloudFormationStack) => <StatusBadge status={row.status} />
    },
    { key: 'createdTime', header: 'Created' },
    { key: 'lastUpdatedTime', header: 'Last Updated' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CloudFormation</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Deploy and manage CloudFormation stacks
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Button
            variant="outline"
            icon={<RefreshCw className="h-5 w-5" />}
            onClick={fetchStacks}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<PlusCircle className="h-5 w-5" />}
            onClick={() => setShowDeployForm(!showDeployForm)}
          >
            Deploy Stack
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" onClose={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} className="mb-6" onClose={() => setSuccessMessage(null)} />}

      {showDeployForm && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Deploy New Stack</h2>
            <form onSubmit={handleDeploy}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stack Name
                  </label>
                  <input
                    type="text"
                    required
                    value={deployFormData.stackName}
                    onChange={(e) => setDeployFormData({ ...deployFormData, stackName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Template URL
                  </label>
                  <input
                    type="text"
                    required
                    value={deployFormData.templateUrl}
                    onChange={(e) => setDeployFormData({ ...deployFormData, templateUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://s3.amazonaws.com/bucket/template.yaml"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Parameters</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddParameter}
                  >
                    Add Parameter
                  </Button>
                </div>
                
                {deployFormData.parameterKeys.map((key, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={key}
                      onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={deployFormData.parameterValues[index]}
                      onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                    {deployFormData.parameterKeys.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParameter(index)}
                        className="px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeployForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isDeploying}
                >
                  Deploy Stack
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable<CloudFormationStack>
            columns={columns}
            data={stacks}
            keyField="stackId"
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CloudFormationPage;