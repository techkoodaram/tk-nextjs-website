import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Calendar, MapPin } from 'lucide-react';
import { getEventBySlug, getAllEvents, urlFor } from '@/lib/events';
import { Button } from '@/components/ui/button';
import EventShare from '@/components/EventShare';
import EventRegistrationForm from '@/components/EventRegistrationForm';

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <span className="relative my-8 block w-full overflow-hidden rounded-lg shadow-lg">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          width={1200}
          height={0}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </span>
    ),
  },
};

export const dynamicParams = true;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

function excerptFromDescription(description: unknown, maxLength = 160): string {
  if (!Array.isArray(description)) return '';
  const text = description
    .filter((block: any) => block._type === 'block')
    .map((block: any) => (block.children || []).map((child: any) => child.text).join(''))
    .join(' ')
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const event = await getEventBySlug(params.slug);
    if (!event) throw new Error('Event not found');

    const description = excerptFromDescription(event.description);
    const ogImage = event.bannerImageRaw
      ? urlFor(event.bannerImageRaw).width(1200).height(630).fit('crop').url()
      : undefined;

    return {
      title: `${event.title} | techKoodaram`,
      description,
      alternates: {
        canonical: `/events/${params.slug}`,
      },
      openGraph: {
        title: event.title,
        description,
        type: 'article',
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description,
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch (error) {
    return {
      title: 'Event Not Found',
    };
  }
}

export default async function EventPage({ params }: PageProps) {
  try {
    const event = await getEventBySlug(params.slug);
    if (!event) {
      notFound();
    }

    const eventDateLabel = new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const eventTimeLabel = new Date(event.eventDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return (
      <article className="w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: event.title,
              startDate: event.eventDate,
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              eventStatus: 'https://schema.org/EventScheduled',
              location: {
                '@type': 'Place',
                name: event.venue,
                url: event.mapLink,
              },
              image: event.bannerImage ? [event.bannerImage] : undefined,
              description: excerptFromDescription(event.description, 500),
              organizer: {
                '@type': 'Organization',
                name: 'techKoodaram',
                url: 'https://techkoodaram.in',
              },
            }),
          }}
        />

        {/* Hero */}
        <div className="relative w-full">
          {event.bannerImage ? (
            <div className="relative w-full aspect-[1200/630] overflow-hidden">
              <Image
                src={event.bannerImage}
                alt={event.bannerImageAlt || event.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ) : null}

          <div className={`container mx-auto px-4 ${event.bannerImage ? 'relative -mt-20 md:-mt-28' : 'pt-32'}`}>
            <div className={`max-w-3xl ${event.bannerImage ? 'text-white' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {eventDateLabel} · {eventTimeLabel}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {event.venue}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {event.mapLink && (
                  <Button asChild variant="outline" size="sm">
                    <a href={event.mapLink} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4" />
                      View on Map
                    </a>
                  </Button>
                )}
                <EventShare title={event.title} slug={event.slug} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-primary prose-a:text-primary prose-img:rounded-lg">
            <PortableText value={event.description} components={portableTextComponents} />
          </div>

          {event.contactPerson?.name && (
            <div className="mt-10 p-6 rounded-lg border border-border/50 bg-secondary/40">
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <p className="text-foreground font-medium">
                {event.contactPerson.name}
                {event.contactPerson.role ? ` · ${event.contactPerson.role}` : ''}
              </p>
              {event.contactPerson.phoneOrEmail && (
                <p className="text-muted-foreground">{event.contactPerson.phoneOrEmail}</p>
              )}
            </div>
          )}

          {event.gallery && event.gallery.length > 0 && (
            <div className="mt-12 border-t pt-10">
              <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {event.gallery.map((photo, index) => (
                  <a
                    key={`${photo.url}-${index}`}
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-square overflow-hidden rounded-lg group"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || `${event.title} photo ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Registration */}
          <div className="mt-12 border-t pt-10" id="register">
            <h2 className="text-2xl font-bold mb-6">Registration</h2>

            {event.useNativeForm ? (
              <div className="mt-6 max-w-2xl mx-auto">
                <EventRegistrationForm
                  eventId={event._id}
                  fields={[...(event.formTemplate?.fields || []), ...(event.customFields || [])]}
                  title={event.formTemplate?.title}
                  description={event.formTemplate?.description}
                  eventName={event.title}
                  eventDate={eventDateLabel}
                  eventVenue={event.venue}
                />
              </div>
            ) : event.externalFormUrl ? (
              <div className="mt-6">
                <Button asChild variant="hero" size="xl" className="w-full md:w-auto">
                  <a href={event.externalFormUrl} target="_blank" rel="noopener noreferrer">
                    {event.ctaText || 'Register Now'}
                  </a>
                </Button>
              </div>
            ) : event.registrationLink ? (
              <div className="mt-6">
                <Button asChild variant="hero" size="xl" className="w-full md:w-auto">
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                    {event.ctaText || 'Register Now'}
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error rendering event:', error);
    notFound();
  }
}
