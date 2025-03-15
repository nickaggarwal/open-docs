import React, { useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { TabGroup, Tab } from './Tabs';
import { BootstrapTable } from './BootstrapTable';
import remarkGfm from 'remark-gfm';
import MDXRenderer from './MDXRenderer'; // Import MDXRenderer as fallback

// Define custom components to be used in MDX
const components = {
  Callout,
  CodeBlock,
  TabGroup,
  Tab,
  // Add new callout components that map to Callout with different types
  Note: (props: any) => {
    // Ensure props.children is properly rendered
    return <Callout type="note" {...props} />;
  },
  Warning: (props: any) => {
    return <Callout type="warning" {...props} />;
  },
  Tip: (props: any) => {
    return <Callout type="tip" {...props} />;
  },
  Info: (props: any) => {
    return <Callout type="info" {...props} />;
  },
  Caution: (props: any) => {
    return <Callout type="caution" {...props} />;
  },
  table: BootstrapTable,
  thead: (props: any) => <thead className="table-light" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr {...props} />,
  th: (props: any) => <th scope="col" className="fw-bold" {...props} />,
  td: (props: any) => <td {...props} />,
  a: (props: any) => <a {...props} style={{ color: '#2196f3', textDecoration: 'none' }} />,
  h1: (props: any) => <Typography variant="h1" component="h1" {...props} sx={{ mt: 4, mb: 2 }} />,
  h2: (props: any) => <Typography variant="h2" component="h2" {...props} sx={{ mt: 4, mb: 2 }} />,
  h3: (props: any) => <Typography variant="h3" component="h3" {...props} sx={{ mt: 3, mb: 2 }} />,
  h4: (props: any) => <Typography variant="h4" component="h4" {...props} sx={{ mt: 3, mb: 2 }} />,
  h5: (props: any) => <Typography variant="h5" component="h5" {...props} sx={{ mt: 2, mb: 1 }} />,
  h6: (props: any) => <Typography variant="h6" component="h6" {...props} sx={{ mt: 2, mb: 1 }} />,
  p: (props: any) => <Typography paragraph {...props} />,
  code: (props: any) => {
    // If it's inside a pre, it's a code block, otherwise it's inline code
    if (props.className) {
      const language = props.className.replace('language-', '');
      // For code blocks, preserve exact content without processing
      const codeContent = typeof props.children === 'string' 
        ? props.children 
        : (Array.isArray(props.children) ? props.children.join('') : String(props.children));
      return <CodeBlock language={language}>{codeContent}</CodeBlock>;
    }
    return (
      <Typography component="code" 
        sx={{ 
          fontFamily: 'monospace',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: '2px 4px',
          borderRadius: '4px',
          fontSize: '0.9em',
        }}
        {...props} 
      />
    );
  },
  pre: (props: any) => {
    // Ensure pre tag content is preserved as written
    return <div {...props} />;
  }, // CodeBlock will handle styling
  // Add more component mappings as needed
};

// Define individual callout components for the MDX context
const Note = (props: any) => <Callout type="note" {...props} />;
const Warning = (props: any) => <Callout type="warning" {...props} />;
const Tip = (props: any) => <Callout type="tip" {...props} />;
const Info = (props: any) => <Callout type="info" {...props} />;
const Caution = (props: any) => <Callout type="caution" {...props} />;

interface MDXProcessorProps {
  content: string;
}

const MDXProcessor: React.FC<MDXProcessorProps> = ({ content }) => {
  const [mdxModule, setMdxModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useRenderer, setUseRenderer] = useState(false);

  useEffect(() => {
    async function processMdx() {
      if (!content) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check for potential problematic patterns
        if (content.includes('export default') || content.includes('export function')) {
          // Use MDXRenderer instead if content has complex exports
          setUseRenderer(true);
          setLoading(false);
          return;
        }
        
        // Wrap the content with proper MDX imports and add the callout components
        const wrappedContent = `
          import { Callout } from '../components/Callout';
          import { CodeBlock } from '../components/CodeBlock';
          import { TabGroup, Tab } from '../components/Tabs';
          
          ${content}
        `;
        
        try {
          // Compile MDX to JSX with safety precautions
          const compiled = await compile(wrappedContent, {
            outputFormat: 'function-body',
            development: true,
            remarkPlugins: [remarkGfm]
          });
          
          // Convert the compiled output to a module
          const code = String(compiled);
          
          // Use Function constructor to create a module from the compiled code
          const fn = new Function(
            'React', 
            ...Object.keys(runtime),
            'components',
            'Callout',
            'CodeBlock',
            'TabGroup',
            'Tab',
            'Note',
            'Warning',
            'Tip',
            'Info',
            'Caution',
            `${code}; return MDXContent;`
          );
          
          // Execute the function to get the MDXContent component
          try {
            const MDXContent = fn(
              React, 
              ...Object.values(runtime),
              components,
              Callout,
              CodeBlock, 
              TabGroup,
              Tab,
              Note,
              Warning,
              Tip,
              Info,
              Caution
            );
            
            setMdxModule({ default: MDXContent });
            setLoading(false);
          } catch (executionError) {
            console.error('Error executing MDX:', executionError);
            setUseRenderer(true);
            setLoading(false);
          }
        } catch (compileError: any) {
          console.error('MDX compilation error:', compileError);
          // Fall back to MDXRenderer
          setUseRenderer(true);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error processing MDX:', err);
        // Fall back to MDXRenderer
        setUseRenderer(true);
        setLoading(false);
      }
    }

    processMdx();
  }, [content]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If there was an error or we explicitly want to use MDXRenderer, fall back to it
  if (useRenderer) {
    return <MDXRenderer content={content} />;
  }

  if (!mdxModule) {
    return <Typography>No content to display</Typography>;
  }

  const MDXComponent = mdxModule.default;
  
  return (
    <MDXProvider components={components}>
      <Box 
        sx={{
          '& a': {
            color: 'primary.main',
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
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2,
            py: 1,
            my: 2,
            bgcolor: 'action.hover',
            fontStyle: 'italic',
          },
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'divider',
            my: 3,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '4px',
          },
        }}
      >
        <MDXComponent />
      </Box>
    </MDXProvider>
  );
};

export default MDXProcessor; 