import { useParams, Link } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { blogService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Blog {
  id: string;
  title: any;
  content: any;
  createdAt: string;
  updatedAt: string;
}

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, tData } = useLanguage();

  const { data: blog, isLoading, isError, error } = useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      return await blogService.getById(id as string);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-32 text-center flex flex-col items-center justify-center space-y-4 px-6">
        <div className="animate-pulse w-10 h-10 rounded-full bg-[#A3B18A] opacity-50"></div>
        <div className="text-[#6B6B6B] dark:text-[#B0B0B0] animate-pulse">Loading...</div>
        <p className="text-[#888888] dark:text-[#666666] text-sm animate-pulse">
          Backend may take 30-60s to wake up on first request...
        </p>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="pt-32 text-center text-red-500">
        <p className="text-xl font-medium">Lỗi khi tải bài viết.</p>
        <p className="text-sm text-[#6B6B6B] dark:text-[#B0B0B0] mt-2">{error instanceof Error ? error.message : 'Bài viết không tồn tại hoặc đã bị xóa.'}</p>
        <Link to="/" className="text-[#A3B18A] hover:text-[#8A9A73] mt-4 inline-block underline">
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

  const titleStr = tData(blog.title);
  const contentStr = tData(blog.content);

  return (
    <>
      <Helmet>
        <title>{titleStr} | Tran Nguyen Quoc Sang</title>
        <meta name="description" content={contentStr.substring(0, 150).replace(/\n/g, ' ') + '...'} />
      </Helmet>
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <Link to="/" className="text-[#A3B18A] hover:text-[#8A9A73] mb-8 inline-block transition-colors">
          &larr; {t('blogDetail.back')}
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] dark:text-[#EAEAEA] leading-tight mb-4">{titleStr}</h1>
        <p className="text-sm text-[#888888] dark:text-[#888888] mb-12 border-b border-[#E5E5E5] dark:border-[#333333] pb-6">
          {new Date(blog.createdAt).toLocaleDateString()}
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
    </>
  );
}
