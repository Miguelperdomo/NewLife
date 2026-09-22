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
import { getCampuses, getHelpOptions, getMinistries } from "@/lib/content";
import { getEvents } from "@/lib/eventsContent";
import { getNews } from "@/lib/newsContent";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export default async function Home() {
  // AgendaSection es interactiva ("use client") y no puede pedirle datos a
  // Supabase ella misma en medio del render — se los resuelve el Home (de
  // servidor) y se los pasa. El resto de secciones se piden sus propios
  // datos por su cuenta (son componentes de servidor async).
  const [ministries, campuses, settings, events, news, helpOptions] = await Promise.all([
    getMinistries(),
    getCampuses(),
    getPublicSiteSettings(),
    getEvents(),
    getNews(),
    getHelpOptions(),
  ]);

  // Interruptores de Configuración > Página principal. Si todavía no se ha
  // guardado nada (settings === null), todo se muestra por defecto.
  const show = {
    ministries: settings?.showMinistries ?? true,
    live: settings?.showLive ?? true,
    events: settings?.showEvents ?? true,
    news: settings?.showNews ?? true,
    agenda: settings?.showAgenda ?? true,
    campuses: settings?.showCampuses ?? true,
    help: settings?.showHelp ?? true,
  };

  return (
    <>
      <Hero />
      <FirstTimeSection />
      <AboutSection />
      <DailyVerseCard />
      {show.ministries && <MinistriesSection />}
      {show.live && <LiveSection />}
      {show.events && <UpcomingEventsSection />}
      {show.news && <LatestNewsSection />}
      {show.agenda && <AgendaSection ministries={ministries} campuses={campuses} events={events} news={news} />}
      {show.campuses && <CampusesPreviewSection />}
      {show.help && (
        <HelpWidget
          whatsappNumber={settings?.whatsappNumber}
          title={settings?.helpTitle}
          description={settings?.helpDescription}
          ctaLabel={settings?.helpCtaLabel}
          optionsTitle={settings?.helpOptionsTitle}
          options={helpOptions}
          donationInfo={
            settings?.donationsEnabled
              ? {
                  bankName: settings.bankName,
                  bankAccountType: settings.bankAccountType,
                  bankAccountNumber: settings.bankAccountNumber,
                  bankAccountHolder: settings.bankAccountHolder,
                  nequiNumber: settings.nequiNumber,
                  daviplataNumber: settings.daviplataNumber,
                }
              : undefined
          }
        />
      )}
    </>
  );
}
