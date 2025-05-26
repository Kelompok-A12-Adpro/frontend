"use client";

import React, { useState, useEffect, useCallback } from "react";
import CampaignCard from "@/components/organisms/CampaignCard";
import CreateCampaignForm from "@/components/organisms/CampaignForm";
import type { Campaign, CreateCampaignRequest } from "@/types";
import { serviceApi } from "@/libs/axios/api";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showMine, setShowMine] = useState<boolean>(false);

  // Campaign Service Functions
  const getAllCampaigns = async (): Promise<Campaign[]> => {
    const response = await serviceApi.get("/campaigns");
    return response.data;
  };

  const getUserCampaigns = async () => {
    const token = localStorage.getItem("token");
    const res = await serviceApi.get("/campaigns/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Campaign[];
  };

  const createCampaign = async (
    data: CreateCampaignRequest,
  ): Promise<Campaign> => {
    const payload = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
    };
    const response = await serviceApi.post("/campaigns", payload);
    return response.data;
  };

  // Fix: Use useCallback to prevent unnecessary re-renders
  const loadCampaigns = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const data = showMine
        ? await getUserCampaigns()
        : await getAllCampaigns();
      console.log("Campaigns loaded:", data);
      setCampaigns(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load campaigns: ${msg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showMine]); // Add showMine as dependency

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]); // Fix: Include loadCampaigns in dependency

  // render
  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading…</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kampanye</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowMine(false)}
            className={`px-4 py-2 rounded ${!showMine ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Semua Kampanye
          </button>
          <button
            onClick={() => setShowMine(true)}
            className={`px-4 py-2 rounded ${showMine ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Kampanye Saya
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Buat Kampanye
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}{" "}
          <button onClick={loadCampaigns} className="underline">
            Coba lagi
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <CreateCampaignForm
            onSubmit={async (data) => {
              setCreateLoading(true);
              try {
                const newCamp = await createCampaign(data);
                setCampaigns((prev) => [newCamp, ...prev]);
                setShowForm(false);
              } catch (error) {
                // Fix: Remove unused variable 'e', use 'error'
                console.error("Failed to create campaign:", error);
                alert("Gagal membuat kampanye");
              } finally {
                setCreateLoading(false);
              }
            }}
            onCancel={() => setShowForm(false)}
            isLoading={createLoading}
          />
        </div>
      )}

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {showMine
            ? "Kamu belum membuat kampanye apapun."
            : "Belum ada kampanye yang tersedia."}
        </div>
      )}
    </div>
  );
}
