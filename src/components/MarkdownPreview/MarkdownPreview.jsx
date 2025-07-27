import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

// Custom components for markdown rendering
const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
        className="rounded-md"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a({ node, ...props }) {
    return (
      <a 
        {...props} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      />
    );
  },
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3 border-b border-gray-200 dark:border-gray-700 pb-1" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-lg font-bold my-2" {...props} />,
  p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2 space-y-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />,
  li: ({ node, ...props }) => <li className="my-1" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote 
      className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
      {...props} 
    />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
  ),
  tbody: ({ node, ...props }) => (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td 
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => (
    <hr className="my-4 border-t border-gray-200 dark:border-gray-700" {...props} />
  ),
};

export default function MarkdownPreview() {
  const { activeNote } = useNotes();
  const { isDarkMode } = useTheme();

  // Memoize the markdown content to prevent unnecessary re-renders
  const markdownContent = useMemo(() => {
    if (!activeNote) return null;
    
    return (
      <div className="prose dark:prose-invert max-w-none p-6">
        <ReactMarkdown components={components}>
          {activeNote.content}
        </ReactMarkdown>
      </div>
    );
  }, [activeNote]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <p>Select a note to preview</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">PREVIEW</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {markdownContent}
      </div>
    </div>
  );
}
