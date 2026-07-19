import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, MENU, type MenuCategory } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/menu/")({
  head: () => ({
    meta: [
      { title: "Menu — Princess Eat Right Kitchen | Ijebu Ode" },
      {
        name: "description",
        content:
          "Explore the full menu at Princess Eat Right Kitchen — Jollof Rice, Fried Rice, Amala, Egusi, Efo Riro, Chicken, Turkey, and more, from ₦200 to ₦5,000.",
      },
      { property: "og:title", content: "Menu — Princess Eat Right Kitchen" },
      {
        property: "og:description",
        content: "Home-style Nigerian dishes served daily in Ijebu Ode, Ogun State.",
      },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuIndex,
});

function MenuIndex() {
  const [active, setActive] = useState<MenuCategory | "All">("All");
  const items = active === "All" ? MENU : MENU.filter((m) => m.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 animate-fade-in">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Our Menu</p>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            Home cooking, served all day.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every dish is prepared fresh in our Ijebu Ode kitchen. Prices are per portion — dine in,
            pick up kerbside, or have it delivered.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={
                "rounded-full border px-4 py-1.5 text-sm transition-all duration-300 " +
                (active === cat
                  ? "border-primary bg-primary text-primary-foreground scale-105 shadow-sm"
                  : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:scale-105")
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {items.map((item) => (
            <MenuCard key={item.slug} item={item} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
