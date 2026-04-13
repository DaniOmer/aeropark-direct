import React from "react";

const featuredReview = {
  name: "Marie L.",
  initials: "ML",
  date: "Avril 2025",
  text: "Service impeccable ! J'ai laissé ma voiture pendant une semaine, tout s'est très bien passé. La navette était ponctuelle et le personnel très aimable. Je recommande vivement.",
};

const reviews = [
  {
    name: "Thomas B.",
    initials: "TB",
    date: "Mars 2025",
    text: "Très pratique et économique. La navette gratuite est un vrai plus. J'y retournerai sans hésiter.",
    gradient: "from-teal-500 to-teal-600",
  },
  {
    name: "Sophie M.",
    initials: "SM",
    date: "Février 2025",
    text: "Parfait pour partir tranquille. Tarif compétitif, parking bien surveillé. Rien à redire !",
    gradient: "from-teal-600 to-cyan-700",
  },
];

function Stars({ size = "small" }: { size?: "small" | "large" }) {
  const cls = size === "large" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          xmlns="http://www.w3.org/2000/svg"
          className={cls}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
              Témoignages
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Ce que disent nos clients
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-extrabold text-foreground">5/5</span>
            <div>
              <Stars size="small" />
              <p className="text-xs text-muted-foreground mt-0.5">
                +200 avis
              </p>
            </div>
          </div>
        </div>

        {/* Reviews grid: featured + 2 stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
          {/* Featured review — dark */}
          <div className="bg-[#0c1821] rounded-2xl p-7 text-white flex flex-col justify-between">
            <div>
              <Stars size="large" />
              <p className="text-sm md:text-base leading-relaxed text-white/85 italic mt-4">
                &ldquo;{featuredReview.text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {featuredReview.initials}
              </div>
              <div>
                <p className="text-sm font-semibold">{featuredReview.name}</p>
                <p className="text-xs text-white/40">{featuredReview.date}</p>
              </div>
            </div>
          </div>

          {/* 2 smaller reviews stacked */}
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-secondary rounded-2xl p-5 flex-1"
              >
                <Stars size="small" />
                <p className="text-sm text-card-foreground/80 italic leading-relaxed mt-3 mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${review.gradient} rounded-full flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <button className="text-primary text-sm font-semibold px-6 py-2.5 border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
            Voir tous les avis
          </button>
        </div>
      </div>
    </section>
  );
}
