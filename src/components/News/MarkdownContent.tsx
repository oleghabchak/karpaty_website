import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-5 text-base leading-8 text-body-color dark:text-body-color-dark">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-dark text-3xl font-bold dark:text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-dark text-2xl font-bold dark:text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-dark text-xl font-semibold dark:text-white">{children}</h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-primary bg-primary/5 rounded-xs border-l-4 px-4 py-3 italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-light dark:bg-dark rounded px-1.5 py-0.5 text-sm">
              {children}
            </code>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
