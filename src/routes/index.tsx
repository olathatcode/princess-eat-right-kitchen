import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, Clock, Star, CheckCircle2, Truck, CalendarCheck, ChefHat, Quote } from "lucide-react";
import { MENU } from "@/data/menu";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useCart } from "@/context/CartContext";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Princess Eat Right Kitchen — Home-style Nigerian Restaurant, Ijebu Ode" },
      {
        name: "description",
        content:
          "Women-owned Nigerian kitchen in Ijebu Ode serving Jollof Rice, Fried Rice, Amala, Egusi, Efo Riro, and more. Dine-in, pickup, and delivery.",
      },
      { property: "og:title", content: "Princess Eat Right Kitchen — Ijebu Ode" },
      {
        property: "og:description",
        content: "Home-style Nigerian cooking, made fresh daily. Dine-in, pickup, and delivery in Ijebu Ode.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Princess Eat Right Kitchen",
          servesCuisine: "Nigerian",
          priceRange: "₦1–10,000",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Adjacent Barracks Junction, Esepa, Ita-Paadi",
            addressLocality: "Ijebu Ode",
            postalCode: "120102",
            addressRegion: "Ogun State",
            addressCountry: "NG",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.4",
            reviewCount: "19",
          },
        }),
      },
    ],
  }),
  component: Home,
});

/* ─── Dish card used in the Popular Dishes row ────────────────────────── */
function DishCard({ item }: { item: (typeof MENU)[number] }) {
  const { addItem, getQuantity } = useCart();
  const qty = getQuantity(item.slug);

  return (
    <div className="group flex w-52 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-56">
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={optimizeImageUrl(item.image, 400, 75)}
          alt={item.name}
          loading="lazy"
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* star rating pill */}
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-amber-500 shadow-sm backdrop-blur-sm dark:bg-black/60">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          4.4
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {item.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60">
          <span className="font-display text-base font-bold text-primary">
            {formatNaira(item.priceNaira)}
          </span>
          <button
            type="button"
            onClick={() => addItem(item)}
            className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-3 w-3" />
            {qty > 0 ? `+1 (${qty})` : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonial card ─────────────────────────────────────────────────── */
const REVIEWS = [
  {
    name: "Amina Bello",
    rating: 5,
    text: "The Jollof Rice here is absolutely divine — smoky, rich, and just like grandma's. I bring the whole family every weekend.",
    role: "Regular customer",
  },
  {
    name: "Chukwuemeka O.",
    rating: 5,
    text: "Best Amala and Egusi in Ijebu Ode, no contest. The portions are generous and the service is always warm.",
    role: "Loyal patron",
  },
  {
    name: "Funmi Adeyemi",
    rating: 4,
    text: "I ordered the Moi Moi and Fried Rice for my office and everyone was raving. Delivery was fast and the food arrived hot!",
    role: "Office client",
  },
];

/* ─── Home page ────────────────────────────────────────────────────────── */
function Home() {
  const popularDishes = MENU.filter((m) =>
    ["jollof-rice", "egusi", "efo-riro", "moimoi", "chicken", "fried-rice"].includes(m.slug),
  );
  const heroItem = MENU.find((m) => m.slug === "jollof-rice")!;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* ══════════════════════════════════════════════════════════════
            §1  HERO  — split layout
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-secondary/30">
          {/* background blob */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-20 lg:grid-cols-2 lg:py-24">
            {/* ── Left: text ── */}
            <div className="animate-fade-in-up">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Welcome to
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
                Princess Eat Right Kitchen
                <br />
                <span className="text-primary">and Enjoy The Food</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Home-style Nigerian cooking made fresh every day in our Esepa kitchen — Jollof
                Rice, Amala, Egusi, Efo Riro, and more. Dine in, pick up, or order delivery.
              </p>

              {/* CTA buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/menu"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg"
                >
                  Reserve a Table
                </Link>
                <a
                  href="tel:+2349039108517"
                  className="rounded-full border border-border bg-card px-7 py-3 text-sm font-bold text-foreground transition-all hover:border-primary/50 hover:scale-105"
                >
                  Online Order
                </a>
              </div>

              {/* hours badge */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/70 shadow-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Open: 8:00am – 9:30pm</span>
              </div>
            </div>

            {/* ── Right: circular hero image + floating card ── */}
            <div
              className="relative flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              {/* outer decorative dashed ring */}
              <div className="absolute h-[360px] w-[360px] rounded-full border-2 border-dashed border-primary/25 sm:h-[420px] sm:w-[420px]" />
              {/* inner tinted circle bg */}
              <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-4 border-white/60 bg-primary/5 shadow-2xl sm:h-[360px] sm:w-[360px] dark:border-white/10">
                <img
                  src={optimizeImageUrl(heroItem.image, 720, 80)}
                  alt={heroItem.name}
                  width={720}
                  height={720}
                  fetchPriority="high"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* floating mini card — bottom left */}
              <div className="absolute -bottom-2 left-2 flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-xl sm:left-4">
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-muted shrink-0">
                  <img
                    src={optimizeImageUrl(heroItem.image, 80, 75)}
                    alt={heroItem.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{heroItem.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[110px]">
                    {heroItem.shortDescription}
                  </p>
                  <p className="text-xs font-bold text-primary mt-0.5">
                    {formatNaira(heroItem.priceNaira)}
                  </p>
                </div>
              </div>

              {/* "Best Food" badge — top right */}
              <div className="absolute -top-2 right-4 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-md sm:right-6">
                <ChefHat className="h-3.5 w-3.5" />
                Best Food 🏆
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §2  POPULAR DISHES
        ══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          {/* heading row */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                From our kitchen
              </p>
              <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
                Our Popular{" "}
                <span className="relative text-primary">
                  Dishes
                  {/* squiggly underline accent */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 120 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 5 Q15 1 30 5 Q45 9 60 5 Q75 1 90 5 Q105 9 118 5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
            </div>
            <Link
              to="/menu"
              className="hidden items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary sm:flex"
            >
              View all →
            </Link>
          </div>

          {/* horizontal scroll row */}
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
            {popularDishes.map((item, i) => (
              <div
                key={item.slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <DishCard item={item} />
              </div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/menu"
              className="inline-flex rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50"
            >
              See the full menu →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §3  BEST SERVICE STRIP
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-secondary/40">
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg,currentColor 0,currentColor 1px,transparent 0,transparent 50%)",
              backgroundSize: "12px 12px",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
            {/* left: dish image */}
            <div className="relative flex justify-center animate-fade-in-up">
              <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-white/50 shadow-2xl dark:border-white/10 sm:h-80 sm:w-80">
                <img
                  src={optimizeImageUrl(MENU.find(m => m.slug === "egusi")!.image, 640, 80)}
                  alt="Egusi Soup"
                  width={640}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* dashed orbit */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[320px] w-[320px] rounded-full border-2 border-dashed border-primary/20 sm:h-[360px] sm:w-[360px]" />
              </div>
            </div>

            {/* right: text + features */}
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Why choose us
              </p>
              <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                We Provide Best Service{" "}
                <span className="text-primary">for Our Customer</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every dish is cooked with love, fresh ingredients, and the authentic recipes
                that have made Princess Eat Right Kitchen a favourite in Ijebu Ode.
              </p>

              <ul className="mt-6 flex flex-col gap-4">
                {[
                  { icon: <CheckCircle2 className="h-5 w-5 text-primary" />, title: "Best Quality", desc: "Fresh ingredients sourced daily from local markets." },
                  { icon: <Truck className="h-5 w-5 text-primary" />, title: "Home Delivery", desc: "Hot food delivered straight to your door." },
                  { icon: <CalendarCheck className="h-5 w-5 text-primary" />, title: "Pre Booking", desc: "Reserve ahead for events, parties, and offices." },
                  { icon: <ShoppingCart className="h-5 w-5 text-primary" />, title: "Easy to Order", desc: "Add to your food list and send us a WhatsApp message." },
                ].map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {f.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §4  TESTIMONIALS
        ══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Reviews
            </p>
            <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
              What are our{" "}
              <span className="text-primary">Customers</span>{" "}
              say about us
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <div
                key={r.name}
                className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
                {/* stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
                <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
                  {/* avatar placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/reviews"
              className="inline-flex rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/50 hover:text-primary"
            >
              See all reviews →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §5  CTA BANNER
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-secondary/40">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Order Today
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Are You Ready to Enjoy{" "}
              <span className="text-primary">Our Food?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Fresh, home-style Nigerian dishes cooked daily in Ijebu Ode. Reserve your table,
              order online, or call us — we're ready for you.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="tel:+2349039108517"
                className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:scale-105"
              >
                Reserve a Table
              </a>
              <Link
                to="/menu"
                className="rounded-full border border-border bg-card px-7 py-3 text-sm font-bold text-foreground transition hover:border-primary/50 hover:scale-105"
              >
                Online Order
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            §6  LOCATION STRIP
        ══════════════════════════════════════════════════════════════ */}
        <section className="border-t border-border/60 bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 py-5 sm:justify-between">
            {[
              { icon: <Star className="h-4 w-4 text-primary" />, text: "4.4 / 5 on Google" },
              { icon: <Clock className="h-4 w-4 text-primary" />, text: "Open daily · Closes 9:30 pm" },
              { icon: <Truck className="h-4 w-4 text-primary" />, text: "Dine-in · Pickup · Delivery" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm text-foreground/70">
                {b.icon}
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
