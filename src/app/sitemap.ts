import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllEvents } from '@/lib/events';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://www.techkoodaram.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/events`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ];

  let posts: any[] = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  let events: any[] = [];
  try {
    events = await getAllEvents();
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: new Date(event.eventDate),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...eventRoutes];
}
