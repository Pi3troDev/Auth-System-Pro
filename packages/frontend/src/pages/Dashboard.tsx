import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CreateUserForm } from '../components/CreateUserForm';
import { healthCheck } from '../services/api';
import { User } from '../types/User';

export const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [serverStatus, setServerStatus] = useState<string>('Checking...');

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await healthCheck();
      setServerStatus(`✅ Server is running (${response.status})`);
    } catch (error) {
      setServerStatus(
        '❌ Server is not responding. Make sure backend is running on http://localhost:3000'
      );
    }
  };

  const handleUserCreated = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            padding: '15px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Server Status:</strong> {serverStatus}
          </p>
        </div>

        <CreateUserForm onUserCreated={handleUserCreated} />

        {users.length > 0 && (
          <div style={{ maxWidth: '600px', margin: '30px auto' }}>
            <h2>Created Users</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                  }}
                >
                  <strong>{user.name}</strong>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    {user.email}
                  </p>
                  <small style={{ color: '#999' }}>
                    Created: {new Date(user.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
