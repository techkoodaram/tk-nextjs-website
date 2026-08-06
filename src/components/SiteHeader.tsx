import Header from "@/components/Header";
import { getActiveAnnouncementEvent } from "@/lib/events";

const SiteHeader = async () => {
  const activeEvent = await getActiveAnnouncementEvent();
  return <Header activeEvent={activeEvent} />;
};

export default SiteHeader;
