import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#111318]">
      <header className="sticky top-0 z-50 border-b border-[#dbdfe6] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="text-xl font-black tracking-tight text-[#135bec]">
            SpendSense Ethiopia
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#616f89]">Step 1 of 3</span>
            <button className="text-sm font-bold text-[#135bec] transition-opacity hover:opacity-80">
              Save & Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center px-4 pb-24 pt-12">
        <div className="mb-12 flex items-center gap-3">
          <div className="h-2 w-12 rounded-full bg-[#135bec]" />
          <div className="h-2 w-8 rounded-full bg-[#e5e7eb]" />
          <div className="h-2 w-8 rounded-full bg-[#e5e7eb]" />
        </div>

        <div className="w-full max-w-2xl">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[#111318]">
                Welcome to SpendSense
              </h1>
              <p className="mx-auto max-w-md text-[#616f89]">
                Tell us where you are to help us track the most relevant market prices
                for your area.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2e6ff] text-[#135bec]">
                    🏙️
                  </div>
                  <span className="text-lg font-bold">City</span>
                </div>
                <div className="relative">
                  <select className="h-12 w-full appearance-none rounded-lg border-none bg-[#f0f2f4] px-4 font-medium text-[#111318] focus:ring-2 focus:ring-[#135bec]">
                    <option>Addis Ababa</option>
                    <option>Dire Dawa</option>
                    <option>Adama</option>
                    <option>Gondar</option>
                    <option>Bahir Dar</option>
                    <option>Hawassa</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-3 text-[#616f89]">
                    ⌄
                  </span>
                </div>
              </div>

              <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e2e6ff] text-[#135bec]">
                    🗺️
                  </div>
                  <span className="text-lg font-bold">District (Sub-City)</span>
                </div>
                <div className="relative">
                  <select className="h-12 w-full appearance-none rounded-lg border-none bg-[#f0f2f4] px-4 font-medium text-[#111318] focus:ring-2 focus:ring-[#135bec]">
                    <option>Bole</option>
                    <option>Arada</option>
                    <option>Kirkos</option>
                    <option>Nifas Silk-Lafto</option>
                    <option>Yeka</option>
                    <option>Kolfe Keranio</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-3 text-[#616f89]">
                    ⌄
                  </span>
                </div>
              </div>

              <div className="group relative h-64 overflow-hidden rounded-xl shadow-sm md:col-span-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuACDZ0aAwE2afgv36PpQQ-wdcIpX_F9p5DMOQm1M35rieuSNUtA8EgtnMsEy6pmm7_NvLRYKHKbIqfYjc_TKOG8CNagpWLqLvv98SqeP1T3mTF3cratApjL8WjoSHOyMjAUtmiDz5d3K4PwtSvmCLGrye7SLip3TR5KC_Mm2kRAdFAPc4EX64qWxGpPXUxYBC-Jh98qlqkF3mZu8dRb2s4LUQw15Ck80TMyXGlzPCjynk5i9NtH2OF304I4m-aMtE0lxQCaK8N-b9E"
                  alt="City map preview"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white">
                  <span>◎</span>
                  <span className="text-sm font-semibold">
                    Live tracking available for this region
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-8 md:flex-row">
            <Link
              href="/dashboard"
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#135bec] font-bold text-white shadow-sm transition-all hover:opacity-90"
            >
              Next: Preferences <span>→</span>
            </Link>
            <button className="h-14 flex-1 rounded-xl bg-[#e5e7eb] font-bold text-[#111318] transition-colors hover:bg-[#dbdfe6]">
              Skip for now
            </button>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-6 opacity-70 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl border border-[#cbd5e1] p-4">
              <span className="text-[#135bec]">🔔</span>
              <div className="space-y-1">
                <p className="text-sm font-bold">Step 2: Alert Preferences</p>
                <p className="text-xs text-[#616f89]">
                  Choose how you want to be notified about price spikes and budget
                  limits.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-[#cbd5e1] p-4">
              <span className="text-[#135bec]">✅</span>
              <div className="space-y-1">
                <p className="text-sm font-bold">Step 3: Finish</p>
                <p className="text-xs text-[#616f89]">
                  Review your settings and start your personalized savings journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-[#cbd5e1]/50 bg-[#f6f6f8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row md:px-12">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-lg font-bold text-slate-900">SpendSense Ethiopia</span>
            <span className="text-sm leading-relaxed text-slate-500">
              © 2024 SpendSense Ethiopia. All rights reserved.
            </span>
          </div>
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
        </div>
      </div>
    </div>
  );
}
