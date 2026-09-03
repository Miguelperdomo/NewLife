import { AboutSection } from "@/components/sections/AboutSection";
import { AgendaSection } from "@/components/sections/AgendaSection";
import { CampusesPreviewSection } from "@/components/sections/CampusesPreviewSection";
import { DailyVerseCard } from "@/components/sections/DailyVerseCard";
import { FirstTimeSection } from "@/components/sections/FirstTimeSection";
import { HelpWidget } from "@/components/sections/HelpWidget";
import { Hero } from "@/components/sections/Hero";
import { LatestNewsSection } from "@/components/sections/LatestNewsSection";
import { LiveSection } from "@/components/sections/LiveSection";
import { MinistriesSection } from "@/components/sections/MinistriesSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FirstTimeSection />
      <AboutSection />
      <DailyVerseCard />
      <MinistriesSection />
      <LiveSection />
      <UpcomingEventsSection />
      <LatestNewsSection />
      <AgendaSection />
      <CampusesPreviewSection />
      <HelpWidget />
    </>
  );
}
