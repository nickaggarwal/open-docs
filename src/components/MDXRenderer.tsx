import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { TabGroup, Tab } from './Tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MDXRendererProps {
  content: string;
}

/**
 * Preprocesses MDX content to make it compatible with markdown rendering
 * 
 * Handles conversion of custom components to markdown-friendly format
 */
const preprocessMDXContent = (mdxContent: string): string => {
  console.log("Preprocessing MDX content");
  
  // Extract frontmatter
  let processedContent = mdxContent.replace(/^---\n([\s\S]*?)\n---\n/, '');
  
  // Replace <Callout> components
  processedContent = processedContent.replace(
    /<Callout type="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, type, content) => {
      return `\n\n> **${type.toUpperCase()}**: ${content.trim()}\n\n`;
    }
  );
  
  // Replace <TabGroup> and <Tab> components
  processedContent = processedContent.replace(
    /<TabGroup>\s*([\s\S]*?)\s*<\/TabGroup>/g,
    (_, content) => {
      // Extract tabs
      const tabs: { title: string; content: string }[] = [];
      const tabRegex = /<Tab title="([^"]*)">\s*([\s\S]*?)\s*<\/Tab>/g;
      let match;
      
      while ((match = tabRegex.exec(content)) !== null) {
        tabs.push({
          title: match[1],
          content: match[2]
        });
      }
      
      // Format tabs as markdown sections
      return tabs.map(tab => `\n\n### ${tab.title}\n\n${tab.content}\n\n`).join('');
    }
  );
  
  // Remove any remaining JSX component imports
  processedContent = processedContent.replace(/import.*?from.*?;/g, '');
  
  // Handle export statements
  processedContent = processedContent.replace(/export.*?function.*?{[\s\S]*?}.*?<\/.*>/g, '');
  
  console.log("Preprocessed content:", processedContent.substring(0, 200) + "...");
  return processedContent;
};

// Define proper types for ReactMarkdown components
interface MarkdownComponentProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeBlockProps extends MarkdownComponentProps {
  inline?: boolean;
  className?: string;
}

/**
 * MDX Renderer Component
 * 
 * Renders MDX content with support for custom components
 */
const MDXRenderer: React.FC<MDXRendererProps> = ({ content }) => {
  const processedContent = preprocessMDXContent(content);
  
  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h1" component="h1" gutterBottom>
              {children}
            </Typography>
          ),
          h2: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h2" component="h2" gutterBottom>
              {children}
            </Typography>
          ),
          h3: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h3" component="h3" gutterBottom>
              {children}
            </Typography>
          ),
          h4: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h4" component="h4" gutterBottom>
              {children}
            </Typography>
          ),
          h5: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h5" component="h5" gutterBottom>
              {children}
            </Typography>
          ),
          h6: ({ children }: MarkdownComponentProps) => (
            <Typography variant="h6" component="h6" gutterBottom>
              {children}
            </Typography>
          ),
          p: ({ children }: MarkdownComponentProps) => (
            <Typography paragraph component="p">
              {children}
            </Typography>
          ),
          a: ({ href, children }: MarkdownComponentProps) => {
            const isExternal = href?.startsWith('http');
            return isExternal ? (
              <MuiLink href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </MuiLink>
            ) : (
              <MuiLink component={RouterLink} to={href || '#'}>
                {children}
              </MuiLink>
            );
          },
          code: ({ inline, className, children }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            ) : (
              <Typography
                component="code"
                sx={{
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                }}
              >
                {children}
              </Typography>
            );
          },
          blockquote: ({ children }: MarkdownComponentProps) => {
            // Check if this is a callout (from our preprocessing)
            const childrenArray = React.Children.toArray(children);
            let type = 'info';
            let content = children;
            
            if (childrenArray.length > 0 && React.isValidElement(childrenArray[0])) {
              const firstChild = childrenArray[0];
              if (firstChild.props?.children?.[0]?.startsWith && firstChild.props.children[0].startsWith('**')) {
                const match = /\*\*([A-Z]+)\*\*: (.*)/.exec(firstChild.props.children[0]);
                if (match) {
                  type = match[1].toLowerCase();
                  // This approach avoids manipulating React elements directly which can cause issues
                  return <Callout type={type as any}>{match[2]}</Callout>;
                }
              }
            }
            
            return <Callout type={type as any}>{content}</Callout>;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </Box>
  );
};

export default MDXRenderer; 