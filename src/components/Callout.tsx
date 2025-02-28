import React, { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type CalloutType = 'info' | 'warning' | 'error' | 'success';

interface CalloutProps {
  children: ReactNode;
  type?: CalloutType;
  title?: string;
}

export const Callout: React.FC<CalloutProps> = ({ 
  children, 
  type = 'info',
  title 
}) => {
  const getConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: <WarningIcon />,
          color: '#ff9800',
          bgColor: 'rgba(255, 152, 0, 0.1)',
          borderColor: 'rgba(255, 152, 0, 0.3)',
          defaultTitle: 'Warning'
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: '#f44336',
          bgColor: 'rgba(244, 67, 54, 0.1)',
          borderColor: 'rgba(244, 67, 54, 0.3)',
          defaultTitle: 'Error'
        };
      case 'success':
        return {
          icon: <CheckCircleIcon />,
          color: '#4caf50',
          bgColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: 'rgba(76, 175, 80, 0.3)',
          defaultTitle: 'Success'
        };
      case 'info':
      default:
        return {
          icon: <InfoIcon />,
          color: '#2196f3',
          bgColor: 'rgba(33, 150, 243, 0.1)',
          borderColor: 'rgba(33, 150, 243, 0.3)',
          defaultTitle: 'Note'
        };
    }
  };

  const config = getConfig();
  const displayTitle = title || config.defaultTitle;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        my: 3,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: 1,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ 
          color: config.color,
          pt: '2px',
          flexShrink: 0
        }}>
          {config.icon}
        </Box>
        
        <Box>
          {displayTitle && (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ 
                fontWeight: 600,
                color: config.color,
                mb: 0.5
              }}
            >
              {displayTitle}
            </Typography>
          )}
          
          <Box sx={{ 
            '& p': { 
              m: 0,
              color: 'text.primary' 
            },
            '& a': {
              color: config.color,
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}; 