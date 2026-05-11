export default function Loading() {
  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-10">
        <div className="rounded-3xl border border-luxury-gold/20 bg-white p-8 shadow-sm">
          <div className="h-4 w-32 rounded bg-luxury-champagne/70" />
          <div className="mt-4 h-10 w-2/3 rounded bg-luxury-champagne/70" />
          <div className="mt-4 h-4 w-full rounded bg-luxury-champagne/60" />
          <div className="mt-2 h-4 w-4/5 rounded bg-luxury-champagne/60" />
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 shadow-sm">
              <div className="h-8 w-48 rounded bg-luxury-champagne/70" />
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-2xl bg-luxury-champagne/50"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 shadow-sm">
              <div className="h-8 w-56 rounded bg-luxury-champagne/70" />
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 rounded-2xl bg-luxury-champagne/50"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 shadow-sm">
              <div className="h-8 w-44 rounded bg-luxury-champagne/70" />
              <div className="mt-5 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 rounded-xl bg-luxury-champagne/50"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 shadow-sm">
            <div className="h-8 w-40 rounded bg-luxury-champagne/70" />
            <div className="mt-5 space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 h-4 w-4 rounded-full bg-luxury-champagne/70" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 rounded bg-luxury-champagne/60" />
                    <div className="h-4 w-full rounded bg-luxury-champagne/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-luxury-gold/20 bg-white p-6 shadow-sm">
          <div className="h-8 w-52 rounded bg-luxury-champagne/70" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-luxury-champagne/50"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}