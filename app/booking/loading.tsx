export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="bg-[#0c1821] py-12 md:py-16">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="h-4 w-24 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-8 w-80 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      {/* Form skeleton */}
      <div className="container max-w-screen-xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-secondary rounded-2xl animate-pulse" />
          <div className="h-64 bg-secondary rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
