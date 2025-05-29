import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  campaigns: CampaignSummary[];
}

export interface CampaignSummary {
  id: number;
  name: string;
  target_amount: number;
  collected_amount: number;
  status: string;
}

export const fetchOwnProfile = () => api.get<Profile>("/profile");

export const fetchProfileById = (id: number) =>
  api.get<Profile>(`/profile/${id}`);

export const saveProfile = (body: Partial<Profile>) =>
  api.put("/profile", body);

export function useProfile(id?: number) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = id
        ? await fetchProfileById(id)
        : await fetchOwnProfile();
      setProfile(data);
      setError(null);
    } catch (e: unknown) {
      const err = e as { response?: { data?: string } };
      setError(err?.response?.data ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    profile,
    loading,
    error,
    refetch: load,
  };
}
