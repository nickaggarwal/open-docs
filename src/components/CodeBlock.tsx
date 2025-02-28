import React, { useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CodeIcon from '@mui/icons-material/Code';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language = 'bash',
  filename,
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLanguageIcon = () => {
    switch (language) {
      case 'js':
      case 'javascript':
        return <span>JS</span>;
      case 'ts':
      case 'typescript':
        return <span>TS</span>;
      case 'jsx':
      case 'tsx':
        return <span>TSX</span>;
      case 'bash':
      case 'shell':
        return <span>$</span>;
      default:
        return <CodeIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ position: 'relative', my: 3 }}>
      {filename && (
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '0.85rem',
            padding: '0.5rem 1rem',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderLanguageIcon()}
          <Typography
            component="span"
            sx={{
              ml: 1,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
            }}
          >
            {filename}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: '#f8f8f2',
          padding: '1rem',
          paddingRight: '2.5rem',
          borderRadius: filename ? '0 8px 8px 8px' : 8,
          fontSize: '0.9rem',
          fontFamily: 'monospace',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        <pre
          style={{
            margin: 0,
            fontSize: '0.9rem',
            fontFamily: 'monospace',
            lineHeight: 1.5,
            tabSize: 2,
          }}
        >
          <code>{children}</code>
        </pre>

        <Button
          size="small"
          variant="text"
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            minWidth: 'auto',
            padding: '4px',
            color: copied ? theme.palette.success.main : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </Button>
      </Box>
    </Box>
  );
}; 