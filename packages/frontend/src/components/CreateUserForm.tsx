import { useState } from 'react';
import { userApi } from '../services/api';
import { ApiResponse, User } from '../types/User';

export const CreateUserForm = ({
  onUserCreated,
}: {
  onUserCreated: (user: any) => void;
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = (await userApi.create(
        formData.email,
        formData.password,
        formData.name
      )) as ApiResponse<User>;

      setSuccess(true);
      onUserCreated(response.data);
      setFormData({ email: '', password: '', name: '' });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Create User</h2>

      {error && (
        <div
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#fee',
            border: '1px solid #f00',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#efe',
            border: '1px solid #0f0',
            borderRadius: '4px',
            color: '#0a0',
          }}
        >
          ✅ User created successfully!
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="John Doe"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="john@example.com"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
