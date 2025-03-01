import React from 'react';

type CalloutType = 'info' | 'warning' | 'error' | 'success';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

/**
 * Callout Component
 * 
 * Displays an emphasized box with different styles based on the callout type
 */
export const Callout: React.FC<CalloutProps> = ({ type = 'info', children }) => {
  // Bootstrap alert classes and icons based on callout type
  const alertConfig = {
    info: {
      className: 'alert-primary',
      iconClass: 'bi bi-info-circle-fill',
    },
    warning: {
      className: 'alert-warning',
      iconClass: 'bi bi-exclamation-triangle-fill',
    },
    error: {
      className: 'alert-danger',
      iconClass: 'bi bi-exclamation-circle-fill',
    },
    success: {
      className: 'alert-success',
      iconClass: 'bi bi-check-circle-fill',
    },
  };

  const { className, iconClass } = alertConfig[type];

  return (
    <div className={`alert ${className} d-flex align-items-center my-4`} role="alert">
      <div className="me-3">
        <i className={iconClass}></i>
      </div>
      <div>{children}</div>
    </div>
  );
}; 