import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useMemo, useCallback, memo, type FormEvent } from "react";
import { Star, ThumbsUp, MessageSquare, CheckCircle2, Filter, ArrowUpDown, Plus, Quote } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { toast } from "sonner";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Princess Eat Right Kitchen | Ijebu Ode" },
      { name: "description", content: "Read what our customers say about Princess Eat Right Kitchen." },
      { property: "og:title", content: "Customer Reviews — Princess Eat Right Kitchen" },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

interface Review {
  id: string; name: string; rating: number; date: string;
  text: string; diningOption: string; recommendedDishes: string[];
  helpfulCount: number; ownerResponse?: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id:"1", name:"Tunde Bakare", rating:5, date:"2025-02-15",
    text:"The smoky Jollof Rice is out of this world! Tastes exactly like party Jollof. Portion was generous and the chicken perfectly spiced. Will definitely order again.",
    diningOption:"Dine-in", recommendedDishes:["Jollof Rice","Chicken"], helpfulCount:12,
    ownerResponse:"Thank you so much, Tunde! We take pride in our slow-cooked smoky Jollof. Hope to see you again soon." },
  { id:"2", name:"Chioma Nwachukwu", rating:5, date:"2025-02-12",
    text:"Their Egusi Soup is so rich and delicious. The beef was tender and well-seasoned. It arrived hot and fresh. Best Nigerian food in Ijebu Ode!",
    diningOption:"Delivery", recommendedDishes:["Egusi Soup","Beef"], helpfulCount:8,
    ownerResponse:"Thank you Chioma! We make sure delivery orders are packed hot and fresh." },
  { id:"3", name:"Abiola Adebayo", rating:4, date:"2025-02-10",
    text:"Amala and Abula was very smooth and hot. The soup was rich and authentic. They were quite busy on Saturday but the food was worth the wait.",
    diningOption:"Dine-in", recommendedDishes:["Amala","Ewedu & Gbegiri (Abula)"], helpfulCount:5,
    ownerResponse:"Thank you Abiola! We are working on speeding up service during peak hours!" },
  { id:"4", name:"Funmi Olayinka", rating:5, date:"2025-02-05",
    text:"Best restaurant in Ijebu Ode! The Efo Riro is so authentic and packed with flavor. Clean environment and extremely friendly staff.",
    diningOption:"Pickup", recommendedDishes:["Efo Riro"], helpfulCount:9,
    ownerResponse:"Thank you Funmi! Our Efo Riro is made with fresh spinach and traditional spices." },
  { id:"5", name:"Emeka Okafor", rating:4, date:"2025-01-28",
    text:"Great portion sizes for the price. The Fried Rice is tasty and loaded with veggies. The turkey was huge and delicious.",
    diningOption:"Delivery", recommendedDishes:["Fried Rice","Turkey (Big)"], helpfulCount:4,
    ownerResponse:"Thank you Emeka! Looking forward to serving you our swallows next time!" },
];

const POPULAR_DISHES = [
  "Jollof Rice","Fried Rice","Amala","Egusi Soup","Efo Riro",
  "Ewedu & Gbegiri (Abula)","Chicken","Turkey (Big)","Moi Moi","Beef",
];

/* ─────────────────────────────────────────────────────────────────────────────
   ReviewForm — isolated memo component.
   All form state lives HERE, so typing never re-renders the parent page.
───────────────────────────────────────────────────────────────────────────── */
const ReviewForm = memo(function ReviewForm({
  onSubmit, onCancel,
}: {
  onSubmit: (data: Omit<Review, "id" | "helpfulCount" | "ownerResponse">) => void;
  onCancel: () => void;
}) {
  const [name, setName]           = useState("");
  const [rating, setRating]       = useState(5);
  const [text, setText]           = useState("");
  const [dining, setDining]       = useState("Dine-in");
  const [dishes, setDishes]       = useState<string[]>([]);

  const toggleDish = (d: string) =>
    setDishes((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim())             { toast.error("Please enter your name."); return; }
    if (text.trim().length < 10) { toast.error("Please write at least 10 characters."); return; }
    onSubmit({ name: name.trim(), rating, date: new Date().toISOString().split("T")[0],
               text: text.trim(), diningOption: dining, recommendedDishes: [...dishes] });
  };

  return (
    <div className="animate-slide-down rounded-2xl border border-border bg-card p-6 shadow-md lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground">Share Your Experience</h2>
        <button onClick={onCancel} className="text-sm text-muted-foreground transition hover:text-foreground">Cancel</button>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Overall Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} className="p-1 transition hover:scale-110">
                <Star className={`h-8 w-8 transition-colors ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rev-name" className="mb-1.5 block text-sm font-medium text-foreground">Your Name</label>
            <input id="rev-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Funmi Alao" required
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="rev-dining" className="mb-1.5 block text-sm font-medium text-foreground">Dining Option</label>
            <select id="rev-dining" value={dining} onChange={(e) => setDining(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option>Dine-in</option><option>Pickup</option><option>Delivery</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">What did you enjoy?</label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DISHES.map((d) => (
              <button key={d} type="button" onClick={() => toggleDish(d)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                  dishes.includes(d) ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="rev-text" className="mb-1.5 block text-sm font-medium text-foreground">Your Review</label>
          <textarea id="rev-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} required
            placeholder="Tell us about the food, service, and atmosphere…"
            className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          <p className="mt-1 text-xs text-muted-foreground">Minimum 10 characters.</p>
        </div>

        <button type="submit"
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-95">
          Submit Review
        </button>
      </form>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────────────────
   RatingBar — simple CSS transition, no scroll observer needed
───────────────────────────────────────────────────────────────────────────── */
function RatingBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${percentage}%` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ReviewCard — pure presentational, memoized to avoid re-renders
───────────────────────────────────────────────────────────────────────────── */
const ReviewCard = memo(function ReviewCard({ review, helpfulClicked, onHelpful }: {
  review: Review; helpfulClicked: Record<string,boolean>; onHelpful: (id:string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground">{review.name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                <CheckCircle2 className="h-3 w-3" /> Verified Guest
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
            </div>
          </div>
        </div>
        <span className="self-start rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{review.diningOption}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">{review.text}</p>

      {review.recommendedDishes?.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Recommends:</span>
          {review.recommendedDishes.map((d) => (
            <span key={d} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{d}</span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4">
        <button onClick={() => onHelpful(review.id)}
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
            helpfulClicked[review.id] ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}>
          <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({review.helpfulCount})
        </button>
        {review.ownerResponse && (
          <div className="rounded-xl border-l-2 border-primary bg-muted/50 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Quote className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Princess Kitchen</span>
              <span className="text-[10px] text-muted-foreground">Owner</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{review.ownerResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────────────────
   ReviewsPage — main page component
───────────────────────────────────────────────────────────────────────────── */
function ReviewsPage() {
  const [reviews, setReviews]               = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm]             = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string,boolean>>({});
  const [ratingFilter, setRatingFilter]     = useState("All");
  const [sortBy, setSortBy]                 = useState("recent");

  const heroRef    = useScrollReveal<HTMLDivElement>();
  const summaryRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef    = useRef<HTMLDivElement>(null);

  /* Load persisted data once on mount */
  useEffect(() => {
    const stored = localStorage.getItem("princess_reviews");
    if (stored) { try { setReviews(JSON.parse(stored)); } catch { /* keep initial */ } }
    else { localStorage.setItem("princess_reviews", JSON.stringify(INITIAL_REVIEWS)); }

    const sh = localStorage.getItem("princess_helpful_clicked");
    if (sh) { try { setHelpfulClicked(JSON.parse(sh)); } catch { /* ignore */ } }
  }, []);

  /* Scroll-reveal cards — only re-runs when the list data/filter/sort changes */
  const sortedReviews = useMemo(() =>
    [...reviews]
      .filter((r) => ratingFilter === "All" || r.rating === parseInt(ratingFilter))
      .sort((a, b) => {
        if (sortBy === "recent")  return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest")  return a.rating - b.rating;
        if (sortBy === "helpful") return b.helpfulCount - a.helpfulCount;
        return 0;
      }),
    [reviews, ratingFilter, sortBy],
  );

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLElement>(".review-card"));
    cards.forEach((c) => c.classList.remove("is-visible"));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );
    const t = setTimeout(() => cards.forEach((c, i) => { c.style.transitionDelay = `${i * 50}ms`; obs.observe(c); }), 30);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [sortedReviews]);

  /* Stable callbacks — won't cause child re-renders */
  const handleFormSubmit = useCallback((data: Omit<Review, "id" | "helpfulCount" | "ownerResponse">) => {
    const r: Review = { ...data, id: Date.now().toString(), helpfulCount: 0 };
    if (data.rating === 5) r.ownerResponse = `Thank you so much, ${data.name}! We are absolutely thrilled you had a 5-star experience!`;
    else if (data.rating === 4) r.ownerResponse = `Thank you, ${data.name}! We look forward to making your next visit a 5-star experience.`;
    setReviews((prev) => { const u = [r, ...prev]; localStorage.setItem("princess_reviews", JSON.stringify(u)); return u; });
    setShowForm(false); setRatingFilter("All"); setSortBy("recent");
    toast.success("Thank you! Your review has been posted. 🎉");
  }, []);

  const handleCancel = useCallback(() => setShowForm(false), []);

  const handleHelpful = useCallback((id: string) => {
    setHelpfulClicked((prev) => {
      if (prev[id]) { toast.info("You already marked this as helpful."); return prev; }
      const u = { ...prev, [id]: true };
      localStorage.setItem("princess_helpful_clicked", JSON.stringify(u));
      toast.success("Marked as helpful!");
      return u;
    });
    setReviews((prev) => {
      const u = prev.map((r) => r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r);
      localStorage.setItem("princess_reviews", JSON.stringify(u));
      return u;
    });
  }, []);

  /* Derived stats */
  const totalReviews      = reviews.length;
  const averageRating     = totalReviews ? Number((reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1)) : 0;
  const ratingCounts      = useMemo(() => { const c=[0,0,0,0,0]; reviews.forEach((r)=>{ if(r.rating>=1&&r.rating<=5) c[r.rating-1]++; }); return c; }, [reviews]);
  const recommendationRate = totalReviews ? Math.round(reviews.filter((r) => r.rating >= 4).length / totalReviews * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-10">

        {/* Hero */}
        <div ref={heroRef} className="reveal max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Guest Book</p>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">What our customers say.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Real reviews from our community in Ijebu Ode. Share your own experience below.</p>
        </div>

        {/* Summary + Form */}
        <div ref={summaryRef} className="reveal mt-12 grid gap-8 items-start lg:grid-cols-3" style={{ transitionDelay: "80ms" }}>

          {/* Rating Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-1">
            <h2 className="mb-4 font-display text-xl text-foreground">Rating Summary</h2>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-foreground">{averageRating}</span>
              <span className="text-lg text-muted-foreground">/ 5</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(averageRating) ? "fill-primary text-primary" : "text-muted-foreground/25"}`} />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({totalReviews} {totalReviews === 1 ? "review" : "reviews"})</span>
            </div>

            <div className="mt-6 space-y-3">
              {[5,4,3,2,1].map((stars) => {
                const pct = totalReviews ? Math.round(ratingCounts[stars-1] / totalReviews * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-sm">
                    <button onClick={() => setRatingFilter(stars.toString())} className="w-12 text-left text-muted-foreground transition hover:text-primary">{stars} ★</button>
                    <RatingBar percentage={pct} />
                    <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Recommendation Rate</p>
                <p className="text-xs text-muted-foreground">Guests rating 4 or 5 stars</p>
              </div>
              <span className="font-display text-2xl font-bold text-primary">{recommendationRate}%</span>
            </div>

            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95">
                <Plus className="h-4 w-4" /> Write a Review
              </button>
            )}
          </div>

          {/* Form or placeholder */}
          {showForm ? (
            <ReviewForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
          ) : (
            <div className="hidden flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center lg:flex lg:col-span-2">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Have you dined with us?</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">Your feedback helps us maintain our high standards.</p>
              <button onClick={() => setShowForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
                <Plus className="h-4 w-4" /> Write a Review
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="mt-16">
          <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl text-foreground">Customer Reviews ({sortedReviews.length})</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary">
                  <option value="All">All Ratings</option>
                  {[5,4,3,2,1].map((s) => <option key={s} value={s}>{s} Stars</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary">
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>

          {sortedReviews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No reviews found for this filter.</p>
              <button onClick={() => { setRatingFilter("All"); setSortBy("recent"); }} className="mt-4 text-sm text-primary hover:underline">Clear filters</button>
            </div>
          ) : (
            <div ref={listRef} className="mt-8 flex flex-col gap-5">
              {sortedReviews.map((review) => (
                <div key={review.id} className="review-card reveal">
                  <ReviewCard review={review} helpfulClicked={helpfulClicked} onHelpful={handleHelpful} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
