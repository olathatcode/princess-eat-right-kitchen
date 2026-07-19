import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getMenuItem, MENU } from "@/data/menu";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { MenuCard } from "@/components/MenuCard";

export const Route = createFileRoute("/menu/$slug")({
  loader: ({ params }) => {
    const item = getMenuItem(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Dish not found — Princess Eat Right Kitchen" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { item } = loaderData;
    const title = `${item.name} — ${formatNaira(item.priceNaira)} | Princess Eat Right Kitchen`;
    return {
      meta: [
        { title },
        { name: "description", content: item.shortDescription },
        { property: "og:title", content: item.name },
        { property: "og:description", content: item.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:image", content: item.image },
        { property: "og:url", content: `/menu/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: item.image },
      ],
      links: [{ rel: "canonical", href: `/menu/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MenuItem",
            name: item.name,
            description: item.description,
            image: item.image,
            offers: {
              "@type": "Offer",
              price: item.priceNaira,
              priceCurrency: "NGN",
              availability: "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: MenuDetail,
  notFoundComponent: DishNotFound,
  errorComponent: DishError,
});

function DishNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl text-foreground">We don't have that dish</h1>
        <p className="mt-4 text-muted-foreground">
          It may have sold out or been renamed. Browse our full menu below.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          See the menu
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function DishError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <Link
          to="/menu"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Back to menu
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function SpiceIndicator({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span aria-hidden>
        {"🌶️".repeat(level)}
        <span className="opacity-25">{"🌶️".repeat(3 - level)}</span>
      </span>
      <span className="uppercase tracking-widest">
        {level === 1 ? "Mild" : level === 2 ? "Medium" : "Hot"}
      </span>
    </span>
  );
}

function MenuDetail() {
  const { item } = Route.useLoaderData() as { item: (typeof MENU)[number] };
  const [quantity, setQuantity] = useState(1);
  const related = (item.pairsWith ?? [])
    .map((slug: string) => MENU.find((m) => m.slug === slug))
    .filter((m): m is (typeof MENU)[number] => Boolean(m));

  const totalPrice = item.priceNaira * quantity;
  const whatsappHref = `https://wa.me/+2349039108517?text=${encodeURIComponent(
    `Hello Princess Eat Right Kitchen, I would like to order ${quantity} portion(s) of ${item.name} (Total: ${formatNaira(totalPrice)}).`,
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 animate-fade-in">
        <nav className="mb-6 text-xs uppercase tracking-[0.18em] text-muted-foreground animate-fade-in-up">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/menu" className="hover:text-foreground">
            Menu
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{item.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div
            className="overflow-hidden rounded-3xl border border-border bg-muted animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <img
              src={optimizeImageUrl(item.image, 1000, 80)}
              alt={`${item.name} served at Princess Eat Right Kitchen`}
              width={1000}
              height={1000}
              fetchPriority="high"
              loading="eager"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>{item.category}</span>
              {item.spiceLevel && <SpiceIndicator level={item.spiceLevel} />}
              {item.tags?.map((t) => (
                <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              {item.name}
            </h1>
            <p className="mt-4 font-display text-3xl text-primary">
              {formatNaira(item.priceNaira)}
            </p>
            <p className="mt-4 text-lg text-muted-foreground">{item.shortDescription}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-border bg-card">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-foreground/70 hover:text-foreground disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="px-4 py-3 text-foreground/70 hover:text-foreground disabled:opacity-40"
                  disabled={quantity >= 20}
                >
                  +
                </button>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Order {quantity} on WhatsApp — {formatNaira(totalPrice)}
              </a>
            </div>
            <a
              href="tel:+2349039108517"
              className="mt-4 inline-flex rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:border-primary/60"
            >
              Call to reserve
            </a>

            <div className="mt-10">
              <h2 className="font-display text-xl text-foreground">About this dish</h2>
              <p className="mt-3 text-foreground/85 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl text-foreground">Ingredients</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl text-foreground">Pairs well with</h2>
              <Link to="/menu" className="text-sm text-primary hover:underline">
                Full menu →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <MenuCard key={r.slug} item={r} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
