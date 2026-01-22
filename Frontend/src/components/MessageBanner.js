import React from 'react';
import './MessageBanner.css';

/**
 * Message Banner Component
 * Displays success/error/info messages
 */
function MessageBanner({ message, type = 'info' }) {
  return (
    <div className={`message-banner message-${type}`}>
      <div className="message-content">
        {type === 'error' && <span className="icon">❌</span>}
        {type === 'success' && <span className="icon">✅</span>}
        {type === 'info' && <span className="icon">ℹ️</span>}
        <span className="text">{message}</span>
      </div>
    </div>
  );
}

export default MessageBanner;
