import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import { MENU } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Princess Eat Right Kitchen — Home-style Nigerian Restaurant, Ijebu Ode",
      },
      {
        name: "description",
        content:
          "Women-owned Nigerian kitchen in Ijebu Ode serving Jollof Rice, Fried Rice, Amala, Egusi, Efo Riro, and more. Dine-in, pickup, and delivery.",
      },
      {
        property: "og:title",
        content: "Princess Eat Right Kitchen — Ijebu Ode",
      },
      {
        property: "og:description",
        content:
          "Home-style Nigerian cooking, made fresh daily. Dine-in, pickup, and delivery in Ijebu Ode.",
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

function Home() {
  const featured = MENU.slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img
            src={heroImage}
            alt="A spread of Nigerian dishes at Princess Eat Right Kitchen"
            width={1600}
            height={900}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 animate-fade-in">
            <p className="text-xs uppercase tracking-[0.28em] text-primary animate-fade-in-up">
              Women-owned · Ijebu Ode
            </p>
            <h1
              className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] text-foreground sm:text-6xl animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Home cooking, the way grandma made it.
            </h1>
            <p
              className="mt-5 max-w-xl text-lg text-foreground/80 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Jollof rice with real smoke. Delicious fried rice. Amala, Egusi, Efo Riro — the
              authentic tastes you remember. Made fresh every morning in our Esepa kitchen.
            </p>
            <div
              className="mt-8 flex flex-wrap gap-3 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                to="/menu"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                See the menu
              </Link>
              <a
                href="tel:+2349039108517"
                className="rounded-full border border-border bg-card/90 px-6 py-3 text-sm font-medium text-foreground backdrop-blur hover:border-primary/60 transition-all duration-300 hover:scale-105"
              >
                Call to reserve
              </a>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-sm">
              <Link to="/reviews" className="group block hover:opacity-90 transition-opacity">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  Rating
                </dt>
                <dd className="mt-1 font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                  4.4 ★
                </dd>
              </Link>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Per person
                </dt>
                <dd className="mt-1 font-display text-2xl text-foreground">₦1–10k</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Closes</dt>
                <dd className="mt-1 font-display text-2xl text-foreground">9:30 pm</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Featured */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Kitchen favourites</p>
              <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
                What we're known for
              </h2>
            </div>
            <Link to="/menu" className="hidden text-sm text-primary hover:underline sm:inline">
              Full menu →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <MenuCard key={item.slug} item={item} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link to="/menu" className="text-sm text-primary hover:underline">
              See the full menu →
            </Link>
          </div>
        </section>

        {/* Visit strip */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary-foreground/70">
                Visit
              </p>
              <h2 className="mt-2 font-display text-3xl">Adjacent Barracks Junction, Esepa</h2>
              <p className="mt-3 text-secondary-foreground/85">
                Ita-Paadi, Ijebu Ode 120102, Ogun State. Look for the terracotta signboard.
              </p>
            </div>
            <div className="text-sm text-secondary-foreground/85 sm:text-right">
              <p>Dine-in · Kerbside pickup · Delivery</p>
              <p className="mt-1">Open daily · Closes 9:30 pm</p>
              <p className="mt-4">
                <a
                  href="https://maps.google.com/?q=Princess+Eat+Right+Kitchen+Ijebu+Ode"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Get directions →
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
