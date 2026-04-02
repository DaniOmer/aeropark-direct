export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="bg-[#0c1821] py-16 md:py-20">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="container max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="h-64 bg-secondary rounded-2xl animate-pulse" />
          <div className="h-64 bg-secondary rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
