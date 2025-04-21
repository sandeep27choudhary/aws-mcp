import React, { useEffect, useState } from 'react';

const API = '/api/iam';

type User = {
  UserName: string;
  Arn: string;
  CreateDate: string;
  [key: string]: any;
};

export default function IAMManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [policyArn, setPolicyArn] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: newUser }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create user');
      setMessage(`User ${newUser} created`);
      setNewUser('');
      fetchUsers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (userName: string) => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API}/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to delete user');
      setMessage(`User ${userName} deleted`);
      fetchUsers();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAttachPolicy = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API}/users/attach-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: selectedUser, policy_arn: policyArn }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to attach policy');
      setMessage(`Policy attached to ${selectedUser}`);
      setPolicyArn('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDetachPolicy = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API}/users/detach-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: selectedUser, policy_arn: policyArn }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to detach policy');
      setMessage(`Policy detached from ${selectedUser}`);
      setPolicyArn('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">IAM User Management</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-600 mb-2">{message}</div>}

      <div className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1 rounded"
          placeholder="New user name"
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleCreate}
          disabled={!newUser}
        >
          Create User
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select User:</label>
        <select
          className="border px-2 py-1 rounded w-full"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select --</option>
          {users.map(u => (
            <option key={u.UserName} value={u.UserName}>
              {u.UserName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1 rounded flex-1"
          placeholder="Policy ARN"
          value={policyArn}
          onChange={e => setPolicyArn(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={handleAttachPolicy}
          disabled={!selectedUser || !policyArn}
        >
          Attach Policy
        </button>
        <button
          className="bg-yellow-600 text-white px-3 py-1 rounded"
          onClick={handleDetachPolicy}
          disabled={!selectedUser || !policyArn}
        >
          Detach Policy
        </button>
      </div>

      <h3 className="font-semibold mt-6 mb-2">Users</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User Name</th>
              <th className="border px-2 py-1">Created</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.UserName}>
                <td className="border px-2 py-1">{u.UserName}</td>
                <td className="border px-2 py-1">{u.CreateDate?.slice(0, 10)}</td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(u.UserName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-2">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 