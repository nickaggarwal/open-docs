import React, { DetailedHTMLProps, TableHTMLAttributes } from 'react';

interface BootstrapTableProps extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  children?: React.ReactNode;
}

export const BootstrapTable: React.FC<BootstrapTableProps> = ({ children, className, ...props }) => {
  return (
    <div className="table-responsive">
      <table 
        className={`table table-striped table-bordered ${className || ''}`} 
        style={{ 
          width: '100%',
          marginBottom: '0.5rem',
          border: '1px solid var(--border-color, #dee2e6)'
        }} 
        {...props}
      >
        {children}
      </table>
    </div>
  );
}; 