import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = 'http://localhost:3000';

export function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}/blog/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!blog) return <div className="pt-32 text-center text-[#6B6B6B]">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <Link to="/" className="text-[#A3B18A] hover:text-[#8A9A73] mb-8 inline-block transition-colors">
        &larr; Back to Home
      </Link>
      <h1 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] leading-tight mb-4">{blog.title}</h1>
      <p className="text-sm text-[#888888] mb-12 border-b border-[#E5E5E5] pb-6">
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      
      <div className="prose prose-stone prose-lg max-w-none text-[#4A4A4A]">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  );
}
