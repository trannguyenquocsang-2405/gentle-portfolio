import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { blogService } from '@/services/api';

export const revalidate = 60; // ISR: Tự động cập nhật cache mỗi 60 giây

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const blog = await blogService.getById(id);
    
    // Default language for bots is Vietnamese
    const title = blog.title?.vi || blog.title?.en || 'Blog';
    const desc = (blog.content?.vi || blog.content?.en || '').substring(0, 150) + '...';
    
    return {
      title: `${title} | Tran Nguyen Quoc Sang`,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: 'article',
      }
    };
  } catch (e) {
    return { title: 'Blog Not Found' };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let blog = null;
  try {
    blog = await blogService.getById(id);
  } catch (e) {
    console.error('Failed to fetch blog on server', e);
  }

  return <BlogClient initialBlog={blog} id={id} />
}
