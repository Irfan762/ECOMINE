import React from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast-container ${type}`} onClick={onClose}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      <div className="toast-progress"></div>
    </div>
  );
};

export default Toast;
