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
import { PersonalStepsSection } from "@/components/sections/PersonalStepsSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { getCampuses, getHelpOptions, getMinistries } from "@/lib/content";
import { getEvents } from "@/lib/eventsContent";
import { getNews } from "@/lib/newsContent";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { getLiveStatus } from "@/lib/youtubeLive";

export default async function Home() {
  // AgendaSection es interactiva ("use client") y no puede pedirle datos a
  // Supabase ella misma en medio del render — se los resuelve el Home (de
  // servidor) y se los pasa. El resto de secciones se piden sus propios
  // datos por su cuenta (son componentes de servidor async).
  const [ministries, campuses, settings, events, news, helpOptions, liveStatus] = await Promise.all([
    getMinistries(),
    getCampuses(),
    getPublicSiteSettings(),
    getEvents(),
    getNews(),
    getHelpOptions(),
    getLiveStatus(),
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

  // Si está transmitiendo en vivo ahora mismo, "En vivo" se adelanta a ser lo
  // primero que se ve al entrar (antes incluso del Hero) — nadie tiene que
  // bajar para encontrarlo. Fuera de ese momento, queda en su lugar de
  // siempre, más abajo.
  const showLiveFirst = show.live && liveStatus.isLive;

  return (
    <>
      {showLiveFirst && <LiveSection />}
      <Hero />
      <WaveDivider className="bg-slate-50" fillClassName="text-slate-950" />
      <FirstTimeSection />
      <AboutSection />
      <DailyVerseCard />
      <PersonalStepsSection />
      {show.ministries && <MinistriesSection />}
      {show.live && !showLiveFirst && (
        <>
          <LiveSection />
          <WaveDivider className="bg-white" fillClassName="text-slate-950" />
        </>
      )}
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
          donationTitle={settings?.donationTitle}
          donationTeaser={settings?.donationTeaser}
          donationDescription={settings?.donationDescription}
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
