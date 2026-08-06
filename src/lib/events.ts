import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import type { PortableTextBlock } from 'next-sanity';

export interface EventContactPerson {
  name?: string;
  role?: string;
  phoneOrEmail?: string;
}

export interface EventGalleryImage {
  url: string;
  alt?: string;
}

export interface EventItem {
  slug: string;
  title: string;
  eventDate: string;
  isUpcoming: boolean;
  venue: string;
  mapLink?: string;
  registrationLink: string;
  ctaText: string;
  description: PortableTextBlock[];
  contactPerson?: EventContactPerson;
  bannerImage: string;
  bannerImageAlt?: string;
  bannerImageRaw?: any;
  formEmbedUrl?: string;
  gallery?: EventGalleryImage[];
  [key: string]: any;
}

/** Upcoming/Past status is derived purely from eventDate vs now — not the editorial `isUpcoming` toggle. */
export function isEventUpcoming(eventDate: string): boolean {
  return new Date(eventDate).getTime() >= Date.now();
}

const eventFields = `
  title,
  "slug": slug.current,
  eventDate,
  isUpcoming,
  venue,
  mapLink,
  registrationLink,
  ctaText,
  "bannerImage": bannerImage.asset->url,
  "bannerImageAlt": bannerImage.alt,
  "bannerImageRaw": bannerImage
`;

export async function getAllEvents(): Promise<EventItem[]> {
  return client.fetch(
    `*[_type == "event"] | order(eventDate desc) { ${eventFields} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      ${eventFields},
      description,
      contactPerson,
      formEmbedUrl,
      "gallery": gallery[]{ "url": asset->url, alt }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getActiveAnnouncementEvent(): Promise<EventItem | null> {
  return client.fetch(
    `*[_type == "event" && isUpcoming == true && eventDate >= now()] | order(eventDate asc) [0] { ${eventFields} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export { urlFor };
