import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['Basic LCA Analysis', 'Limited Scenarios', 'Standard Reports'],
      tier: 'free'
    },
    {
      name: 'Professional',
      price: '$49',
      features: ['Advanced LCA Analysis', 'Unlimited Scenarios', 'Priority Support', 'Export as PDF/CSV'],
      tier: 'professional',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      features: ['Custom AI Models', 'API Access', 'Dedicated Support', 'Team Collaboration'],
      tier: 'enterprise'
    }
  ];

  const handleSubscribe = async (tier) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/subscription/checkout', 
        { plan: tier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(response.data.message);
      // Update local user state
      setUser({
        ...user,
        subscriptionTier: response.data.user.subscriptionTier,
        subscriptionStatus: response.data.user.subscriptionStatus,
        subscriptionExpires: response.data.user.subscriptionExpires
      });
      
      // Redirect to app after a delay
      setTimeout(() => {
        window.location.href = '/app';
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Choose Your Plan</h1>
        <p>Unlock the full power of ECOMINE and start your sustainability journey today.</p>
      </div>

      {message && <div className={`message-banner ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.tier} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
            {plan.recommended && <div className="recommended-badge">Most Popular</div>}
            <h2 className="plan-name">{plan.name}</h2>
            <div className="plan-price">
              <span className="amount">{plan.price}</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className={`subscribe-btn ${plan.recommended ? 'primary' : 'secondary'}`}
              onClick={() => handleSubscribe(plan.tier)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
