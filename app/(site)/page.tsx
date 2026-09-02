import { AboutSection } from "@/components/sections/AboutSection";
import { DailyVerseCard } from "@/components/sections/DailyVerseCard";
import { Hero } from "@/components/sections/Hero";
import { LatestNewsSection } from "@/components/sections/LatestNewsSection";
import { LiveSection } from "@/components/sections/LiveSection";
import { MinistriesSection } from "@/components/sections/MinistriesSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <DailyVerseCard />
      <MinistriesSection />
      <LiveSection />
      <UpcomingEventsSection />
      <LatestNewsSection />
    </>
  );
}
