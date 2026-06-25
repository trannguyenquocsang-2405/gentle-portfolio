"use client";

import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLanguage } from '@/context/LanguageContext';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

interface Blog {
  id: string;
  title: any;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export default function BlogClient({ initialBlog, id }: { initialBlog: Blog | null, id: string }) {
  const { t, tData } = useLanguage();

  if (!initialBlog) {
    return (
      <div className="pt-32 text-center text-red-500">
        <p className="text-xl font-medium">Lỗi khi tải bài viết.</p>
        <p className="text-sm text-[#6B6B6B] dark:text-[#B0B0B0] mt-2">Bài viết không tồn tại hoặc đã bị xóa.</p>
        <Link href="/" className="text-[#A3B18A] hover:text-[#8A9A73] mt-4 inline-block underline">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const renderers: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          style={materialDark as any}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className="bg-gray-200 dark:bg-gray-800 text-[#4A4A4A] dark:text-[#EAEAEA] px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
  };

  const titleStr = tData(initialBlog.title);
  const contentStr = tData(initialBlog.content);

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <Link href="/" className="text-[#A3B18A] hover:text-[#8A9A73] mb-8 inline-block transition-colors">
        &larr; {t('blogDetail.back')}
      </Link>
      <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA] leading-tight mb-4">{titleStr}</h1>
      <p className="text-sm text-[#888888] dark:text-[#888888] mb-12 border-b border-[#E5E5E5] dark:border-[#333333] pb-6">
        {new Date(initialBlog.createdAt).toLocaleDateString()}
      </p>

      <div className="prose prose-stone prose-lg max-w-none text-[#4A4A4A] dark:prose-invert dark:text-[#EAEAEA]">
        <ReactMarkdown
          components={renderers}
          rehypePlugins={[
            [rehypeSanitize, {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [
                  ...(defaultSchema.attributes?.code || []),
                  'className',
                ],
              },
            }]
          ]}
        >
          {contentStr}
        </ReactMarkdown>
      </div>
    </div>
  );
}
