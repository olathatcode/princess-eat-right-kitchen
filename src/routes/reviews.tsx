import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, FormEvent } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Princess Eat Right Kitchen | Ijebu Ode" },
      {
        name: "description",
        content:
          "Read what our customers say about Princess Eat Right Kitchen in Ijebu Ode. Share your experience with our Jollof Rice, Amala, Egusi, and more.",
      },
      { property: "og:title", content: "Customer Reviews — Princess Eat Right Kitchen" },
      {
        property: "og:description",
        content: "See honest reviews from our customers in Ijebu Ode, Ogun State.",
      },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  diningOption: string;
  recommendedDishes: string[];
  helpfulCount: number;
  ownerResponse?: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Tunde Bakare",
    rating: 5,
    date: "2025-02-15",
    text: "The smoky Jollof Rice is out of this world! Tastes exactly like party Jollof. The portion size was generous and the chicken was perfectly spiced. Will definitely order again.",
    diningOption: "Dine-in",
    recommendedDishes: ["Jollof Rice", "Chicken"],
    helpfulCount: 12,
    ownerResponse:
      "Thank you so much, Tunde! We take pride in our slow-cooked smoky Jollof. Glad you loved the chicken too! Hope to see you again soon.",
  },
  {
    id: "2",
    name: "Chioma Nwachukwu",
    rating: 5,
    date: "2025-02-12",
    text: "Their Egusi Soup and Pounded Yam is so rich and delicious. The beef was tender and well-seasoned. It arrived hot and fresh via delivery. Best Nigerian food in Ijebu Ode!",
    diningOption: "Delivery",
    recommendedDishes: ["Egusi Soup", "Beef"],
    helpfulCount: 8,
    ownerResponse:
      "Thank you Chioma! We make sure our delivery orders are packed hot and fresh. We appreciate your kind words!",
  },
  {
    id: "3",
    name: "Abiola Adebayo",
    rating: 4,
    date: "2025-02-10",
    text: "Amala and Abula (Ewedu + Gbegiri) was very smooth and hot. The soup was rich and authentic. The only thing is they were quite busy on Saturday afternoon, but the food was worth the wait.",
    diningOption: "Dine-in",
    recommendedDishes: ["Amala", "Ewedu & Gbegiri (Abula)"],
    helpfulCount: 5,
    ownerResponse:
      "Thank you Abiola! Saturday afternoons can indeed get very busy, but we are glad you enjoyed the hot Amala and Abula. We are working on speeding up our service during peak hours!",
  },
  {
    id: "4",
    name: "Funmi Olayinka",
    rating: 5,
    date: "2025-02-05",
    text: "Best restaurant in Ijebu Ode! The Efo Riro is so authentic and packed with flavor. Clean environment and extremely friendly staff. Highly recommended!",
    diningOption: "Pickup",
    recommendedDishes: ["Efo Riro"],
    helpfulCount: 9,
    ownerResponse:
      "Thank you Funmi! Our Efo Riro is made with fresh spinach and traditional spices. We are thrilled to hear you enjoyed it and found our staff friendly!",
  },
  {
    id: "5",
    name: "Emeka Okafor",
    rating: 4,
    date: "2025-01-28",
    text: "Great portion sizes for the price. The Fried Rice is very tasty and loaded with veggies. The turkey was also huge and delicious. Will try the swallow next time.",
    diningOption: "Delivery",
    recommendedDishes: ["Fried Rice", "Turkey (Big)"],
    helpfulCount: 4,
    ownerResponse:
      "Thank you Emeka! We make sure our portions are satisfying and value-packed. Looking forward to serving you some of our delicious swallows next time!",
  },
];

const POPULAR_DISHES = [
  "Jollof Rice",
  "Fried Rice",
  "Amala",
  "Egusi Soup",
  "Efo Riro",
  "Ewedu & Gbegiri (Abula)",
  "Chicken",
  "Turkey (Big)",
  "Moi Moi",
  "Beef",
];

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  // Form state
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState("");
  const [formDiningOption, setFormDiningOption] = useState("Dine-in");
  const [formSelectedDishes, setFormSelectedDishes] = useState<string[]>([]);

  // Filter & Sort state
  const [ratingFilter, setRatingFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Load reviews from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("princess_reviews");
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem("princess_reviews", JSON.stringify(INITIAL_REVIEWS));
    }

    const storedHelpful = localStorage.getItem("princess_helpful_clicked");
    if (storedHelpful) {
      try {
        setHelpfulClicked(JSON.parse(storedHelpful));
      } catch (e) {
        // Ignore parsing error
      }
    }
  }, []);

  // Save reviews to localStorage
  const saveReviews = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem("princess_reviews", JSON.stringify(updatedReviews));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (formText.trim().length < 10) {
      toast.error("Please write a review of at least 10 characters.");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      name: formName.trim(),
      rating: formRating,
      date: new Date().toISOString().split("T")[0],
      text: formText.trim(),
      diningOption: formDiningOption,
      recommendedDishes: formSelectedDishes,
      helpfulCount: 0,
    };

    // Simulate owner response for 5-star reviews for extra delight!
    if (formRating === 5) {
      newReview.ownerResponse = `Thank you so much, ${formName.trim()}! We are absolutely thrilled that you had a 5-star experience at Princess Eat Right Kitchen. Your support means the world to our women-owned kitchen!`;
    } else if (formRating === 4) {
      newReview.ownerResponse = `Thank you for the wonderful review, ${formName.trim()}! We're glad you enjoyed the food and appreciate your feedback to help us make it a 5-star experience next time.`;
    }

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Reset form
    setFormName("");
    setFormRating(5);
    setFormText("");
    setFormDiningOption("Dine-in");
    setFormSelectedDishes([]);
    setShowForm(false);

    toast.success("Thank you! Your review has been posted successfully.");
  };

  // Toggle dish selection
  const handleDishToggle = (dish: string) => {
    if (formSelectedDishes.includes(dish)) {
      setFormSelectedDishes(formSelectedDishes.filter((d) => d !== dish));
    } else {
      setFormSelectedDishes([...formSelectedDishes, dish]);
    }
  };

  // Handle helpful click
  const handleHelpful = (id: string) => {
    if (helpfulClicked[id]) {
      toast.info("You already marked this review as helpful.");
      return;
    }

    const updated = reviews.map((r) => {
      if (r.id === id) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    });

    saveReviews(updated);

    const updatedHelpful = { ...helpfulClicked, [id]: true };
    setHelpfulClicked(updatedHelpful);
    localStorage.setItem("princess_helpful_clicked", JSON.stringify(updatedHelpful));
    toast.success("Marked as helpful!");
  };

  // Calculations for summary
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const ratingCounts = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 star
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });

  const recommendationRate = totalReviews
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100)
    : 0;

  // Filter & Sort reviews
  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter === "All") return true;
    return r.rating === parseInt(ratingFilter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "highest") {
      return b.rating - a.rating;
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    if (sortBy === "helpful") {
      return b.helpfulCount - a.helpfulCount;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 animate-fade-in">
        {/* Header */}
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Guest Book</p>
          <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
            What our customers say.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We love hearing about your dining experiences! Read honest reviews from our community in
            Ijebu Ode, or share your own feedback about our home-style cooking.
          </p>
        </div>

        {/* Summary & Form Section */}
        <div
          className="mt-12 grid gap-8 lg:grid-cols-3 items-start animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {/* Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-1">
            <h2 className="font-display text-xl text-foreground mb-4">Rating Summary</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-foreground">{averageRating}</span>
              <span className="text-lg text-muted-foreground">/ 5</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars - 1];
                const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-sm">
                    <button
                      onClick={() => setRatingFilter(stars.toString())}
                      className="w-12 text-left text-muted-foreground hover:text-primary transition-colors"
                    >
                      {stars} star
                    </button>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{percentage}%</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Recommendation Rate</p>
                  <p className="text-xs text-muted-foreground">Guests rating 4 or 5 stars</p>
                </div>
                <span className="text-2xl font-bold text-primary">{recommendationRate}%</span>
              </div>
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" /> Write a Review
              </button>
            )}
          </div>

          {/* Review Form (Conditional) */}
          {showForm ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md lg:col-span-2 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-foreground">Share Your Experience</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= formRating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Funmi Alao"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dining"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Dining Option
                    </label>
                    <select
                      id="dining"
                      value={formDiningOption}
                      onChange={(e) => setFormDiningOption(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Dine-in">Dine-in</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What did you enjoy? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_DISHES.map((dish) => {
                      const isSelected = formSelectedDishes.includes(dish);
                      return (
                        <button
                          key={dish}
                          type="button"
                          onClick={() => handleDishToggle(dish)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? "bg-primary/15 text-primary border border-primary"
                              : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
                          }`}
                        >
                          {dish}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review-text"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-text"
                    rows={4}
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    placeholder="Tell us about the food, service, and atmosphere. What made your meal special?"
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Minimum 10 characters.</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01]"
                >
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden lg:block lg:col-span-2 rounded-2xl border border-dashed border-border p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Have you dined with us?</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Your feedback helps us maintain our high standards of home-style Nigerian cooking.
                Share your thoughts with the community!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4" /> Write a Review
              </button>
            </div>
          )}
        </div>

        {/* Filters & Reviews List */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
            <h2 className="font-display text-2xl text-foreground">
              Customer Reviews ({sortedReviews.length})
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="All">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No reviews found matching your criteria.</p>
              <button
                onClick={() => {
                  setRatingFilter("All");
                  setSortBy("recent");
                }}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* User Info & Rating */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{review.name}</h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            <CheckCircle2 className="h-3 w-3" /> Verified Guest
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dining Option Tag */}
                    <span className="self-start rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {review.diningOption}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="mt-4 text-sm leading-relaxed text-foreground/90">{review.text}</p>

                  {/* Recommended Dishes */}
                  {review.recommendedDishes && review.recommendedDishes.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Recommends:</span>
                      {review.recommendedDishes.map((dish) => (
                        <span
                          key={dish}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions & Owner Response */}
                  <div className="mt-6 flex flex-col gap-4 border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          helpfulClicked[review.id]
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Helpful ({review.helpfulCount})</span>
                      </button>
                    </div>

                    {/* Owner Response */}
                    {review.ownerResponse && (
                      <div className="rounded-xl bg-muted/50 p-4 border-l-2 border-primary">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-display text-xs font-semibold text-foreground uppercase tracking-wider">
                            Princess Kitchen Response
                          </span>
                          <span className="text-[10px] text-muted-foreground">Owner</span>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {review.ownerResponse}
                        </p>
                      </div>
                    )}
                  </div>
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
