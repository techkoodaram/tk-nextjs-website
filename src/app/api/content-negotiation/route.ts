import { NextRequest, NextResponse } from 'next/server';
import { toPlainText } from '@portabletext/react';
import { getPostBySlug } from '@/lib/blog';
import { formatMarkdownPost, htmlToMarkdown } from '@/lib/markdown';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let path = searchParams.get('path') || '/';
  if (!path.startsWith('/')) path = '/' + path;
  
  // Normalize path (ensure no trailing slash unless it's just '/')
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  
  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
    'Vary': 'Accept',
    'X-Robots-Tag': 'noarchive',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${request.headers.get('host')}`;
  const canonicalUrl = `${baseUrl}${path}`;
  headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);

  try {
    // Handle Blog Posts
    if (normalizedPath.startsWith('/blog/')) {
      const slug = normalizedPath.replace('/blog/', '');
      if (slug) {
        try {
          const post = await getPostBySlug(slug);
          if (post) {
            const markdown = formatMarkdownPost(post.title, toPlainText(post.body));
            return new Response(markdown, { headers });
          }
        } catch (e) {
          // If post not found, fallback to fetching page content
        }
      }
    }

    // Handle General Pages (fetch internal HTML and convert)
    // Using internal fetch to get the rendered page
    const response = await fetch(`${baseUrl}${normalizedPath}`, {
      headers: {
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return new Response('Content not found', { status: 404 });
    }

    const html = await response.text();
    const markdown = htmlToMarkdown(html);
    
    // Attempt to extract title from HTML if possible
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].split('|')[0].trim() : 'techKoodaram';
    
    const finalMarkdown = normalizedPath === '/' ? markdown : formatMarkdownPost(title, markdown);

    return new Response(finalMarkdown, { headers });
  } catch (error) {
    console.error('Error in content-negotiation API:', error);
    return new Response('Error retrieving content', { status: 500 });
  }
}
