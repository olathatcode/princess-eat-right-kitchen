import { Link } from "@tanstack/react-router";
import { formatNaira, optimizeImageUrl } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Link
      to="/menu/$slug"
      params={{ slug: item.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/40 animate-fade-in-up"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={optimizeImageUrl(item.image, 600, 75)}
          alt={`${item.name} served at Princess Eat Right Kitchen`}
          loading="lazy"
          width={600}
          height={450}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>{item.category}</span>
          {item.tags?.[0] && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
              {item.tags[0]}
            </span>
          )}
        </div>
        <h3 className="font-display text-xl leading-tight text-foreground">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg text-primary">{formatNaira(item.priceNaira)}</span>
          <span className="text-sm font-medium text-foreground/80 group-hover:text-primary">
            View dish →
          </span>
        </div>
      </div>
    </Link>
  );
}
