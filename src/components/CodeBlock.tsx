import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  children: string;
  filename?: string;
}

/**
 * CodeBlock Component
 * 
 * Renders a Markdown-style syntax-highlighted code block with copy functionality, 
 * line numbers toggle, and optional filename display
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, filename }) => {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
  
  // Clean up the code
  const code = children.trim();
  
  // Detect language display name
  const getLanguageDisplayName = () => {
    switch (language.toLowerCase()) {
      case 'js':
      case 'javascript':
        return 'JavaScript';
      case 'ts':
      case 'typescript':
        return 'TypeScript';
      case 'jsx':
        return 'JSX';
      case 'tsx':
        return 'TSX';
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'scss':
      case 'sass':
        return 'SCSS';
      case 'py':
      case 'python':
        return 'Python';
      case 'go':
      case 'golang':
        return 'Go';
      case 'rb':
      case 'ruby':
        return 'Ruby';
      case 'rs':
      case 'rust':
        return 'Rust';
      case 'sh':
      case 'bash':
      case 'shell':
        return 'Shell';
      case 'json':
        return 'JSON';
      case 'md':
      case 'markdown':
        return 'Markdown';
      case 'yml':
      case 'yaml':
        return 'YAML';
      case 'sql':
        return 'SQL';
      case 'c':
        return 'C';
      case 'cpp':
      case 'c++':
        return 'C++';
      case 'java':
        return 'Java';
      case 'php':
        return 'PHP';
      case 'swift':
        return 'Swift';
      case 'kt':
      case 'kotlin':
        return 'Kotlin';
      default:
        return language.charAt(0).toUpperCase() + language.slice(1);
    }
  };
  
  // Watch for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    
    // Create a MutationObserver to watch for attribute changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const toggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
  };
  
  return (
    <div className="markdown-code-block position-relative my-4">
      {/* Filename display (if provided) */}
      {filename && (
        <div className={`code-filename px-3 py-1 small ${isDarkMode ? 'text-light bg-dark' : 'text-dark bg-light'}`}
             style={{ 
               borderTopLeftRadius: '6px', 
               borderTopRightRadius: '6px',
               borderBottom: 'none',
               border: `1px solid ${isDarkMode ? '#444' : '#e1e4e8'}`,
               borderBottomColor: 'transparent',
               fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace',
             }}>
          {filename}
        </div>
      )}
      
      {/* Code block with syntax highlighting */}
      <div className="code-block-wrapper position-relative">
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 6px 6px 6px' : '6px',
            fontSize: '0.9rem',
            border: `1px solid ${isDarkMode ? '#444' : '#e1e4e8'}`,
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: isDarkMode ? '#6e7681' : '#bbb',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: `1px solid ${isDarkMode ? '#2e2e2e' : '#f0f0f0'}`,
            paddingLeft: '0.5em',
            fontSize: '0.8em',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, monospace',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
        
        {/* Floating action buttons */}
        <div 
          className="code-actions position-absolute" 
          style={{ 
            top: '0.5rem', 
            right: '0.5rem', 
            zIndex: 10, 
            opacity: 0, 
            transition: 'opacity 0.2s ease',
            backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            borderRadius: '4px',
            padding: '2px 4px',
            backdropFilter: 'blur(2px)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
        >
          {/* Language badge */}
          {!filename && (
            <span 
              className={`badge me-1 ${isDarkMode ? 'bg-secondary text-light' : 'bg-light text-secondary'}`}
              style={{ 
                fontSize: '0.7rem',
                fontWeight: 'normal',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {getLanguageDisplayName()}
            </span>
          )}
          
          {/* Line numbers toggle */}
          <button
            className="btn btn-sm btn-link p-0 px-1 me-1"
            onClick={toggleLineNumbers}
            title={`${showLineNumbers ? 'Hide' : 'Show'} line numbers`}
            aria-label={`${showLineNumbers ? 'Hide' : 'Show'} line numbers`}
            style={{ 
              fontSize: '0.8rem', 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              minWidth: 'unset'
            }}
          >
            <i className={`bi ${showLineNumbers ? 'bi-list-ol' : 'bi-list'}`}></i>
          </button>
          
          {/* Copy button */}
          <button
            className="btn btn-sm btn-link p-0 px-1"
            onClick={handleCopy}
            title="Copy code"
            aria-label="Copy code to clipboard"
            style={{ 
              fontSize: '0.8rem', 
              color: copied 
                ? '#28a745' 
                : isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              minWidth: 'unset'
            }}
          >
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}; 