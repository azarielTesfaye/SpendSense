export default function LandingPage() {
  return (
    <div className="bg-[#f6f6f8] text-[#111318] selection:bg-[#e2e6ff] selection:text-[#00174c]">
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
          <div className="text-xl font-black tracking-tight text-[#135bec]">
            SpendSense Ethiopia
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              className="font-medium text-slate-600 transition-colors duration-200 hover:text-[#135bec]"
              href="#"
            >
              About
            </a>
            <a
              className="font-medium text-slate-600 transition-colors duration-200 hover:text-[#135bec]"
              href="#"
            >
              Help
            </a>
            <a
              className="font-medium text-slate-600 transition-colors duration-200 hover:text-[#135bec]"
              href="#"
            >
              Terms
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 font-medium text-slate-600 transition-all hover:text-[#135bec]">
              Login
            </button>
            <button className="rounded-xl bg-[#135bec] px-6 py-2 font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">
              Register
            </button>
          </div>
        </nav>
      </header>
      <main>
        <section className="relative overflow-hidden pb-32 pt-20">
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:px-12">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#e2e6ff] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00174c]">
              <span aria-hidden="true" className="text-sm">
                ✦
              </span>
              Fintech Excellence in Ethiopia
            </div>
            <h1 className="mb-8 max-w-4xl text-5xl leading-[1.1] font-extrabold tracking-tight md:text-7xl">
              Master your money in <span className="text-[#135bec]">Ethiopia</span>
            </h1>
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-[#616f89] md:text-xl">
              A high-end editorial approach to personal finance. Track local
              market trends, set smart budget limits, and curate your financial
              journey with clinical precision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#135bec] px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-[0_0_30px_rgba(19,91,236,0.2)]">
                Get Started
                <span aria-hidden="true">→</span>
              </button>
              <button className="rounded-xl border border-[#cbd5e1] bg-white px-10 py-4 text-lg font-bold text-[#111318] transition-all hover:bg-[#f0f2f4]">
                View Demo
              </button>
            </div>
            <div className="relative mt-20 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-[#cbd5e14d] bg-white shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-[#135bec0d] to-transparent" />
              <img
                alt="Dashboard Preview"
                className="h-full w-full object-cover opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo9zb7Rdg-Zhkt-IICdiFJQWxWXsOp6rP1HYiyrSKRICEBp2pPHyfdgIY9SqGpzvHy0qd8vYPNDZi0qEQa1Q28rlnMw6njPrfwfXPp6Me81tIMIn0INeCYEPoHlZCH58ojDbs2zact0S745ya11ph9roRxGPb81EuwAZSSFZa9E-fNaTBgS2j34ZojkF9MX9jelP62tFRbyrlc3yX_26HdHs0FDiOoRylGjiYSKfZoUpqvDWQCIuCJeiG3WIt9AmWMbYXNBGYBcNA"
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 h-125 w-125 translate-x-1/4 -translate-y-1/2 rounded-full bg-[#135bec1a] opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-150 w-150 -translate-x-1/4 translate-y-1/4 rounded-full bg-[#485c9a1a] opacity-50 blur-3xl" />
        </section>
        <section className="bg-[#f6f6f8] py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mb-16">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                The Informed Curator&apos;s Toolkit
              </h2>
              <p className="max-w-xl text-[#616f89]">
                Everything you need to navigate the evolving financial landscape
                of Ethiopia with confidence and clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white p-8 shadow-sm md:col-span-8">
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e2e6ff] text-[#135bec]">
                    <span aria-hidden="true" className="text-xl">
                      💼
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Advanced Cost Tracking</h3>
                  <p className="max-w-md text-[#616f89]">
                    Categorize every transaction across local banks and digital
                    wallets. Gain a unified view of your net worth in real-time.
                  </p>
                </div>
                <div className="mt-12 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                  <img
                    alt="Spending Analysis"
                    className="rounded-xl border border-[#cbd5e180] shadow-xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtEnwEKmkPZaCbVgGjk0sRUxlhfE6t4-YLajItgK21ZoM_l7wyh2TBKpro3KFZOlrCHmYDJDcSIyRcrgNxliL3AIvNhwpZj45WAWWVMgXgt5s75yPno8mMEThaxrpOgSnQAynBbVCGtlrhipN_ruP9KZn0OVXMv97V3er5NVHgKw44pbxFE0ViGe8I9Y7fqyojg56YeoPLNRoukoXYYSzZRRZRFjTM-AtlOBmCelfWeRGX-OCft0JmCf1rjdfBjnoRZ-ZQEaaDyyc"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl bg-[#135bec] p-8 text-white shadow-sm md:col-span-4">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white">
                    <span aria-hidden="true" className="text-xl">
                      ↗
                    </span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Market Insights</h3>
                  <p className="text-white/80">
                    Stay ahead with localized inflation data and commodity price
                    tracking tailored for the Ethiopian market.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
                      ETB Market Pulse
                    </span>
                    <span className="rounded bg-white/20 px-2 py-1 text-xs font-bold">
                      +12.4%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 bg-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-[#e5e7eb] p-8 md:col-span-4">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#135bec]">
                  <span aria-hidden="true" className="text-xl">
                    🔔
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold">Precision Budgeting</h3>
                <p className="text-[#616f89]">
                  Set hard limits for specific categories like dining, fuel, and
                  utilities. Get notified before you overspend.
                </p>
              </div>
              <div className="flex items-center gap-8 rounded-xl border border-[#cbd5e14d] bg-white p-8 shadow-sm md:col-span-8">
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-bold">Smart Savings Goals</h3>
                  <p className="text-[#616f89]">
                    Automated rounding and recurring transfers designed for the
                    way you earn and spend in Ethiopia.
                  </p>
                </div>
                <div className="hidden h-40 w-40 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#135bec] to-[#485c9a] text-white sm:flex">
                  <span aria-hidden="true" className="text-6xl">
                    ₿
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
            <h2 className="mb-16 text-4xl font-bold tracking-tight">
              Three Steps to Financial Sovereignty
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="group relative">
                <div className="relative mb-8 inline-block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f0f2f4] text-[#135bec] transition-transform duration-300 group-hover:scale-110">
                    <span aria-hidden="true" className="text-4xl">
                      ↔
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#135bec] text-sm font-bold text-white">
                    1
                  </div>
                </div>
                <h4 className="mb-4 text-xl font-bold">Connect Assets</h4>
                <p className="text-[#616f89]">
                  Securely link your Ethiopian bank accounts, Telebirr, or CBE
                  Birr wallets in minutes.
                </p>
              </div>
              <div className="group relative">
                <div className="relative mb-8 inline-block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f0f2f4] text-[#135bec] transition-transform duration-300 group-hover:scale-110">
                    <span aria-hidden="true" className="text-4xl">
                      📊
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#135bec] text-sm font-bold text-white">
                    2
                  </div>
                </div>
                <h4 className="mb-4 text-xl font-bold">Analyze Trends</h4>
                <p className="text-[#616f89]">
                  Our AI categorizes your spending habits and benchmarks them
                  against local market shifts.
                </p>
              </div>
              <div className="group relative">
                <div className="relative mb-8 inline-block">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f0f2f4] text-[#135bec] transition-transform duration-300 group-hover:scale-110">
                    <span aria-hidden="true" className="text-4xl">
                      ✓
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#135bec] text-sm font-bold text-white">
                    3
                  </div>
                </div>
                <h4 className="mb-4 text-xl font-bold">Master Growth</h4>
                <p className="text-[#616f89]">
                  Execute data-driven decisions to grow your wealth using
                  localized financial journals.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-12 text-center md:p-20">
              <div className="absolute inset-0 opacity-20">
                <img
                  alt="Abstract Background"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3BJxyqx7bTaPeni6dcIT_anB5DSNGzY_5ksqcM9KSqdujAmExbUABxAR_KyBhTFNHHQk3lterxUrxHtesGBcsCyRA921I2BPh9iWYylA2W2Yod_ccQdvfHhlFclaN9I_0AyXMEHWicT6sbkPmiYM-RRZt77L3sS-_FAY9o_Fb8MygRPjfRWAzgssDJ-9p_zTJqJJ5NnbOTe-p_FtMkJJvKpfXgVpn0zowNzrmvQCt9gjuuNFds8lHMUyv_oqRLupj_Zpmu4NcrqI"
                />
              </div>
              <div className="relative z-10">
                <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
                  Ready to curate your wealth?
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
                  Join thousands of Ethiopian professionals who are using
                  SpendSense to simplify their financial lives.
                </p>
                <button className="rounded-xl bg-[#135bec] px-10 py-4 text-lg font-bold text-white transition-all hover:shadow-xl hover:shadow-[#135bec4d] active:scale-95">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-auto w-full border-t border-[#cbd5e180] bg-[#f6f6f8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row md:px-12">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="text-lg font-bold text-slate-900">
              SpendSense Ethiopia
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              © 2024 SpendSense Ethiopia. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="#">
              Cookie Policy
            </a>
            <a className="text-sm text-slate-500 hover:text-[#135bec] hover:underline" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
