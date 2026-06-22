import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import rehypeSanitize from 'rehype-sanitize';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: blog, isLoading, isError, error } = useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/blog/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="pt-32 text-center text-[#6B6B6B] animate-pulse">Loading...</div>;
  }

  if (isError || !blog) {
    return (
      <div className="pt-32 text-center text-red-500">
        <p className="text-xl font-medium">Lỗi khi tải bài viết.</p>
        <p className="text-sm text-[#6B6B6B] mt-2">{error instanceof Error ? error.message : 'Bài viết không tồn tại hoặc đã bị xóa.'}</p>
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
        <code {...props} className="bg-gray-200 text-[#4A4A4A] px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Tran Nguyen Quoc Sang</title>
        <meta name="description" content={blog.content.substring(0, 150).replace(/\n/g, ' ') + '...'} />
      </Helmet>
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <Link to="/" className="text-[#A3B18A] hover:text-[#8A9A73] mb-8 inline-block transition-colors">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] leading-tight mb-4">{blog.title}</h1>
        <p className="text-sm text-[#888888] mb-12 border-b border-[#E5E5E5] pb-6">
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        
        <div className="prose prose-stone prose-lg max-w-none text-[#4A4A4A]">
          <ReactMarkdown 
            components={renderers}
            rehypePlugins={[rehypeSanitize]}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}
