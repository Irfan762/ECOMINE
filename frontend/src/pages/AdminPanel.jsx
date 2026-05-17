import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AppContext } from '../context/AppContext';
import { ArrowRightIcon, CloseIcon, TrendingUpIcon, SettingsIcon } from '../components/Icons';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const newUser = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      company: e.target.company.value,
      role: e.target.role.value,
      subscriptionTier: e.target.tier.value
    };

    try {
      await api.post('/admin/users', newUser);
      setShowAddUserModal(false);
      fetchData();
      showNotification('User created successfully');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to create user', 'error');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, demoRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
        api.get('/demo/requests')
      ]);
      
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setDemoRequests(demoRes.data);
    } catch (err) {
      showNotification('Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, status) => {
    try {
      await api.put('/admin/subscription', { userId, status, isApproved: status === 'approved' });
      fetchData();
      showNotification('Request sent successfully');
    } catch (err) {
      showNotification('Failed to update user status', 'error');
    }
  };

  const handleDemoStatus = async (id, status) => {
    try {
      await api.put(`/demo/requests/${id}`, { status });
      fetchData();
      showNotification('Request sent successfully');
    } catch (err) {
      showNotification('Failed to update demo request', 'error');
    }
  };

  const handleUpdateSubscription = async (userId, tier, status) => {
    try {
      await api.put('/admin/subscription', 
        { userId, subscriptionTier: tier, subscriptionStatus: status }
      );
      fetchData(); // Refresh data
      showNotification('User updated successfully');
    } catch (err) {
      showNotification('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
      showNotification('User deleted successfully');
    } catch (err) {
      showNotification('Failed to delete user', 'error');
    }
  };

  if (loading) return <div className="admin-loading">Loading Admin Dashboard...</div>;

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-logo">ECOMINE <span>ADMIN</span></div>
        <nav>
          <button 
            className={activeSection === 'users' ? 'active' : ''} 
            onClick={() => setActiveSection('users')}
          >
            All Users
          </button>
          <button 
            className={activeSection === 'approvals' ? 'active' : ''} 
            onClick={() => setActiveSection('approvals')}
          >
            User Approvals {users.filter(u => u.status === 'pending').length > 0 && <span className="notif-badge">{users.filter(u => u.status === 'pending').length}</span>}
          </button>
          <button 
            className={activeSection === 'demo' ? 'active' : ''} 
            onClick={() => setActiveSection('demo')}
          >
            Demo Requests {demoRequests.filter(r => r.status === 'pending').length > 0 && <span className="notif-badge">{demoRequests.filter(r => r.status === 'pending').length}</span>}
          </button>
          <button 
            className={activeSection === 'revenue' ? 'active' : ''} 
            onClick={() => setActiveSection('revenue')}
          >
            Revenue Stats
          </button>
          <button 
            className={activeSection === 'settings' ? 'active' : ''} 
            onClick={() => setActiveSection('settings')}
          >
            Platform Settings
          </button>
          <div className="sidebar-divider"></div>
          <button className="back-btn" onClick={() => navigate('/app')}>
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><ArrowRightIcon /></span> Back to App
          </button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeSection === 'users' && 'All Registered Users'}
            {activeSection === 'approvals' && 'Pending Approvals'}
            {activeSection === 'demo' && 'Platform Demo Requests'}
            {activeSection === 'revenue' && 'Revenue & Growth'}
            {activeSection === 'settings' && 'Platform Configuration'}
          </h1>
          <div className="admin-header-actions">
            <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
              <span>+</span> Add New User
            </button>
            <div className="admin-user-info">Admin Dashboard</div>
          </div>
        </header>

        {showAddUserModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <button className="close-modal" onClick={() => setShowAddUserModal(false)}><CloseIcon /></button>
              <h2>Create New Account</h2>
              <form onSubmit={handleCreateUser}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" name="company" />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role">
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subscription Tier</label>
                    <select name="tier">
                      <option value="free">Free</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-save">Create User Account</button>
              </form>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <>
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
        </>
        )}

        {activeSection === 'approvals' && (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.status === 'pending').map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.company || 'N/A'}</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td>
                      <button className="approve-btn" onClick={() => handleUpdateStatus(u._id, 'approved')}>Approve</button>
                      <button className="delete-btn" onClick={() => handleUpdateStatus(u._id, 'blocked')}>Block</button>
                    </td>
                  </tr>
                ))}
                {users.filter(u => u.status === 'pending').length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No pending approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'demo' && (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoRequests.map(r => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.company}</td>
                    <td title={r.message}>{r.message?.substring(0, 30)}...</td>
                    <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
                    <td>
                      <select 
                        value={r.status}
                        onChange={(e) => handleDemoStatus(r._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'revenue' && (
          <div className="admin-placeholder">
            <div className="placeholder-icon"><TrendingUpIcon width="48" height="48" /></div>
            <h2>Revenue Analytics</h2>
            <p>Financial charts, subscription growth, and churn metrics will appear here.</p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="admin-placeholder">
            <div className="placeholder-icon"><SettingsIcon width="48" height="48" /></div>
            <h2>Platform Settings</h2>
            <p>Global system configuration, API keys, and model parameters management.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
