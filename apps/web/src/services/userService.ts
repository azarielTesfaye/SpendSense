import { createApiClient } from "./apiClient";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: "user" | "vendor" | "admin";
  city?: string | null;
  household_size?: number | null;
  income_bracket?: string | null;
  notification_preferences?: unknown;
  onboarding_completed?: boolean;
  created_at?: string;
};

export async function getCurrentUser(accessToken: string): Promise<UserProfile> {
  const api = createApiClient(() => accessToken);
  const { data } = await api.get<UserProfile>("/api/users/me/");
  return data;
}

