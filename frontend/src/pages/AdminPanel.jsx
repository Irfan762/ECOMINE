import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/stats', config)
      ]);
      
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId, tier, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/admin/subscription', 
        { userId, subscriptionTier: tier, subscriptionStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">ECOMINE <span>ADMIN</span></div>
        <nav>
          <button className="active">Users Management</button>
          <button>Revenue Stats</button>
          <button>Platform Settings</button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>User Management</h1>
          <div className="admin-user-info">
            Admin Dashboard
          </div>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Active Subscriptions</h3>
              <div className="stat-value">{stats.activeSubscriptions}</div>
            </div>
            <div className="stat-card">
              <h3>Professional</h3>
              <div className="stat-value">{stats.professionalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Enterprise</h3>
              <div className="stat-value">{stats.enterpriseUsers}</div>
            </div>
          </div>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.company || 'N/A'}</td>
                  <td>
                    <select 
                      value={u.subscriptionTier} 
                      onChange={(e) => handleUpdateSubscription(u._id, e.target.value, u.subscriptionStatus)}
                    >
                      <option value="free">Free</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${u.subscriptionStatus}`}>
                      {u.subscriptionStatus}
                    </span>
                    <select 
                      value={u.subscriptionStatus}
                      onChange={(e) => handleUpdateSubscription(u._id, u.subscriptionTier, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
