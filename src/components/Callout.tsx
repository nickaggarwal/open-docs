import React from 'react';
import './Callout.css';

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'note' | 'tip' | 'caution';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

/**
 * Callout Component
 * 
 * Displays an emphasized box with different styles based on the callout type:
 * - note: Useful information
 * - warning: Attention-requiring warnings
 * - tip: Helpful tips to improve workflow
 * - info: Additional context or background information
 * - caution: Highlights potential issues or pitfalls
 * - error: Error messages
 * - success: Success messages
 */
export const Callout: React.FC<CalloutProps> = ({ type = 'info', children }) => {
  // Configuration for different callout types
  const calloutConfig = {
    note: {
      title: 'Note',
      iconClass: 'bi bi-journal-text',
      bgColor: '#cfe2ff',
      borderColor: '#0d6efd',
      textColor: '#084298'
    },
    info: {
      title: 'Info',
      iconClass: 'bi bi-info-circle-fill',
      bgColor: '#cff4fc',
      borderColor: '#0dcaf0',
      textColor: '#055160'
    },
    tip: {
      title: 'Tip',
      iconClass: 'bi bi-lightbulb-fill',
      bgColor: '#d1e7dd',
      borderColor: '#198754',
      textColor: '#0a3622'
    },
    warning: {
      title: 'Warning',
      iconClass: 'bi bi-exclamation-triangle-fill',
      bgColor: '#fff3cd',
      borderColor: '#ffc107',
      textColor: '#664d03'
    },
    caution: {
      title: 'Caution',
      iconClass: 'bi bi-shield-exclamation',
      bgColor: '#fff3cd',
      borderColor: '#fd7e14',
      textColor: '#664d03'
    },
    error: {
      title: 'Error',
      iconClass: 'bi bi-exclamation-circle-fill',
      bgColor: '#f8d7da',
      borderColor: '#dc3545',
      textColor: '#842029'
    },
    success: {
      title: 'Success',
      iconClass: 'bi bi-check-circle-fill',
      bgColor: '#d1e7dd',
      borderColor: '#198754',
      textColor: '#0a3622'
    },
  };

  const config = calloutConfig[type];

  // Use CSS variables for styling - this allows class-based overrides
  const cssVariables = {
    '--callout-bg-color': config.bgColor,
    '--callout-border-color': config.borderColor,
    '--callout-text-color': config.textColor,
  } as React.CSSProperties;

  return (
    <div 
      className={`callout callout-${type}`} 
      style={cssVariables}
    >
      <div className="callout-icon">
        <i className={config.iconClass}></i>
      </div>
      <div className="callout-content">
        <div className="callout-title">
          {config.title}
        </div>
        <div className="callout-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Note Callout
 * For general information that supplements the main content
 */
export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="note">{children}</Callout>;
};

/**
 * Info Callout
 * For providing additional context or background information
 */
export const Info: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="info">{children}</Callout>;
};

/**
 * Tip Callout
 * For helpful tips to improve workflow
 */
export const Tip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="tip">{children}</Callout>;
};

/**
 * Warning Callout
 * For attention-requiring warnings
 */
export const Warning: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="warning">{children}</Callout>;
};

/**
 * Caution Callout
 * For highlighting potential issues or pitfalls
 */
export const Caution: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="caution">{children}</Callout>;
};

/**
 * Error Callout
 * For error messages or critical issues
 */
export const Error: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="error">{children}</Callout>;
};

/**
 * Success Callout
 * For success messages or positive feedback
 */
export const Success: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Callout type="success">{children}</Callout>;
}; 