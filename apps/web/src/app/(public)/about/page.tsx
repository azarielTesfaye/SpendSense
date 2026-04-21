import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#111318]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tight text-[#135bec]">
            SpendSense Ethiopia
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="font-bold text-[#135bec]" href="/about">
              About
            </Link>
            <Link className="font-medium text-slate-600 transition-colors hover:text-[#135bec]" href="/help">
              Help
            </Link>
            <Link className="font-medium text-slate-600 transition-colors hover:text-[#135bec]" href="/terms">
              Terms
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="font-semibold text-slate-600 transition-colors hover:text-[#135bec]" href="/login">
              Login
            </Link>
            <Link className="rounded-xl bg-[#135bec] px-5 py-2 font-bold text-white shadow-sm transition-all hover:opacity-90" href="/register">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <section className="grid gap-8 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#135bec]">
              Our Mission
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Pioneering <span className="text-[#135bec]">Financial Clarity</span> for Ethiopia.
            </h1>
            <p className="mt-4 max-w-xl text-[#616f89]">
              We help households and communities make informed day-to-day spending
              decisions by combining cost-of-living trends, budgeting tools, and
              transparent market insights.
            </p>
            <div className="mt-8 border-l-2 border-[#dbdfe6] pl-4 text-sm text-[#616f89]">
              Empowering smarter choices with local financial intelligence.
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
              alt="Finance dashboard display"
              className="h-full min-h-64 w-full object-cover"
            />
          </div>
        </section>

        <section className="py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Our Purpose</h2>
            <p className="mt-2 text-[#616f89]">
              We believe every Ethiopian deserves the power to budget, compare, and save with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm md:col-span-2">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2e6ff] text-[#135bec]">
                📈
              </div>
              <h3 className="text-xl font-bold">Data-Driven Ethiopia</h3>
              <p className="mt-2 text-[#616f89]">
                We aggregate local market intelligence and personal finance signals to
                generate actionable insights for households and communities.
              </p>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="Analytics chart"
                className="mt-4 h-40 w-full rounded-xl object-cover"
              />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2e6ff] text-[#135bec]">
                🔒
              </div>
              <h3 className="text-xl font-bold">Absolute Privacy</h3>
              <p className="mt-2 text-[#616f89]">
                Your data is protected with secure architecture and role-based controls.
              </p>
            </div>
            <div className="rounded-xl bg-[#135bec] p-6 text-white shadow-sm">
              <h3 className="text-xl font-bold">Smart Curation</h3>
              <p className="mt-2 text-white/85">
                Get curated alerts and personalized recommendations based on your spending patterns.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm md:col-span-2">
              <h3 className="text-xl font-bold">Bridging the Currency Gap</h3>
              <p className="mt-2 text-[#616f89]">
                SpendSense helps you compare prices in context and adapt quickly to
                local market fluctuations.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#dbdfe6] py-12">
          <h2 className="mb-6 text-2xl font-extrabold text-[#135bec]">CORE VALUES</h2>
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div>
              <h3 className="font-bold">User-first trust</h3>
              <p className="mt-2 text-[#616f89]">Built around transparency, reliability, and safety.</p>
            </div>
            <div>
              <h3 className="font-bold">Transparency First</h3>
              <p className="mt-2 text-[#616f89]">Clear prices, clear data sources, and clear recommendations.</p>
            </div>
            <div>
              <h3 className="font-bold">Informed Precision</h3>
              <p className="mt-2 text-[#616f89]">Accurate insights that help you make confident decisions.</p>
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-extrabold">
              The Minds Behind <span className="text-[#135bec] italic">SpendSense.</span>
            </h2>
            <span className="text-sm text-[#616f89]">Join the Team →</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <img src="https://api.dicebear.com/9.x/personas/svg?seed=Abebe" alt="Team member one" className="h-56 w-full rounded-lg bg-[#e2e6ff]" />
              <p className="mt-3 font-semibold">Abebe Kebede</p>
              <p className="text-sm text-[#616f89]">Founder & CEO</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <img src="https://api.dicebear.com/9.x/personas/svg?seed=Selamawit" alt="Team member two" className="h-56 w-full rounded-lg bg-[#e2e6ff]" />
              <p className="mt-3 font-semibold">Selamawit Tadesse</p>
              <p className="text-sm text-[#616f89]">Head of Strategy</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <img src="https://api.dicebear.com/9.x/personas/svg?seed=Dawit" alt="Team member three" className="h-56 w-full rounded-lg bg-[#e2e6ff]" />
              <p className="mt-3 font-semibold">Dawit Mengistu</p>
              <p className="text-sm text-[#616f89]">Lead Product Architect</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm md:px-12">
            <h2 className="text-3xl font-extrabold">Ready to see your money differently?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#616f89]">
              Join thousands of Ethiopians managing smarter finances with SpendSense.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="rounded-xl bg-[#135bec] px-5 py-2.5 font-bold text-white">
                Get Started for Free
              </Link>
              <Link href="/help" className="rounded-xl border border-[#cbd5e1] px-5 py-2.5 font-bold text-[#111318]">
                Explore Features
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-[#cbd5e1]/50 bg-[#f6f6f8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row md:px-12">
          <span className="text-lg font-bold text-slate-900">SpendSense Ethiopia</span>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="/terms">
              Terms of Service
            </Link>
            <button className="text-sm text-slate-500 hover:text-[#135bec] hover:underline">
              Cookie Policy
            </button>
            <Link className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="/help">
              Contact Support
            </Link>
          </div>
          <p className="text-sm text-slate-500">© 2024 SpendSense Ethiopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
