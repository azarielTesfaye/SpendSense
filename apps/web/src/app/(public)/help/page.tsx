import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#111318]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tight text-[#135bec]">
            SpendSense Ethiopia
          </Link>
          <nav className="hidden items-center space-x-8 md:flex">
            <Link className="font-medium text-slate-600 transition-colors hover:text-[#135bec]" href="/about">
              About
            </Link>
            <Link className="border-b-2 border-[#135bec] pb-1 text-base font-bold text-[#135bec]" href="/help">
              Help
            </Link>
            <Link className="font-medium text-slate-600 transition-colors hover:text-[#135bec]" href="/terms">
              Terms
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link className="font-semibold text-slate-600 transition-all hover:text-[#135bec]" href="/login">
              Login
            </Link>
            <Link className="rounded-xl bg-[#135bec] px-5 py-2 font-bold text-white shadow-sm transition-all hover:opacity-90" href="/register">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 py-20">
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#135bec]/5 to-transparent" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-[#111318] md:text-5xl">
              How can we help you today?
            </h1>
            <div className="relative mx-auto max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89]">
                🔍
              </span>
              <input
                className="w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-lg shadow-sm focus:ring-2 focus:ring-[#135bec]"
                placeholder="Search for help articles, guides, or keywords..."
                type="text"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-[#616f89]">
              <span>Popular:</span>
              <button className="transition-colors hover:text-[#135bec]">Reset Password</button>,
              <button className="transition-colors hover:text-[#135bec]">Bank Linking</button>,
              <button className="transition-colors hover:text-[#135bec]">Spending Limits</button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group rounded-xl border border-[#cbd5e1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-2">
              <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e2e6ff] text-[#135bec]">
                    🚀
                  </div>
                  <h2 className="mb-2 text-2xl font-bold">Getting Started</h2>
                  <p className="text-[#616f89]">
                    Everything you need to know to set up your account and start saving.
                  </p>
                </div>
                <span className="hidden text-[#135bec] opacity-0 transition-opacity group-hover:opacity-100 md:block">
                  →
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <li className="cursor-pointer text-[#111318] transition-colors hover:text-[#135bec]">• Creating your first wallet</li>
                <li className="cursor-pointer text-[#111318] transition-colors hover:text-[#135bec]">• Connecting local bank accounts</li>
                <li className="cursor-pointer text-[#111318] transition-colors hover:text-[#135bec]">• Verification process (KYC)</li>
                <li className="cursor-pointer text-[#111318] transition-colors hover:text-[#135bec]">• Security basics</li>
              </ul>
            </div>

            <div className="flex flex-col rounded-xl border border-[#cbd5e1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffdbcf] text-[#902e00]">
                💳
              </div>
              <h2 className="mb-2 text-2xl font-bold">Budgeting</h2>
              <p className="mb-6 text-[#616f89]">
                Learn to track every Birr and reach your financial goals.
              </p>
              <button className="mt-auto flex items-center gap-1 font-bold text-[#135bec] transition-all hover:gap-2">
                View 12 Articles <span>›</span>
              </button>
            </div>

            <div className="rounded-xl border border-[#cbd5e1]/30 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffdad6] text-[#93000a]">
                🛡️
              </div>
              <h2 className="mb-2 text-2xl font-bold">Security</h2>
              <p className="mb-4 text-[#616f89]">
                How we keep your financial data and transactions safe.
              </p>
              <div className="flex flex-col gap-2">
                <div className="rounded-lg bg-[#f0f2f4] p-3 text-sm font-medium">
                  Two-Factor Authentication
                </div>
                <div className="rounded-lg bg-[#f0f2f4] p-3 text-sm font-medium">
                  Reporting Suspicious Activity
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-[#101622] p-8 text-[#f6f6f8] shadow-xl md:col-span-2">
              <div className="relative z-10 flex h-full flex-col">
                <h2 className="mb-4 text-2xl font-bold">Transactions & Reporting</h2>
                <p className="mb-8 max-w-md text-[#dbdfe6]/80">
                  Detailed guides on export logs, recurring payment management, and
                  understanding your monthly smart insights.
                </p>
                <div className="flex gap-4">
                  <button className="rounded-lg bg-[#135bec] px-6 py-2 font-bold text-white transition-all hover:bg-opacity-90">
                    Master Guide
                  </button>
                  <button className="rounded-lg border border-white/20 bg-white/10 px-6 py-2 font-bold text-white transition-all hover:bg-white/20">
                    Download PDF
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-[#135bec]/20 blur-3xl" />
            </div>
          </div>
        </section>

        <section className="bg-[#f0f2f4] py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-extrabold">Frequently Asked Questions</h2>
              <p className="text-[#616f89]">Quick answers to common questions our community asks.</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#cbd5e1]/50 bg-white">
                <div className="flex items-center justify-between p-6">
                  <span className="text-lg font-bold">Which Ethiopian banks are supported?</span>
                  <span className="text-[#135bec]">⌄</span>
                </div>
                <div className="px-6 pb-6 text-[#616f89]">
                  SpendSense supports all major commercial banks in Ethiopia including CBE,
                  Dashen, Awash, Abyssinia, and Hibret. We are constantly adding new partners.
                </div>
              </div>
              <div className="rounded-xl border border-[#cbd5e1]/50 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Is there a monthly subscription fee?</span>
                  <span className="text-[#135bec]">⌄</span>
                </div>
              </div>
              <div className="rounded-xl border border-[#cbd5e1]/50 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">How safe is my banking information?</span>
                  <span className="text-[#135bec]">⌄</span>
                </div>
              </div>
              <div className="rounded-xl border border-[#cbd5e1]/50 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Can I track cash transactions manually?</span>
                  <span className="text-[#135bec]">⌄</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col items-start gap-16 lg:flex-row">
            <div className="lg:w-1/3">
              <h2 className="mb-6 text-3xl font-extrabold">Can&apos;t find what you&apos;re looking for?</h2>
              <p className="mb-8 text-[#616f89]">
                Our support team in Addis Ababa is ready to help. We typically respond
                within 2 hours during business hours.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2e6ff] text-[#135bec]">
                    ✉️
                  </div>
                  <div>
                    <div className="text-sm text-[#616f89]">Email us</div>
                    <div className="font-bold">support@spendsense.et</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2e6ff] text-[#135bec]">
                    ☎️
                  </div>
                  <div>
                    <div className="text-sm text-[#616f89]">Call us</div>
                    <div className="font-bold">+251 911 000 000</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <form className="rounded-2xl border border-[#cbd5e1]/30 bg-white p-8 shadow-sm md:p-12">
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#111318]">Full Name</label>
                    <input className="w-full rounded-xl border-none bg-[#f0f2f4] px-4 py-3 focus:ring-2 focus:ring-[#135bec]" placeholder="Enter your name" type="text" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#111318]">Email Address</label>
                    <input className="w-full rounded-xl border-none bg-[#f0f2f4] px-4 py-3 focus:ring-2 focus:ring-[#135bec]" placeholder="name@company.com" type="email" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-bold text-[#111318]">Subject</label>
                  <select className="w-full appearance-none rounded-xl border-none bg-[#f0f2f4] px-4 py-3 focus:ring-2 focus:ring-[#135bec]">
                    <option>Account Assistance</option>
                    <option>Billing & Payment</option>
                    <option>Bug Report</option>
                    <option>Other Inquiry</option>
                  </select>
                </div>
                <div className="mb-8">
                  <label className="mb-2 block text-sm font-bold text-[#111318]">Message</label>
                  <textarea className="w-full rounded-xl border-none bg-[#f0f2f4] px-4 py-3 focus:ring-2 focus:ring-[#135bec]" placeholder="Tell us how we can help..." rows={4} />
                </div>
                <button className="w-full rounded-xl bg-[#135bec] py-4 text-lg font-bold text-white shadow-lg shadow-[#135bec]/20 transition-all hover:opacity-95" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-[#cbd5e1]/50 bg-[#f6f6f8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row md:px-12">
          <div className="text-lg font-bold text-slate-900">SpendSense Ethiopia</div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="text-sm leading-relaxed text-slate-500 hover:text-[#135bec] hover:underline" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="text-sm leading-relaxed text-slate-500 hover:text-[#135bec] hover:underline" href="/terms">
              Terms of Service
            </Link>
            <button className="text-sm leading-relaxed text-slate-500 hover:text-[#135bec] hover:underline">
              Cookie Policy
            </button>
            <Link className="text-sm leading-relaxed text-slate-500 hover:text-[#135bec] hover:underline" href="/help">
              Contact Support
            </Link>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            © 2024 SpendSense Ethiopia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
