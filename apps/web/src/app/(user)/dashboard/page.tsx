export const dynamic = "force-dynamic";

import { markNotificationRead } from "@/actions/notifications";
import { apiClient } from "@/lib/api";
import { Button } from "@repo/ui/components/button";
import { Bell, ShoppingBasket, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
  // Fetch budgets, expenses and notifications server-side (send access token from cookie)
  const [budgetsRaw, expensesRaw, notificationsRaw] = (await Promise.all([
    apiClient({ method: "GET", endpoint: "/api/finance/budgets/"}).catch(() => []),
    apiClient({ method: "GET", endpoint: "/api/finance/expenses/"}).catch(() => []),
    apiClient({ method: "GET", endpoint: "/api/users/me/notifications/"}).catch(() => []),
  ])) as [any, any, any];

  const budgets = Array.isArray(budgetsRaw) ? budgetsRaw : budgetsRaw?.results || [];
  const expenses = Array.isArray(expensesRaw) ? expensesRaw : expensesRaw?.results || [];
  const notifications = Array.isArray(notificationsRaw) ? notificationsRaw : notificationsRaw?.results || [];

  // Compute summary similar to client hook
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayOfMonth = Math.max(1, now.getDate());
  const monthExpenses = (Array.isArray(expenses) ? expenses : []).filter((e: any) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const monthlySpent = monthExpenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);
  const dailyAverage = monthlySpent / dayOfMonth;

  const current = (Array.isArray(budgets) ? budgets.find((b: any) => b.month === now.getMonth() + 1 && b.year === now.getFullYear()) : undefined) || (Array.isArray(budgets) ? budgets[0] : null) || null;

  let summary: any = null;
  if (current) {
    try {
      const s = await apiClient<{ total_limit?: number; total_spent?: number; remaining?: number; percent_total_used?: number }>({ method: "GET", endpoint: `/api/finance/budgets/${current.id}/summary/`} );
      const limit = Number(s?.total_limit || 0);
      const spent = Number(s?.total_spent || 0);
      const rem = Number(s?.remaining || 0);
      summary = {
        monthlySpent: spent,
        budgetLimit: limit,
        remaining: rem,
        percentUsed: Number(s.percent_total_used) || (limit > 0 ? (spent / limit) * 100 : 0),
      };
    } catch {
      const limit = Number(current.total_limit || 0);
      const rem = Math.max(0, limit - monthlySpent);
      summary = {
        monthlySpent,
        budgetLimit: limit,
        remaining: rem,
        percentUsed: limit > 0 ? (monthlySpent / limit) * 100 : 0,
      };
    }
  } else {
    summary = { monthlySpent, budgetLimit: 0, remaining: 0, percentUsed: 0 };
  }

  function formatEtb(n: number) {
    return n.toLocaleString("en-ET", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " ETB";
  }

  const formatted = {
    monthly: formatEtb(summary.monthlySpent),
    saved: formatEtb(Math.max(0, summary.remaining)),
    dailyAvg: formatEtb(dailyAverage),
    spentLine: formatEtb(summary.monthlySpent) + " Spent",
    remainLine: formatEtb(Math.max(0, summary.remaining)) + " left",
    barPct: Math.min(100, Math.max(0, Math.round(summary.percentUsed))),
    unreadCount: notifications.filter((n: any) => !n.is_read).length,
  };

  const user = (await apiClient({ method: "GET", endpoint: "/api/users/me/"}).catch(() => null)) as any;

  // Render server-side; use form actions to invoke server action for marking read
  return (
    <div className="min-h-screen ">


      <div className="mx-auto flex w-full ">
        <main className="w-full flex-1">
          <div className="mx-auto flex w-full max-w-350 flex-col gap-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Welcome, {user?.full_name?.split(" ")?.[0] ?? "Abebe"}
                </h2>
                <p className="text-muted-foreground">Here is your financial overview for today.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/budget">Add Expense</Link>
              </Button>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Total Monthly Spending</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-bold tracking-tight">{formatted.monthly}</p>
                  {summary && summary.budgetLimit > 0 && (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      of {summary.budgetLimit.toLocaleString("en-ET")} ETB budget
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Remaining in budget</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-bold tracking-tight">{formatted.saved}</p>
                  {summary && summary.budgetLimit === 0 && (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
                      Set a budget
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Daily average (this month)</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-bold tracking-tight">{formatted.dailyAvg}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-2">
                <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold">Monthly Budget Usage</h3>
                      <p className="text-sm text-muted-foreground">Food, Housing &amp; Transport</p>
                    </div>
                    <span className="text-lg font-bold">
                      {summary ? `${formatted.barPct}%` : "—"}
                    </span>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-primary transition-all"
                      style={{ width: `${summary ? formatted.barPct : 0}%` }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatted.spentLine}</span>
                    <span className="font-semibold">{formatted.remainLine}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold">Staple Food Price Index</h3>
                      <p className="text-sm text-muted-foreground">Tracking Teff, Oil, and Coffee prices</p>
                    </div>
                    <select className="h-9 rounded-lg bg-muted px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Last 30 Days</option>
                      <option>Last 3 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>

                  <div className="mt-6 min-h-56">
                    <svg className="h-56 w-full" viewBox="0 0 478 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 109 C18 109 18 21 36 21 C54 21 54 41 72 41 C90 41 90 93 108 93 C127 93 127 33 145 33 C163 33 163 101 181 101 C199 101 199 61 217 61 C236 61 236 45 254 45 C272 45 272 121 290 121 C308 121 308 149 326 149 C344 149 344 1 363 1 C381 1 381 81 399 81 C417 81 417 129 435 129 C453 129 453 25 472 25 V 150 H 0 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M0 109 C18 109 18 21 36 21 C54 21 54 41 72 41 C90 41 90 93 108 93 C127 93 127 33 145 33 C163 33 163 101 181 101 C199 101 199 61 217 61 C236 61 236 45 254 45 C272 45 272 121 290 121 C308 121 308 149 326 149 C344 149 344 1 363 1 C381 1 381 81 399 81 C417 81 417 129 435 129 C453 129 453 25 472 25"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4 flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <span>Week 1</span>
                      <span>Week 2</span>
                      <span>Week 3</span>
                      <span>Week 4</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-base font-bold">Notifications</h3>
                    <Button variant="link" asChild className="h-auto p-0 text-sm">
                      <Link href="/notifications">View all{formatted.unreadCount ? ` (${formatted.unreadCount} new)` : ""}</Link>
                    </Button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notifications yet. Spending and market alerts will appear here.</p>
                  ) : (
                    <div className="space-y-5">
                      {notifications.map((n: any, i: number) => (
                        <div key={n.id}>
                          {i > 0 && <hr className="mb-5 border-border/60" />}
                          <form action={markNotificationRead} className="w-full">
                            <button name="id" value={String(n.id)} type="submit" className="w-full text-left">
                              <div className="flex gap-4">
                                <div
                                  className={`flex size-10 items-center justify-center rounded-full ${
                                    n.type?.includes("price") || n.type?.includes("market")
                                      ? "bg-rose-50 text-rose-600"
                                      : n.type?.includes("budget")
                                        ? "bg-primary/10 text-primary"
                                        : "bg-emerald-50 text-emerald-600"
                                  }`}
                                >
                                  {n.type?.includes("price") || n.type?.includes("market") ? (
                                    <TrendingUp className="size-5" />
                                  ) : n.type?.includes("budget") ? (
                                    <Bell className="size-5" />
                                  ) : (
                                    <ShoppingBasket className="size-5" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold capitalize">
                                    {n.type?.replaceAll("_", " ") ?? "Update"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{n.message}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                                  </p>
                                </div>
                                {!n.is_read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                              </div>
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
