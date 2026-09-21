import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Beer,
  Check,
  Coffee,
  CupSoda,
  Expand,
  Eye,
  Gift,
  Globe2,
  Handshake,
  Heart,
  Hourglass,
  MapPin,
  MonitorUp,
  QrCode,
  Star,
  Users,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import premiumCounter from "@/assets/premium-counter.jpg.asset.json";
import sharedTable from "@/assets/shared-table.jpg.asset.json";
import wallFame from "@/assets/wall-fame.jpg.asset.json";
import pretzelImage from "@/assets/pretzel.jpg.asset.json";
import coffeeImage from "@/assets/coffee.jpg.asset.json";
import eveningImage from "@/assets/evening.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LNF Shared Booth — transport logistic 2027 Munich" },
      {
        name: "description",
        content:
          "Join seven logistics networks at the LNF Shared Booth at transport logistic 2027 in Munich.",
      },
      { property: "og:title", content: "LNF Shared Booth — transport logistic 2027" },
      {
        property: "og:description",
        content: "Seven networks. One booth. Countless connections in Munich, 26–29 April 2027.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/Logo%20(3).png" },
      { property: "og:image:alt", content: "LNF Logistics Network Federation logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/Logo%20(3).png" },
      { name: "twitter:image:alt", content: "LNF Logistics Network Federation logo" },
    ],
  }),
  component: Index,
});

type PackageKey = "premium" | "twoThirds" | "oneThird" | "wall";
const eventDateText = "26–29 April 2027 · Messe München";
const transportTitleText = "transport logistic 2027";

const packageOptions: Record<PackageKey, { label: string; price: number }> = {
  premium: { label: "Category 1 · Premium Counter", price: 4250 },
  twoThirds: { label: "Category 2 · Shared High Table 2/3", price: 3500 },
  oneThird: { label: "Category 3 · Shared High Table 1/3", price: 3000 },
  wall: { label: "Wall of Fame", price: 950 },
};

const networkLogos = [
  {
    src: "/logos/2-dc7caaa3-ffbd-40fe-ace8-c21f5b5f315c.png",
    alt: "U Line",
  },
  {
    src: "/logos/3-997bf5e9-c766-4b4e-9950-9f488b0ccc07.png",
    alt: "Cargo Power Network",
  },
  {
    src: "/logos/4-8a8d8c1c-f93a-400e-bd80-d25cbeae01ca.png",
    alt: "UCONNECT",
  },
  {
    src: "/logos/7-7e000de3-3e3a-4cbd-89ff-58f47f453b78.png",
    alt: "World Shipping Alliance Elite",
  },
  {
    src: "/logos/logo-aic-46c3832e-b9c7-403e-95f0-1d31dd81b472.png",
    alt: "AirCargoGroup",
  },
  {
    src: "/logos/logo-bling-2026-dd67515c-40ac-4e06-bac2-f3bf2c8b42ca.png",
    alt: "Bling Network",
  },
  {
    src: "/logos/whatsapp-image-2026-06-11-at-121609-pm-5559bbf1-3e84-48be-bd66-9242d0996534.jpeg",
    alt: "African Freight Bridge Network",
  },
  {
    src: "/logos/worldring-logo-new-smarter-by-connecting-black-black-980ad6c6-6633-4bab-87ba-1c645b1b4752.png",
    alt: "WorldRing",
  },
];

const featureItems = [
  { icon: Expand, text: "120 m²\nHead Booth" },
  { icon: Users, text: "7 Partner\nNetworks" },
  { icon: Utensils, text: "All-day\nCatering" },
  { icon: Star, text: "Wall of Fame" },
  { icon: Beer, text: "Bavarian\nNetworking Evening" },
];

const packages = [
  {
    key: "premium" as const,
    category: "Category 1",
    title: "Premium Counter",
    price: "4,250 EUR",
    image: "/sposlnf/55.png",
    top: true,
    bullets: [
      "Branded counter",
      "Counter dimensions: 100 × 50 × 98 cm",
      "Lockable cabinet",
      "2 bar stools",
      "1 full-event booth representative included incl. exhibitor pass, all-day catering and full access to all LNF booth services",
      "Visible presentation space at the booth",
      "Daily 30-minute use of the enclosed meeting room",
      "All-day catering included",
    ],
  },
  {
    key: "twoThirds" as const,
    category: "Category 2",
    title: "Shared High Table 2/3",
    price: "3,500 EUR",
    image: "/sposlnf/Bavarian.jpg",
    bullets: [
      "2/3 branded shared high table",
      "4 fixed seats",
      "Shared table with divider",
      "1 full-event booth representative included incl. exhibitor pass, all-day catering and full access to all LNF booth services",
      "Strong visibility in the networking area",
      "All-day catering included",
    ],
  },
  {
    key: "oneThird" as const,
    category: "Category 3",
    title: "Shared High Table 1/3",
    price: "3,000 EUR",
   image: "/sposlnf/Bavarian.jpg",
    bullets: [
      "1/3 branded shared high table",
      "2 fixed seats",
      "Shared table with divider",
      "1 full-event booth representative included incl. exhibitor pass, all-day catering and full access to all LNF booth services",
      "Presence in the networking area",
      "All-day catering included",
    ],
  },
  {
    key: "wall" as const,
    category: "",
    title: "Wall of Fame",
    price: "950 EUR",
    image: "/sposlnf/WhatsApp Image 2026-09-21 at 1.58.17 PM.jpeg",
    bullets: [
      "Logo, contact photo and QR code",
      "Presence even without attending in person",
      "Visibility for all booth visitors",
      "Ideal remote participation option",
    ],
  },
];

const sponsors = [
  {
    title: "Beer Sponsor",
    price: "2,000 EUR",
    image: "sposlnf/Beer.jpg",
    icon: Beer,
    bulletIcons: [CupSoda, Users, Heart],
    bullets: [
      "Logo on the beer cups",
      "Strong visibility in the\nnetworking environment",
      "Sympathetic presence with\nhigh recall value",
    ],
  },
  {
    title: "Pretzel Sponsor",
    price: "1,500 EUR",
    image: "/sposlnf/Pretzel.jpg",
    icon: Utensils,
    bulletIcons: [Users, Utensils, MapPin],
    bullets: [
      "Logo on the pretzel stand",
      "Culinary attention magnet",
      "Presence at a central meeting point",
    ],
  },
  {
    title: "Coffee Sponsor",
    price: "1,500 EUR",
    image: "/sposlnf/Coffee.jpg",
    icon: Coffee,
    bulletIcons: [Coffee, Users, Eye],
    bullets: [
      "Logo at the coffee station",
      "High-frequency touchpoint\nthroughout the day",
      "Useful sponsor presence with\nstrong visibility",
    ],
  },
  {
    title: "Bavarian Evening Sponsor",
    price: "2,000 EUR",
    image: "/654.jpg",
    icon: Star,
    bulletIcons: [Gift, Users, Star],
    bullets: [
      "Prominent visibility during the evening event",
      "Association with the key social highlight",
      "Memorable sponsor presence",
    ],
  },
];

function Brand({ showTagline = false }: { showTagline?: boolean }) {
  return (
    <a
      href="#overview"
      className={`flex shrink-0 items-center gap-5 ${showTagline ? "min-w-0 flex-1" : ""}`}
      aria-label="LNF home"
    >
      <img
        src="/Logo%20(3).png"
        alt="Logistics Network Federation"
        className="h-20 w-auto max-w-[min(78vw,560px)] object-contain object-left md:h-32"
      />
      {showTagline ? (
        <span className="ml-auto hidden text-right text-[0.65rem] font-black uppercase leading-[1.35] tracking-[0.16em] text-sky sm:block">
          Stronger networks
          <br />
          Brighter tomorrows
          <span className="mr-auto mt-2 block h-0.5 w-7 bg-highlight" />
        </span>
      ) : null}
    </a>
  );
}

function SectionHeading({
  children,
  intro,
  className = "",
}: {
  children: React.ReactNode;
  intro?: string;
  className?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className={`section-title ${className}`}>{children}</h2>
      <span className="title-rule" />
      {intro ? <p className="mt-2 max-w-3xl text-lg text-ink/80 md:text-xl">{intro}</p> : null}
    </div>
  );
}

function ImageWaveOverlay() {
  return (
    <div className="image-wave-overlay" aria-hidden="true">
      <svg
        className="image-wave-overlay__svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="image-wave-overlay__deep"
          d="M0 72 C 180 94 340 96 520 72 C 704 48 858 42 1040 70 C 1210 96 1320 98 1440 74 L1440 120 L0 120 Z"
          fill="var(--deep)"
          fillOpacity="0.82"
        />
        <path
          className="image-wave-overlay__sky"
          d="M0 90 C 180 112 340 112 520 88 C 704 64 858 58 1040 86 C 1210 112 1320 114 1440 90 L1440 120 L0 120 Z"
          fill="var(--sky)"
          fillOpacity="0.86"
        />
        <path
          className="image-wave-overlay__glint"
          d="M0 73 C 180 95 340 97 520 73 C 704 49 858 43 1040 71 C 1210 97 1320 99 1440 75"
          fill="none"
          stroke="var(--highlight)"
          strokeOpacity="0.75"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function ScrollTypewriter({ text, loop = false }: { text: string; loop?: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;

    let characterIndex = 0;
    let typingTimer: number;
    let pauseTimer: number;

    const typeNextCharacter = () => {
      characterIndex += 1;
      setTypedText(text.slice(0, characterIndex));

      if (characterIndex < text.length) {
        typingTimer = window.setTimeout(typeNextCharacter, 65);
      } else if (loop) {
        pauseTimer = window.setTimeout(() => {
          characterIndex = 0;
          setTypedText("");
          typeNextCharacter();
        }, 1600);
      }
    };

    typeNextCharacter();

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(pauseTimer);
    };
  }, [hasEnteredView, loop, text]);

  return (
    <span ref={textRef} aria-label={text}>
      {typedText}
      {hasEnteredView && typedText.length < text.length ? (
        <span className="ml-1 animate-pulse" aria-hidden="true">
          |
        </span>
      ) : null}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink/85">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sky text-surface">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OrangeBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-snug text-ink/85 md:text-base">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-highlight text-highlight-foreground">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Index() {
  const [selectedPackage, setSelectedPackage] = useState<PackageKey>("premium");
  const [representatives, setRepresentatives] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [typedEventDate, setTypedEventDate] = useState("");
  const [typedTransportTitle, setTypedTransportTitle] = useState("");

  useEffect(() => {
    let characterIndex = 0;
    let typingTimer: number;

    const typeNextCharacter = () => {
      if (characterIndex < eventDateText.length) {
        characterIndex += 1;
        setTypedEventDate(eventDateText.slice(0, characterIndex));
        typingTimer = window.setTimeout(typeNextCharacter, 65);
        return;
      }

      typingTimer = window.setTimeout(() => {
        characterIndex = 0;
        setTypedEventDate("");
        typeNextCharacter();
      }, 1500);
    };

    typeNextCharacter();

    return () => window.clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    let characterIndex = 0;
    let typingTimer: number;

    const typeNextCharacter = () => {
      if (characterIndex < transportTitleText.length) {
        characterIndex += 1;
        setTypedTransportTitle(transportTitleText.slice(0, characterIndex));
        typingTimer = window.setTimeout(typeNextCharacter, 65);
        return;
      }

      typingTimer = window.setTimeout(() => {
        characterIndex = 0;
        setTypedTransportTitle("");
        typeNextCharacter();
      }, 1500);
    };

    typeNextCharacter();

    return () => window.clearTimeout(typingTimer);
  }, []);

  const total = useMemo(
    () => packageOptions[selectedPackage].price + representatives * 500,
    [selectedPackage, representatives],
  );

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("reservation_inquiries").insert({
      name: String(form.get("name") ?? "").trim(),
      company: String(form.get("company") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim() || null,
      selected_package: selectedPackage,
      additional_representatives: representatives,
      message: String(form.get("message") ?? "").trim() || null,
      quoted_net_total: total,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("Your inquiry could not be sent. Please try again.");
      return;
    }
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-[22] bg-surface/95 backdrop-blur">
        <div className="page-shell flex h-32 items-center gap-4">
          <Brand showTagline />
          <Button
            asChild
            className="hidden h-11 shrink-0 bg-highlight px-5 text-sm font-black text-highlight-foreground hover:bg-highlight/90 sm:inline-flex"
          >
            <a href="#contact">
              Reserve Your Spot <ArrowRight />
            </a>
          </Button>
        </div>
      </header>

      <section id="overview" className="relative bg-surface scroll-mt-20">
        <div className="hero-image-frame pointer-events-none relative z-[70] mx-auto -mt-12 max-w-[1440px] md:-mt-20">
          <img
            src="/7.jpg"
            alt="LNF shared booth at a busy international logistics exhibition"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-image block h-auto w-full object-contain"
          />
          <ImageWaveOverlay />
        </div>
        <div className="relative">
          <div className="page-shell pb-12 pt-9 md:pb-16 md:pt-12">
            <div className="max-w-5xl">
              <h1 className="wave-linked-title text-[clamp(1.75rem,4vw,3.25rem)] font-black leading-[0.98] text-ink md:whitespace-nowrap">
                Visible together at{" "}
                <span className="text-sky" aria-label={transportTitleText}>
                  {typedTransportTitle}
                  {typedTransportTitle.length < transportTitleText.length ? (
                    <span className="ml-1 animate-pulse" aria-hidden="true">
                      |
                    </span>
                  ) : null}
                </span>
              </h1>
              <span className="title-rule mt-5" />
              <p className="mt-4 text-xl font-extrabold text-ink md:text-2xl">
                The LNF Shared Booth — 7 Networks. One Booth. Countless Connections.
              </p>
              <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink/80 md:text-lg">
                Present your company as part of a professional 120 m² head booth in Munich. Benefit
                from the combined strength of seven partner networks, maximum visibility and
                valuable contacts. Enjoy all-day catering, optional Wall of Fame visibility for your
                members and a traditional Bavarian networking evening.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 border-y border-line py-6 sm:grid-cols-3 lg:grid-cols-5">
              {featureItems.map(({ icon: Icon, text }, index) => (
                <div
                  key={text}
                  className={`group flex flex-col items-center px-3 py-5 text-center ${index !== 0 ? "border-l border-line" : ""}`}
                >
                  <span className="grid size-20 place-items-center rounded-full border-2 border-highlight text-ink transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
                    <Icon className="size-10" />
                  </span>
                  <span className="mt-4 whitespace-pre-line text-lg font-extrabold leading-tight text-ink">
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-ink/65">
              Participating networks
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {networkLogos.map(({ src, alt }) => (
                <div
                  key={src}
                  className="group flex min-h-24 items-center justify-center border-r border-line px-3 py-3"
                >
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="max-h-16 w-full object-contain transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-3 text-xs font-bold text-ink/65">
              <span>
                Exhibition Offer&nbsp; | &nbsp;transport logistic 2027&nbsp; | &nbsp;Munich
              </span>
              <span aria-label={eventDateText}>
                {typedEventDate}
                {typedEventDate.length < eventDateText.length ? (
                  <span className="ml-0.5 animate-pulse" aria-hidden="true">
                    |
                  </span>
                ) : null}
              </span>
              <strong className="uppercase tracking-[0.2em] text-ink">
                Munich connects the world.
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section id="packages" className="page-band scroll-mt-20">
        <div className="page-shell">
          <SectionHeading intro="Choose the format that best fits your trade fair presence.">
            Participation Packages <span className="text-sky"><ScrollTypewriter text="at a Glance" /></span>
          </SectionHeading>
          <div className="grid gap-5 lg:grid-cols-2">
            {packages.map((pkg) => (
              <article
                key={pkg.key}
                className={`package-card group transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${selectedPackage === pkg.key ? "ring-2 ring-sky" : ""}`}
              >
                <div className="relative overflow-hidden rounded-t-[6px]">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  {pkg.top ? (
                    <span className="absolute right-0 top-0 flex items-center gap-2 bg-sky px-4 py-3 text-[10px] font-black uppercase leading-tight tracking-[0.08em] text-surface shadow-md">
                      <Star className="size-6 shrink-0 fill-current" />
                      <span>
                        Our top
                        <br />
                        package
                      </span>
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <h3 className="min-w-0 text-lg font-black text-ink">
                      {pkg.category}
                      {pkg.category ? " | " : ""}
                      {pkg.title}
                    </h3>
                    <span className="shrink-0 text-xl font-black text-sky underline decoration-highlight decoration-2 underline-offset-8">
                      {pkg.price}
                    </span>
                  </div>
                  <div className="mt-5">
                    <BulletList items={pkg.bullets} />
                  </div>
                  <Button
                    asChild
                    className="mt-6 w-full bg-highlight font-black text-highlight-foreground hover:bg-highlight/90"
                  >
                    <a href="/application">
                      Join Us <ArrowRight />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-6 rounded-lg bg-panel p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-[1.35fr_2fr] md:items-center">
            <div className="flex items-center gap-5">
              <span className="group grid size-16 shrink-0 place-items-center rounded-full border-2 border-highlight text-ink">
                <Users className="size-8 transition-transform duration-500 group-hover:animate-spin motion-reduce:animate-none" />
              </span>
              <p className="text-base font-bold text-ink md:text-lg">
                Additional full-event booth representative:{" "}
                <strong className="text-xl text-sky md:text-2xl">500 EUR</strong>
                <br />
                <span className="text-sm font-normal leading-snug text-ink/70 md:text-base">
                  incl. exhibitor access, all-day catering and full booth services
                </span>
              </p>
            </div>
            <div className="flex items-center gap-5">
              <span className="group grid size-16 shrink-0 place-items-center rounded-full border-2 border-highlight text-ink">
                <Hourglass className="size-8 transition-transform duration-500 group-hover:animate-spin motion-reduce:animate-none" />
              </span>
              <div className="grid min-w-0 flex-1 grid-cols-4 divide-x divide-sky/40 text-center">
                {[
                  ["14x", "Category 1"],
                  ["5x", "Category 2"],
                  ["5x", "Category 3"],
                  ["15x", "Wall of Fame"],
                ].map(([count, label]) => (
                  <div key={label} className="px-2">
                    <strong className="block text-2xl font-black text-ink md:text-3xl">{count}</strong>
                    <span className="text-xs font-bold text-ink/70 md:text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink/60">
            <ScrollTypewriter text="All prices are net prices in EUR. Applicable taxes, if any, will be added." />
          </p>
        </div>
      </section>

      <section id="concept" className="scroll-mt-20 bg-surface">
        <div className="relative w-full">
          <img
            src="/7.jpg"
            alt="Open LNF networking booth concept"
            className="h-[42vh] min-h-[340px] w-full object-cover"
          />
          <ImageWaveOverlay />
          <div className="absolute bottom-6 right-6 border-l-4 border-highlight bg-ink/85 px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-surface">
            People connect markets
          </div>
        </div>
        <div className="page-shell py-14">
          <SectionHeading
            className="wave-linked-title"
            intro="The LNF shared booth brings together people, partner networks and business opportunities."
          >
            More than booth space:
            <br />
            <span className="text-sky">a true networking happening</span>
          </SectionHeading>
          <div className="grid gap-10 lg:grid-cols-[1.8fr_0.9fr] lg:items-start">
            <aside className="order-2 rounded-lg bg-panel p-5 lg:order-2">
              <h3 className="text-xl font-black text-ink underline decoration-highlight decoration-2 underline-offset-8">
                Booth Concept
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">
                An open, inviting and high-quality setup with individual counters, branded shared
                high tables, a meeting room, a bar and a central networking area.
              </p>
              <div className="mt-5 overflow-hidden border-2 border-sky/30 bg-surface p-3">
                <img
                  src="/Booth.jpg"
                  alt="LNF shared booth floor plan"
                  loading="lazy"
                  className="h-auto max-h-[480px] w-full object-contain"
                />
              </div>
            </aside>
            <div className="order-1 lg:order-1">
              <h3 className="mb-5 text-2xl font-black text-ink">Why take part?</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
                {[
                  { icon: Users, text: "7 partner networks on one booth" },
                  { icon: Expand, text: "120 m² professional shared booth" },
                  { icon: Globe2, text: "International visibility & new contacts" },
                  { icon: Utensils, text: "All-day catering for exhibitors" },
                  { icon: Handshake, text: "Open networking space with high visitor appeal" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="concept-item group px-2">
                    <span className="grid size-20 place-items-center rounded-full border-2 border-highlight text-ink transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
                      <Icon className="size-10" />
                    </span>
                    <strong className="text-base leading-tight md:text-lg">{text}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <div>
                  <h3 className="mb-5 text-2xl font-black text-ink">What else to expect</h3>
                  <OrangeBulletList
                    items={[
                      "Traditional Bavarian networking evening in Munich",
                      "Additional full-event booth representative: 500 EUR — incl. exhibitor access, all-day catering and full booth services.",
                      "Category 1 includes daily 30-minute meeting room usage",
                      "Presence without travel possible via the Wall of Fame",
                    ]}
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
                  <img
                    src="/sposlnf/Bavarian.jpg"
                    alt="LNF shared booth networking tables"
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsorship" className="page-band scroll-mt-20">
        <div className="page-shell">
          <SectionHeading intro="Increase your visibility with eye-catching presence formats.">
            <strong className="text-4xl font-black md:text-5xl">Sponsorship &amp; Additional Options</strong>
          </SectionHeading>
          <div className="grid gap-5 lg:grid-cols-2">
            {sponsors.map(({ title, price, image, icon: Icon, bulletIcons, bullets }) => (
              <article
                key={title}
                className="package-card group transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <img
                  src={image}
                  alt={title}
                  className="h-75 w-full rounded-t-[6px] object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="p-6">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <h3 className="min-w-0 text-2xl font-black text-ink md:text-3xl">{title}</h3>
                    <strong className="shrink-0 rounded bg-highlight px-3 py-1 text-xl text-highlight-foreground">
                      {price}
                    </strong>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {bullets.map((item, index) => {
                      const BulletIcon = bulletIcons?.[index] ?? Icon;

                      return (
                      <li key={item} className="flex items-center gap-5 whitespace-pre-line text-lg font-bold leading-tight text-ink md:text-xl">
                        <span className="group grid size-14 shrink-0 place-items-center rounded-full border-2 border-highlight text-ink transition-transform duration-700 ease-in-out hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:hover:rotate-0">
                          <BulletIcon className="size-7" />
                        </span>
                        {item}
                      </li>
                      );
                    })}
                  </ul>
                  <Button
                    asChild
                    className="mt-7 w-full bg-highlight font-black text-highlight-foreground hover:bg-highlight/90"
                  >
                    <a href="/application">
                      Join Us <ArrowRight />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <div id="wall-of-fame" className="scroll-mt-24 pt-10">
            <h3 className="section-title text-3xl">Further Options</h3>
            <span className="title-rule" />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: MonitorUp,
                  title: "Wall of Fame",
                  price: "950 EUR",
                  text: "Logo, photo and QR code on the presentation wall.",
                },
                {
                  icon: Users,
                  title: "Additional full-event booth representative",
                  price: "500 EUR",
                  text: "Incl. exhibitor access, all-day catering and full booth services.",
                },
                {
                  icon: Beer,
                  title: "Bavarian Networking Evening",
                  price: "Included",
                  text: "Important: Free of charge to attend.",
                },
              ].map(({ icon: Icon, title, price, text }) => (
                <article
                  key={title}
                  className="group flex min-h-28 items-center gap-5 rounded-lg border border-line bg-surface p-6"
                >
                  <span className="grid size-20 shrink-0 place-items-center rounded-full border-2 border-highlight">
                    <Icon className="size-10 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
                  </span>
                  <div>
                    <h4 className="text-base font-black text-ink md:text-lg">{title}</h4>
                    <strong
                      className={
                        price === "Included"
                          ? "rounded bg-success px-2 py-0.5 text-xs text-surface"
                          : "text-sky"
                      }
                    >
                      {price}
                    </strong>
                    <p className="mt-1 text-xs text-ink/70">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-surface text-surface">
        <div className="page-shell py-5 md:py-8">
          <div className="contact-banner rounded-lg p-4 shadow-lg md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <Handshake className="size-14 shrink-0 text-surface md:size-16" />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black text-surface md:text-2xl">Secure your participation now</h2>
                <span className="mt-2 block h-0.5 w-10 bg-highlight" />
                <p className="mt-2 max-w-2xl text-xs text-surface/80 md:text-sm">
                  Spaces are limited. Secure your preferred sponsorship package or ask for a tailored option today.
                </p>
              </div>
              <strong className="contact-banner__tagline max-w-32 text-lg text-surface md:text-right md:text-2xl">
                Together
                <br />
                we go further.
              </strong>
              <Button
                asChild
                className="relative z-10 shrink-0 bg-highlight font-black text-highlight-foreground hover:bg-highlight/90"
              >
                <a href="/application">
                  Fill in the application <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
          <p className="mt-2 px-1 text-[0.62rem] italic leading-tight text-ink/55">
            <ScrollTypewriter loop text="Visualisations are for illustration purposes only. Final booth design may vary" />
          </p>
        </div>
      </section>

      <footer className="site-footer border-t border-line/70 bg-white text-ink">
        <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:items-center">
          <Brand />
          <div className="text-sm leading-relaxed text-ink/65">
            <p>26–29 April 2027 | Messe München</p>
            <p className="mt-1">Exhibition Offer | transport logistic 2027 | Munich</p>
          </div>
          <div className="space-y-4 md:text-right">
            <strong className="block uppercase tracking-[0.2em]">
              Munich connects
              <br />
              the world.
            </strong>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink/75 md:justify-end">
              <span>
                <ScrollTypewriter text="Made by LNF with love" />
              </span>
              <Heart className="heart-beat size-4 shrink-0 fill-highlight text-highlight" aria-hidden="true" />
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
