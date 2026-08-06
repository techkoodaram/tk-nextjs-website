// One-off seed: create 2 dummy `event` documents (one upcoming, one past) for local testing.
// Usage: node scripts/seed-dummy-events.mjs
import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

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

function textBlock(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
  };
}

async function imageRef(webPath, alt) {
  const assetId = await uploadImage(webPath);
  if (!assetId) return null;
  return { _type: 'image', alt, asset: { _type: 'reference', _ref: assetId } };
}

async function main() {
  const bannerAssetId = await uploadImage('og-image.png');
  const banner = bannerAssetId
    ? { _type: 'image', alt: 'Event banner', asset: { _type: 'reference', _ref: bannerAssetId } }
    : undefined;

  const now = new Date();
  const upcomingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days
  const pastDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // -60 days

  const upcomingEvent = {
    _id: 'event-dummy-upcoming-meetup',
    _type: 'event',
    title: 'techKoodaram Dev Meetup: AI in Production',
    slug: { _type: 'slug', current: 'dummy-upcoming-meetup' },
    eventDate: upcomingDate.toISOString(),
    isUpcoming: true,
    venue: 'Vaazhai Incubation Centre, SVCET, Puliyangudi',
    mapLink: 'https://maps.google.com/?q=SVCET+Puliyangudi',
    registrationLink: 'https://www.theticket9.com/event/techkoodaram-dev-meetup',
    ctaText: 'Register Now',
    description: [
      textBlock(
        'Join us for an evening of talks and hands-on demos on shipping AI features to production. Meet fellow developers, share what you are building, and learn from real-world case studies.'
      ),
      textBlock('Snacks and networking follow the talks. All skill levels welcome.'),
    ],
    contactPerson: {
      name: 'Priya Kumar',
      role: 'Community Coordinator',
      phoneOrEmail: 'priya@techkoodaram.in',
    },
    bannerImage: banner,
  };

  const pastEvent = {
    _id: 'event-dummy-past-hackathon',
    _type: 'event',
    title: 'techKoodaram Weekend Hackathon 2026',
    slug: { _type: 'slug', current: 'dummy-past-hackathon' },
    eventDate: pastDate.toISOString(),
    isUpcoming: false,
    venue: 'Vaazhai Incubation Centre, SVCET, Puliyangudi',
    mapLink: 'https://maps.google.com/?q=SVCET+Puliyangudi',
    registrationLink: 'https://www.theticket9.com/event/techkoodaram-hackathon-2026',
    ctaText: 'Registration Closed',
    description: [
      textBlock(
        'Over one weekend, 40+ builders formed teams and shipped working prototypes across web, mobile, and hardware tracks.'
      ),
      textBlock('Thank you to everyone who came out and built something. See the photos below!'),
    ],
    contactPerson: {
      name: 'Arun Selvam',
      role: 'Event Lead',
      phoneOrEmail: 'arun@techkoodaram.in',
    },
    bannerImage: banner,
    gallery: (
      await Promise.all([
        imageRef('og-image.png', 'Teams presenting their projects'),
        imageRef('logo.png', 'Community group photo'),
      ])
    ).filter(Boolean),
  };

  for (const doc of [upcomingEvent, pastEvent]) {
    console.log(`Creating ${doc._id}...`);
    await client.createOrReplace(doc);
    console.log(`  done`);
  }

  console.log('\nSeeded 2 dummy events (1 upcoming, 1 past).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
