import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { getAllEvents, isEventUpcoming, type EventItem } from '@/lib/events';

export const metadata = {
    title: 'Events | techKoodaram',
    description: 'Upcoming and past events from the techKoodaram community.',
    alternates: {
        canonical: '/events',
    },
};

function EventCard({ event, upcoming }: { event: EventItem; upcoming: boolean }) {
    return (
        <article className="border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card">
            <Link href={`/events/${event.slug}`} className="block group">
                <div className="relative w-full aspect-[1200/630] overflow-hidden bg-muted">
                    {event.bannerImage ? (
                        <Image
                            src={event.bannerImage}
                            alt={event.bannerImageAlt || event.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 384px"
                        />
                    ) : null}
                    <span
                        className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${upcoming ? 'bg-accent text-accent-foreground' : 'bg-background/90 text-muted-foreground'
                            }`}
                    >
                        {upcoming ? 'Upcoming' : 'Past'}
                    </span>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary">{event.title}</h3>
                    <div className="text-muted-foreground text-sm mb-4 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.venue}
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        Explore Event
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </Link>
        </article>
    );
}

export default async function EventsIndex() {
    const events = await getAllEvents();
    const upcomingEvents = events
        .filter((event) => isEventUpcoming(event.eventDate))
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    const pastEvents = events.filter((event) => !isEventUpcoming(event.eventDate));

    return (
        <div className="container mx-auto px-4 pt-32 pb-24 max-w-6xl">
            <h1 className="text-4xl font-bold mb-12">techKoodaram Events</h1>

            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.slug} event={event} upcoming />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No upcoming events right now. Check back soon.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                {pastEvents.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {pastEvents.map((event) => (
                            <EventCard key={event.slug} event={event} upcoming={false} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No past events yet.</p>
                )}
            </section>
        </div>
    );
}
