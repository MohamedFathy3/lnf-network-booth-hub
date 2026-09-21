import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Beer,
  Check,
  Coffee,
  Expand,
  Eye,
  Globe2,
  Handshake,
  Menu,
  MonitorUp,
  QrCode,
  Star,
  Users,
  Utensils,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import boothHero from "@/assets/booth-hero.jpg.asset.json";
import premiumCounter from "@/assets/premium-counter.jpg.asset.json";
import sharedTable from "@/assets/shared-table.jpg.asset.json";
import wallFame from "@/assets/wall-fame.jpg.asset.json";
import beerImage from "@/assets/beer.jpg.asset.json";
import pretzelImage from "@/assets/pretzel.jpg.asset.json";
import coffeeImage from "@/assets/coffee.jpg.asset.json";
import eveningImage from "@/assets/evening.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LNF Shared Booth — transport logistic 2027 Munich" },
      {
        name: "description",
        content: "Join seven logistics networks at the LNF Shared Booth at transport logistic 2027 in Munich.",
      },
      { property: "og:title", content: "LNF Shared Booth — transport logistic 2027" },
      {
        property: "og:description",
        content: "Seven networks. One booth. Countless connections in Munich, 26–29 April 2027.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type PackageKey = "premium" | "twoThirds" | "oneThird" | "wall";

const packageOptions: Record<PackageKey, { label: string; price: number }> = {
  premium: { label: "Category 1 · Premium Counter", price: 4250 },
  twoThirds: { label: "Category 2 · Shared High Table 2/3", price: 3500 },
  oneThird: { label: "Category 3 · Shared High Table 1/3", price: 3000 },
  wall: { label: "Wall of Fame", price: 950 },
};

const networks = [
  ["U", "UCONNECT"],
  ["24", "24plus"],
  ["WR", "WorldRing"],
  ["AFBN", "African Freight Bridge Network"],
  ["WSA", "World Shipping Alliance"],
  ["CPN", "Cargo Power Network"],
  ["JGC", "JGC Line"],
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
    image: premiumCounter.url,
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
    image: sharedTable.url,
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
    image: sharedTable.url,
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
    image: wallFame.url,
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
    image: beerImage.url,
    icon: Beer,
    bullets: ["Logo on the beer cups", "Strong visibility in the networking environment", "Sympathetic presence with high recall value"],
  },
  {
    title: "Pretzel Sponsor",
    price: "1,500 EUR",
    image: pretzelImage.url,
    icon: Utensils,
    bullets: ["Logo on the pretzel stand", "Culinary attention magnet", "Presence at a central meeting point"],
  },
  {
    title: "Coffee Sponsor",
    price: "1,500 EUR",
    image: coffeeImage.url,
    icon: Coffee,
    bullets: ["Logo at the coffee station", "High-frequency touchpoint throughout the day", "Useful sponsor presence with strong visibility"],
  },
  {
    title: "Bavarian Evening Sponsor",
    price: "2,000 EUR",
    image: eveningImage.url,
    icon: Star,
    bullets: ["Prominent visibility during the evening event", "Association with the key social highlight", "Memorable sponsor presence"],
  },
];

function Brand() {
  return (
    <a href="#overview" className="flex shrink-0 items-center gap-3" aria-label="LNF home">
      <span className="brand-mark">LNF</span>
      <span className="h-10 w-px bg-highlight" />
      <span className="hidden text-sm font-bold leading-[1.05] text-ink sm:block">Logistics<br />Network<br />Federation</span>
    </a>
  );
}

function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  return (
    <div className="mb-8">
      <h2 className="section-title">{children}</h2>
      <span className="title-rule" />
      {intro ? <p className="mt-2 max-w-3xl text-lg text-ink/80 md:text-xl">{intro}</p> : null}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink/85">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sky text-surface"><Check className="size-3.5" strokeWidth={3} /></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageKey>("premium");
  const [representatives, setRepresentatives] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const total = useMemo(() => packageOptions[selectedPackage].price + representatives * 500, [selectedPackage, representatives]);

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-surface/95 backdrop-blur">
        <div className="page-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:flex">
          <Brand />
          <nav className="ml-auto hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {[["Overview", "#overview"], ["Packages", "#packages"], ["Booth Concept", "#concept"], ["Sponsorship", "#sponsorship"], ["Wall of Fame", "#wall-of-fame"], ["Contact", "#contact"]].map(([label, href]) => (
              <a key={href} href={href} className="text-xs font-bold text-ink/75 transition-colors hover:text-sky">{label}</a>
            ))}
          </nav>
          <Button onClick={() => jumpTo("#contact")} className="hidden h-11 bg-highlight px-5 font-extrabold text-highlight-foreground shadow-none hover:bg-highlight/90 xl:inline-flex">
            Secure your participation <ArrowRight />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen ? (
          <nav className="border-t border-line bg-surface px-5 py-4 lg:hidden" aria-label="Mobile navigation">
            {[["Overview", "#overview"], ["Packages", "#packages"], ["Booth Concept", "#concept"], ["Sponsorship", "#sponsorship"], ["Wall of Fame", "#wall-of-fame"], ["Contact", "#contact"]].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-line/60 py-3 text-sm font-bold text-ink">{label}</a>
            ))}
          </nav>
        ) : null}
      </header>

      <section id="overview" className="relative bg-surface scroll-mt-20">
        <div className="page-shell pt-8 md:pt-12">
          <div className="mb-6 flex items-start justify-between gap-6">
            <Brand />
            <p className="max-w-44 text-right text-[11px] font-extrabold uppercase leading-relaxed text-ink tracking-[0.18em]">Stronger networks<br />brighter tomorrows<span className="ml-auto mt-2 block h-1 w-9 bg-highlight" /></p>
          </div>
        </div>
        <div className="relative mx-auto max-w-[1440px]">
          <img src={boothHero.url} alt="LNF shared booth at a busy international logistics exhibition" className="h-[45vh] min-h-[360px] w-full object-cover object-center md:h-[58vh]" />
          <div className="absolute right-6 top-8 hidden border-l-4 border-highlight bg-ink/80 px-5 py-4 text-sm font-black uppercase leading-relaxed text-surface md:block">People.<br />Partnerships.<br />Progress.</div>
        </div>
        <div className="relative">
          <div className="page-shell pb-12 pt-9 md:pb-16 md:pt-12">
            <div className="max-w-5xl">
              <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.94] text-ink">Visible together at <span className="block text-sky">transport logistic 2027</span></h1>
              <span className="title-rule mt-5" />
              <p className="mt-4 text-xl font-extrabold text-ink md:text-2xl">The LNF Shared Booth — 7 Networks. One Booth. Countless Connections.</p>
              <p className="mt-4 max-w-4xl text-base leading-relaxed text-ink/80 md:text-lg">Present your company as part of a professional 120 m² head booth in Munich. Benefit from the combined strength of seven partner networks, maximum visibility and valuable contacts. Enjoy all-day catering, optional Wall of Fame visibility for your members and a traditional Bavarian networking evening.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 border-y border-line py-6 sm:grid-cols-3 lg:grid-cols-5">
              {featureItems.map(({ icon: Icon, text }, index) => (
                <div key={text} className={`flex flex-col items-center px-3 py-3 text-center ${index !== 0 ? "border-l border-line" : ""}`}>
                  <span className="grid size-14 place-items-center rounded-full border-2 border-highlight text-ink"><Icon className="size-7" /></span>
                  <span className="mt-3 whitespace-pre-line text-sm font-extrabold leading-tight text-ink">{text}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-ink/65">Participating networks</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {networks.map(([mark, name]) => <div key={name} className="flex min-h-20 items-center gap-2 border-r border-line px-2"><strong className="text-xl font-black text-sky">{mark}</strong><span className="text-[10px] font-extrabold leading-tight text-ink">{name}</span></div>)}
            </div>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-3 text-xs font-bold text-ink/65"><span>Exhibition Offer&nbsp; | &nbsp;transport logistic 2027&nbsp; | &nbsp;Munich</span><span>26–29 April 2027 · Messe München</span><strong className="uppercase tracking-[0.2em] text-ink">Munich connects the world.</strong></div>
          </div>
          <div className="city-wave" />
        </div>
      </section>

      <section id="packages" className="page-band scroll-mt-20">
        <div className="page-shell">
          <SectionHeading intro="Choose the format that best fits your trade fair presence.">Participation Packages <span className="text-sky">at a Glance</span></SectionHeading>
          <div className="grid gap-5 lg:grid-cols-2">
            {packages.map((pkg) => (
              <article key={pkg.key} className={`package-card ${selectedPackage === pkg.key ? "ring-2 ring-sky" : ""}`}>
                <div className="relative overflow-hidden rounded-t-[6px]">
                  <img src={pkg.image} alt={pkg.title} className="h-52 w-full object-cover" />
                  {pkg.top ? <span className="absolute right-0 top-0 bg-sky px-4 py-2 text-xs font-black uppercase text-surface"><Star className="mr-1 inline size-4 fill-current" /> Our top package</span> : null}
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <h3 className="min-w-0 text-lg font-black text-ink">{pkg.category}{pkg.category ? " | " : ""}{pkg.title}</h3>
                    <span className="shrink-0 text-xl font-black text-sky underline decoration-highlight decoration-2 underline-offset-8">{pkg.price}</span>
                  </div>
                  <div className="mt-5"><BulletList items={pkg.bullets} /></div>
                  <Button onClick={() => { setSelectedPackage(pkg.key); jumpTo("#contact"); }} variant="outline" className="mt-6 w-full border-sky text-sky shadow-none hover:bg-sky hover:text-surface">Select this package</Button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 rounded-lg bg-panel p-5 md:grid-cols-[1.35fr_2fr] md:items-center">
            <div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-highlight"><Users className="size-7 text-ink" /></span><p className="text-sm font-bold text-ink">Additional full-event booth representative: <strong className="text-sky">500 EUR</strong><br /><span className="font-normal text-ink/70">incl. exhibitor access, all-day catering and full booth services</span></p></div>
            <div className="grid grid-cols-4 divide-x divide-sky/40 text-center">{[["14x", "Category 1"], ["5x", "Category 2"], ["5x", "Category 3"], ["15x", "Wall of Fame"]].map(([count, label]) => <div key={label} className="px-2"><strong className="block text-xl text-ink">{count}</strong><span className="text-xs text-ink/70">{label}</span></div>)}</div>
          </div>
          <p className="mt-4 text-xs text-ink/60">All prices are net prices in EUR. Applicable taxes, if any, will be added.</p>
        </div>
      </section>

      <section id="concept" className="scroll-mt-20 bg-surface">
        <div className="relative mx-auto max-w-[1440px]"><img src={boothHero.url} alt="Open LNF networking booth concept" className="h-[42vh] min-h-[340px] w-full object-cover" /><div className="absolute bottom-6 right-6 border-l-4 border-highlight bg-ink/85 px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-surface">People connect markets</div></div>
        <div className="page-shell py-14">
          <SectionHeading intro="The LNF shared booth brings together people, partner networks and business opportunities.">More than booth space:<br /><span className="text-sky">a true networking happening</span></SectionHeading>
          <h3 className="mb-5 text-2xl font-black text-ink">Why take part?</h3>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
            {[{ icon: Users, text: "7 partner networks on one booth" }, { icon: Expand, text: "120 m² professional shared booth" }, { icon: Globe2, text: "International visibility & new contacts" }, { icon: Utensils, text: "All-day catering for exhibitors" }, { icon: Handshake, text: "Open networking space with high visitor appeal" }].map(({ icon: Icon, text }) => <div key={text} className="concept-item"><span className="grid size-14 place-items-center rounded-full border-2 border-highlight"><Icon className="size-7" /></span><strong>{text}</strong></div>)}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <h3 className="mb-5 text-2xl font-black text-ink">What else to expect</h3>
              <BulletList items={["Traditional Bavarian networking evening in Munich", "Additional full-event booth representative: 500 EUR — incl. exhibitor access, all-day catering and full booth services.", "Category 1 includes daily 30-minute meeting room usage", "Presence without travel possible via the Wall of Fame"]} />
            </div>
            <aside className="rounded-lg bg-panel p-5">
              <h3 className="text-xl font-black text-ink underline decoration-highlight decoration-2 underline-offset-8">Booth Concept</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">An open, inviting and high-quality setup with individual counters, branded shared high tables, a meeting room, a bar and a central networking area.</p>
              <div className="mt-5 grid aspect-[4/3] place-items-center border-2 border-sky/30 bg-surface p-5"><div className="grid size-full grid-cols-3 gap-2 border-4 border-ink/70 p-3">{Array.from({ length: 9 }).map((_, i) => <span key={i} className={`border border-sky/50 ${i === 4 ? "bg-sky" : "bg-panel"}`} />)}</div></div>
            </aside>
          </div>
        </div>
        <div className="city-wave" />
      </section>

      <section id="sponsorship" className="page-band scroll-mt-20">
        <div className="page-shell">
          <SectionHeading intro="Increase your visibility with eye-catching presence formats.">Sponsorship &amp; Additional Options</SectionHeading>
          <div className="grid gap-5 lg:grid-cols-2">
            {sponsors.map(({ title, price, image, icon: Icon, bullets }) => (
              <article key={title} className="package-card">
                <img src={image} alt={title} className="h-56 w-full rounded-t-[6px] object-cover" />
                <div className="p-5"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h3 className="min-w-0 text-2xl font-black text-ink">{title}</h3><strong className="shrink-0 rounded bg-highlight px-3 py-1 text-lg text-highlight-foreground">{price}</strong></div><ul className="mt-5 space-y-3">{bullets.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-ink/80"><span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-highlight"><Icon className="size-4" /></span>{item}</li>)}</ul></div>
              </article>
            ))}
          </div>
          <div id="wall-of-fame" className="scroll-mt-24 pt-10">
            <h3 className="section-title text-3xl">Further Options</h3><span className="title-rule" />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[{ icon: MonitorUp, title: "Wall of Fame", price: "950 EUR", text: "Logo, photo and QR code on the presentation wall." }, { icon: Users, title: "Additional full-event booth representative", price: "500 EUR", text: "Incl. exhibitor access, all-day catering and full booth services." }, { icon: Beer, title: "Bavarian Networking Evening", price: "Included", text: "Important: Free of charge to attend." }].map(({ icon: Icon, title, price, text }) => <article key={title} className="flex items-center gap-4 rounded-lg border border-line bg-surface p-5"><span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-highlight"><Icon className="size-7" /></span><div><h4 className="text-sm font-black text-ink">{title}</h4><strong className={price === "Included" ? "rounded bg-success px-2 py-0.5 text-xs text-surface" : "text-sky"}>{price}</strong><p className="mt-1 text-xs text-ink/70">{text}</p></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 bg-ink text-surface">
        <div className="page-shell grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-4"><Handshake className="size-16 text-highlight" /><div><h2 className="text-3xl font-black md:text-4xl">Secure your participation now</h2><span className="mt-3 block h-1 w-16 bg-highlight" /></div></div>
            <p className="mt-6 max-w-md text-surface/75">Spaces are limited. Secure your preferred participation or sponsorship package, or ask for a tailored option today.</p>
            <div className="mt-8 rounded-lg bg-surface/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-surface/60">Your selection</p>
              <p className="mt-2 text-lg font-black">{packageOptions[selectedPackage].label}</p>
              <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-5"><div><Label htmlFor="representatives" className="text-surface/75">Additional representatives</Label><div className="mt-2 flex items-center gap-2"><Button type="button" variant="outline" size="icon" className="border-surface/30 bg-transparent text-surface hover:bg-surface/10 hover:text-surface" onClick={() => setRepresentatives((n) => Math.max(0, n - 1))}>−</Button><span className="w-8 text-center text-xl font-black">{representatives}</span><Button type="button" variant="outline" size="icon" className="border-surface/30 bg-transparent text-surface hover:bg-surface/10 hover:text-surface" onClick={() => setRepresentatives((n) => Math.min(10, n + 1))}>+</Button></div></div><div className="text-right"><span className="text-xs text-surface/60">Net total</span><strong className="block text-3xl text-highlight">{total.toLocaleString("en-US")} EUR</strong></div></div>
            </div>
          </div>
          <form onSubmit={submitInquiry} className="grid gap-4 rounded-lg bg-surface p-6 text-ink md:grid-cols-2">
            <div><Label htmlFor="name">Name *</Label><Input id="name" required className="mt-2 h-11" /></div>
            <div><Label htmlFor="company">Company *</Label><Input id="company" required className="mt-2 h-11" /></div>
            <div><Label htmlFor="email">Business email *</Label><Input id="email" type="email" required className="mt-2 h-11" /></div>
            <div><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" className="mt-2 h-11" /></div>
            <div className="md:col-span-2"><Label htmlFor="package">Selected package</Label><select id="package" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value as PackageKey)} className="mt-2 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm">{Object.entries(packageOptions).map(([key, item]) => <option key={key} value={key}>{item.label} — {item.price.toLocaleString("en-US")} EUR</option>)}</select></div>
            <div className="md:col-span-2"><Label htmlFor="message">Message</Label><Textarea id="message" className="mt-2 min-h-24" placeholder="Tell us about your preferred setup or sponsorship interest." /></div>
            <div className="md:col-span-2"><Button type="submit" className="h-12 w-full bg-highlight text-base font-black text-highlight-foreground hover:bg-highlight/90">Request reservation <ArrowRight /></Button>{submitted ? <p role="status" className="mt-3 flex items-center gap-2 text-sm font-bold text-success"><Check className="size-4" /> Thank you — your reservation inquiry is ready for the LNF team.</p> : null}</div>
          </form>
        </div>
      </section>

      <footer className="bg-deep text-surface"><div className="page-shell flex flex-col gap-5 py-8 sm:flex-row sm:items-end sm:justify-between"><Brand /><div className="text-sm text-surface/65"><p>26–29 April 2027 | Messe München</p><p className="mt-1">Exhibition Offer | transport logistic 2027 | Munich</p></div><strong className="uppercase tracking-[0.2em]">Munich connects<br />the world.</strong></div></footer>
    </main>
  );
}
