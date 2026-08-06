import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import type { PortableTextBlock } from 'next-sanity';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  authorUrl?: string;
  coverImage: string;
  body: PortableTextBlock[];
  [key: string]: any;
}

const postFields = `
  title,
  "slug": slug.current,
  date,
  description,
  author,
  authorUrl,
  "coverImage": coverImage.asset->url
`;

export async function getAllPosts(): Promise<BlogPost[]> {
  return client.fetch(
    `*[_type == "post"] | order(date desc) { ${postFields} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { ${postFields}, body }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export { urlFor };
