import React, { ReactNode } from 'react';
import { Box, useTheme, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { TabGroup, Tab } from './Tabs';

interface MDXContentProps {
  children: ReactNode;
}

// MDX components mapping - these will replace standard HTML elements
const components = {
  a: (props: any) => {
    const isExternal = props.href.startsWith('http');
    return isExternal ? (
      <Link href={props.href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <Link component={RouterLink} to={props.href} {...props} />
    );
  },
  pre: (props: any) => {
    // Extract language from className (added by MDX)
    const language = props.className?.replace('language-', '') || 'plaintext';
    return <CodeBlock language={language}>{props.children}</CodeBlock>;
  },
  // Add more component overrides here
};

const MDXContent: React.FC<MDXContentProps> = ({ children }) => {
  const theme = useTheme();
  
  console.log('MDXContent rendering with children:', children);
  
  return (
    <Box
      sx={{
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          color: 'var(--text-color)',
          fontWeight: 700,
          lineHeight: 1.2,
          mt: 4,
          mb: 2,
        },
        '& h1': {
          fontSize: { xs: '2.5rem', md: '3rem' },
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          pb: 2,
        },
        '& h2': {
          fontSize: { xs: '2rem', md: '2.25rem' },
        },
        '& h3': {
          fontSize: { xs: '1.5rem', md: '1.75rem' },
        },
        '& h4': {
          fontSize: { xs: '1.25rem', md: '1.5rem' },
        },
        '& h5': {
          fontSize: { xs: '1.1rem', md: '1.25rem' },
        },
        '& h6': {
          fontSize: { xs: '1rem', md: '1.1rem' },
        },
        '& p': {
          color: 'var(--text-color)',
          lineHeight: 1.7,
          mb: 2,
        },
        '& a': {
          color: 'var(--primary-color)',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& ul, & ol': {
          pl: 3,
          mb: 2,
        },
        '& li': {
          mb: 1,
        },
        '& blockquote': {
          borderLeft: '4px solid var(--primary-color)',
          pl: 2,
          py: 1,
          my: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          fontStyle: 'italic',
        },
        '& code': {
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: '2px 4px',
          borderRadius: '4px',
          fontSize: '0.9em',
        },
        '& pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: 2,
          borderRadius: '4px',
          overflow: 'auto',
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
          },
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          mb: 2,
        },
        '& th, & td': {
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: 1,
        },
        '& th': {
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          fontWeight: 600,
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
        },
        '& hr': {
          border: 'none',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          my: 3,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MDXContent; 