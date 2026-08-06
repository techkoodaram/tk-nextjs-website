// One-off migration: content/blog/*.mdx -> Sanity `post` documents.
// Usage: node scripts/migrate-blog-to-sanity.mjs
import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString as mdastToString } from 'mdast-util-to-string';

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_WRITE_TOKEN');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-06',
  token,
  useCdn: false,
});

const postsDir = path.join(process.cwd(), 'content/blog');
const publicDir = path.join(process.cwd(), 'public');
const assetCache = new Map();

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

function key() {
  return Math.random().toString(36).slice(2, 10);
}

async function uploadImage(webPath) {
  if (assetCache.has(webPath)) return assetCache.get(webPath);
  const filePath = path.join(publicDir, webPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ! image not found on disk, skipping: ${webPath}`);
    return null;
  }
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  assetCache.set(webPath, asset._id);
  return asset._id;
}

function marksFromInline(node, activeMarks = []) {
  // Returns an array of spans (leaf-level text with marks applied)
  switch (node.type) {
    case 'text':
      return [{ _type: 'span', _key: key(), text: node.value, marks: activeMarks }];
    case 'strong':
      return node.children.flatMap((c) => marksFromInline(c, [...activeMarks, 'strong']));
    case 'emphasis':
      return node.children.flatMap((c) => marksFromInline(c, [...activeMarks, 'em']));
    case 'inlineCode':
      return [{ _type: 'span', _key: key(), text: node.value, marks: [...activeMarks, 'code'] }];
    case 'link': {
      const markKey = key();
      return {
        spans: node.children.flatMap((c) => marksFromInline(c, [...activeMarks, markKey])),
        markDef: { _type: 'link', _key: markKey, href: node.url },
      };
    }
    default:
      if (node.children) return node.children.flatMap((c) => marksFromInline(c, activeMarks));
      return [];
  }
}

function buildTextBlock(children, style) {
  const spans = [];
  const markDefs = [];
  for (const child of children) {
    const result = marksFromInline(child);
    if (Array.isArray(result)) {
      spans.push(...result);
    } else {
      spans.push(...result.spans);
      markDefs.push(result.markDef);
    }
  }
  return { _type: 'block', _key: key(), style, markDefs, children: spans };
}

async function mdastNodeToBlocks(node) {
  switch (node.type) {
    case 'heading': {
      const style = node.depth <= 2 ? 'h2' : node.depth === 3 ? 'h3' : 'normal';
      return [buildTextBlock(node.children, style)];
    }
    case 'paragraph': {
      // A paragraph consisting solely of one image becomes an image block.
      if (node.children.length === 1 && node.children[0].type === 'image') {
        const img = node.children[0];
        const assetId = await uploadImage(img.url);
        if (!assetId) return [];
        return [{ _type: 'image', _key: key(), alt: img.alt || '', asset: { _type: 'reference', _ref: assetId } }];
      }
      return [buildTextBlock(node.children, 'normal')];
    }
    case 'blockquote': {
      const blocks = [];
      for (const child of node.children) {
        blocks.push(...(await mdastNodeToBlocks(child)));
      }
      return blocks.map((b) => (b._type === 'block' ? { ...b, style: 'blockquote' } : b));
    }
    case 'list': {
      const blocks = [];
      for (const item of node.children) {
        const para = item.children.find((c) => c.type === 'paragraph') || { children: [] };
        const block = buildTextBlock(para.children, 'normal');
        block.listItem = node.ordered ? 'number' : 'bullet';
        block.level = 1;
        blocks.push(block);
      }
      return blocks;
    }
    case 'code':
      return [{ _type: 'codeBlock', _key: key(), language: node.lang || '', code: node.value }];
    case 'thematicBreak':
      return [];
    default: {
      const text = mdastToString(node);
      return text ? [buildTextBlock([{ type: 'text', value: text }], 'normal')] : [];
    }
  }
}

async function convertMarkdownToBlocks(markdown) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const blocks = [];
  for (const node of tree.children) {
    blocks.push(...(await mdastNodeToBlocks(node)));
  }
  return blocks;
}

async function migrateFile(filename) {
  const slug = filename.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDir, filename);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

  console.log(`Migrating ${slug}...`);

  const coverAssetId = await uploadImage(data.coverImage);
  const body = await convertMarkdownToBlocks(content);

  const doc = {
    _id: `post-${slug}`,
    _type: 'post',
    title: data.title,
    slug: { _type: 'slug', current: slug },
    date: data.date,
    description: data.description,
    author: data.author,
    authorUrl: data.authorUrl,
    coverImage: coverAssetId
      ? { _type: 'image', asset: { _type: 'reference', _ref: coverAssetId } }
      : undefined,
    body,
  };

  await client.createOrReplace(doc);
  console.log(`  done (${body.length} blocks)`);
}

async function main() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));
  for (const file of files) {
    await migrateFile(file);
  }
  console.log(`\nMigrated ${files.length} posts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
