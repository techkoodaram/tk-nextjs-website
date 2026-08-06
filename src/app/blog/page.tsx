import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
    title: 'Blog | techKoodaram',
    description: 'Updates, tutorials, and stories from the techKoodaram community.',
    alternates: {
        canonical: '/blog',
    },
};

export default async function BlogIndex() {
    const posts = await getAllPosts();

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className='py-12 mt-4'>
                <h1 className="text-4xl font-bold mb-8">techKoodaram Blog</h1>
                <div className="grid gap-8">
                    {posts.map((post) => (
                        <article key={post.slug} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Link href={`/blog/${post.slug}`} className="block group">
                                <h2 className="text-2xl font-bold mb-2 group-hover:text-primary">{post.title}</h2>
                                <div className="text-gray-500 text-sm mb-4">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })} by {post.author}
                                </div>
                                <p className="text-gray-700">{post.description}</p>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
