export const dynamic = "force-dynamic";

import AdminPanelShell from "../_components/admin-panel-shell";
import { apiClient, ApiError } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import UsersControlsClient from "./UsersControlsClient";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import type { UserProfile } from "@/lib/auth-types";
import type { PaginatedResponse } from "@/lib/types/pagination";
import UsersPaginationClient from "./UsersPaginationClient";

async function fetchUsers(search?: string, page = 1, pageSize = 20): Promise<PaginatedResponse<UserProfile>> {
	const query: Record<string, string | number> = {};
	if (search && search.trim().length > 0) query.search = search.trim();
	query.page = page;
	query.pageSize = pageSize;

	return await apiClient<PaginatedResponse<UserProfile>>({
		method: "GET",
		endpoint: "/api/users/admin/users/",
		query,
	});
}

function UsersTableSkeleton() {
	return (
		<div className="p-6">
			<div className="space-y-4">
				<div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
				<div className="overflow-hidden rounded-md border border-slate-100">
					<div className="p-4">
						<div className="space-y-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex-1">
										<div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
										<div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-200" />
									</div>
									<div className="ml-4 h-3 w-20 animate-pulse rounded bg-slate-200" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

async function UsersTable({ search, page, pageSize }: { search?: string; page?: number; pageSize?: number }) {
	let data: PaginatedResponse<UserProfile> | null = null;
	let errorMessage: string | null = null;
	try {
		data = await fetchUsers(search, page ?? 1, pageSize ?? 20);
	} catch (err) {
		console.error("Failed to load users", err);
		errorMessage = err instanceof Error ? err.message : String(err ?? "Unknown error");
	}

	if (errorMessage) {
		return (
			<div className="p-6">
				<div className="rounded-md bg-red-50 p-4">
					<p className="text-sm font-medium text-red-800">Failed to load users</p>
					<p className="mt-1 text-sm text-red-700">{errorMessage}</p>
				</div>
			</div>
		);
	}

	if (!data || (Array.isArray(data.results) && data.results.length === 0)) {
		return <UsersTableSkeleton />;
	}

	const users = data.results;
	const pagination = data.pagination;

	return (
		<section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
			<div className="border-b border-slate-100 p-6 flex items-center justify-between">
				<h3 className="text-lg font-bold">Users Directory</h3>
			</div>
			<div className="overflow-auto">
				<table className="w-full text-left">
					<thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
						<tr>
							<th className="px-6 py-4">User Profile</th>
							<th className="px-6 py-4">Role</th>
							<th className="px-6 py-4">Status</th>
							<th className="px-6 py-4">Join Date</th>
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-sm">
						{users.map((user) => (
							<tr key={user.id} className="hover:bg-slate-50">
								<td className="px-6 py-4">
									<p className="font-bold text-slate-900">{user.full_name}</p>
									<p className="text-xs text-slate-500">{user.email}</p>
								</td>
								<td className="px-6 py-4">{user.role}</td>
								<td className="px-6 py-4">
									<span className="rounded-full px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700">Active</span>
								</td>
								<td className="px-6 py-4 text-slate-500">{user.created_at?.slice(0, 10) ?? "—"}</td>
								<td className="px-6 py-4 text-right">
									<form id={`suspend-form-${user.id}`} action={async (formData: FormData) => {
										"use server";
										const id = String(formData.get("userId"));
										try {
											await apiClient<UserProfile>({
												method: "PATCH",
												endpoint: `/api/admin/users/${id}/`,
												body: { suspended: true },
											});
											revalidatePath("/admin/users");
										} catch (e) {
											console.error("Failed to suspend user", e);
										}
									}}>
										<input type="hidden" name="userId" value={user.id} />
										<ConfirmSubmitButton formId={`suspend-form-${user.id}`} />
									</form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="p-4">
					<div className="text-sm text-slate-600">Total: {pagination.total_records}</div>
				</div>
				{/* client-side prev/next below table */}
				{/* @ts-expect-error Client component */}
				<UsersPaginationClient page={pagination.current_page} pageSize={pagination.page_size} totalPages={pagination.total_pages} search={search} />
			</div>
		</section>
	);
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminPanelUsersPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {	
	const sp = await searchParams;
  // const key = JSON.stringify(sp);
	console.log(sp)
	const rawSearch = Array.isArray(sp?.search) ? sp?.search[0] : (sp?.search as string | undefined);
	const page = Number(Array.isArray(sp?.page) ? sp?.page[0] : (sp?.page as string | undefined)) || 1;
	const pageSize = Number(Array.isArray(sp?.pageSize) ? sp?.pageSize[0] : (sp?.pageSize as string | undefined)) || 20;

	return (
		<AdminPanelShell activeTab="users" subtitle="Manage permissions, monitor activity, and moderate user access." title="Platform Users">
			<section className="grid grid-cols-1 gap-6 md:grid-cols-4">
				<Tile label="Total Users" value="—" />
				<Tile label="Active Shoppers" value="—" />
				<Tile label="Active Vendors" value="—" />
				<Tile label="Suspended" value="—" />
			</section>

			<div className="mt-6">
				<UsersControlsClient />
			</div>

			<Suspense fallback={<UsersTableSkeleton />}>
				{/* Server component fetches according to current search params */}
				<UsersTable search={rawSearch} page={page} pageSize={pageSize} />
			</Suspense>
		</AdminPanelShell>
	);
}

function Tile({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-white p-6 shadow-sm">
			<p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
			<p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-4">
			<div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
			<div className="overflow-hidden rounded-md border border-slate-100">
				<div className="p-4">
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="flex-1">
									<div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
									<div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-200" />
								</div>
								<div className="ml-4 h-3 w-20 animate-pulse rounded bg-slate-200" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
