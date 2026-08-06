"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";

type EventShareProps = {
  title: string;
  slug: string;
};

export default function EventShare({ title, slug }: EventShareProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/events/${slug}`);
  }, [slug]);

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied" });
    } catch {
      toast({ title: "Unable to copy link" });
    }
  };

  return (
    <Button type="button" variant="hero" size="lg" onClick={onShare} disabled={!url} className="gap-2">
      <Share2 className="h-4 w-4" />
      Share Event
    </Button>
  );
}
