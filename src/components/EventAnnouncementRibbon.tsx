import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/events";

interface EventAnnouncementRibbonProps {
  event: EventItem;
}

const EventAnnouncementRibbon = ({ event }: EventAnnouncementRibbonProps) => {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm">
        <span className="font-semibold text-center md:text-left">
          {event.title}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-accent" />
            {new Date(event.eventDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-accent" />
            {event.venue}
          </span>
        </div>
        <Link
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-attention-pulse px-4 py-1.5 rounded-full font-bold transition-all whitespace-nowrap shadow-sm hover:scale-105 active:scale-95"
        >
          {event.ctaText || "Register Now"}
        </Link>
      </div>
    </div>
  );
};

export default EventAnnouncementRibbon;
