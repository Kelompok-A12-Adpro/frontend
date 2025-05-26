"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Plus, Filter, Heart, Target } from "lucide-react";
import Navbar from "@/components/organisms/Navbar";
import CampaignCard from "@/components/organisms/CampaignCard";
import CreateCampaignForm from "@/components/organisms/CampaignForm";
import UpdateCampaignForm from "@/components/organisms/UpdateCampaignForm";
import { serviceApi } from "@/libs/axios/api";
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from "@/types";
import { CampaignStatus } from "@/types";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showMine, setShowMine] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "All">(
    "All",
  );

  // Edit functionality states
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  // Delete functionality states
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Fetch all campaigns (public)
  const fetchCampaigns = useCallback(async () => {
    const response = await serviceApi.get("/campaigns");
    setCampaigns(response.data || []);
  }, []);

  // Fetch user campaigns (authenticated)
  const fetchUserCampaigns = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserCampaigns([]);
        return;
      }

      // Try /campaigns/me first
      const response = await serviceApi.get("/campaigns/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUserCampaigns(response.data || []);
    } catch {
      // return empty array if error occurs
      setUserCampaigns([]);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Always fetch public campaigns
        await fetchCampaigns();

        // Fetch user campaigns if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
          await fetchUserCampaigns();
        }
      } catch {
        setError("Gagal memuat data kampanye");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchCampaigns, fetchUserCampaigns]);

  // Create campaign with better error handling
  const handleCreateCampaign = useCallback(
    async (data: CreateCampaignRequest) => {
      setCreateLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        // Format dates properly to ISO string
        const payload = {
          name: data.name.trim(),
          description: data.description.trim(),
          target_amount: Number(data.target_amount),
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.end_date).toISOString(),
          image_url: data.image_url?.trim() || "",
        };

        const response = await serviceApi.post("/campaigns", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Refresh both campaign lists
        await Promise.all([fetchCampaigns(), fetchUserCampaigns()]);
        setShowForm(false);

        // Show success message
        alert("Kampanye berhasil dibuat!");

        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setCreateLoading(false);
      }
    },
    [fetchCampaigns, fetchUserCampaigns],
  );

  // Update campaign
  const handleUpdateCampaign = useCallback(
    async (id: string, data: UpdateCampaignRequest) => {
      setUpdateLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        const payload: Partial<UpdateCampaignRequest> = { ...data };

        // Convert end_date to ISO string if provided
        if (data.end_date) {
          payload.end_date = new Date(data.end_date).toISOString();
        }

        const response = await serviceApi.put(`/campaigns/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await Promise.all([fetchCampaigns(), fetchUserCampaigns()]);
        setEditingCampaign(null);
        alert("Kampanye berhasil diupdate!");

        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setUpdateLoading(false);
      }
    },
    [fetchCampaigns, fetchUserCampaigns],
  );

  // Delete campaign
  const confirmDeleteCampaign = useCallback(async () => {
    if (!deletingCampaign) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      await serviceApi.delete(`/campaigns/${deletingCampaign.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Promise.all([fetchCampaigns(), fetchUserCampaigns()]);
      setDeletingCampaign(null);
      alert("Kampanye berhasil dihapus!");
    } catch (error) {
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  }, [deletingCampaign, fetchCampaigns, fetchUserCampaigns]);

  // Filter campaigns based on status
  const getFilteredUserCampaigns = useCallback(() => {
    if (statusFilter === "All") return userCampaigns;
    return userCampaigns.filter((campaign) => campaign.status === statusFilter);
  }, [userCampaigns, statusFilter]);

  // Get campaign count by status
  const getStatusCount = useCallback(
    (status: CampaignStatus | "All") => {
      if (status === "All") return userCampaigns.length;
      return userCampaigns.filter((campaign) => campaign.status === status)
        .length;
    },
    [userCampaigns],
  );

  // Get campaigns to display
  const displayCampaigns = showMine ? getFilteredUserCampaigns() : campaigns;

  // Handle edit campaign
  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowForm(false); // Close create form if open
  };

  // Handle delete campaign
  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
  };

  if (loading && campaigns.length === 0 && userCampaigns.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Memuat kampanye...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-black">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                <span>Galang Dana untuk Kebaikan</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {showMine ? "Kampanye Saya" : "Jelajahi Kampanye"}
              </h1>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                {showMine
                  ? "Kelola dan pantau perkembangan kampanye yang telah Anda buat"
                  : "Temukan kampanye yang bermakna dan dukung perubahan positif di sekitar Anda"}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Navigation & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* View Toggle */}
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-neutral-200">
              <button
                onClick={() => setShowMine(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !showMine
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Target className="w-4 h-4 inline-block mr-2" />
                Semua Kampanye ({campaigns.length})
              </button>
              <button
                onClick={() => setShowMine(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showMine
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                <Heart className="w-4 h-4 inline-block mr-2" />
                Kampanye Saya ({userCampaigns.length})
              </button>
            </div>

            {/* Create Campaign Button */}
            <button
              onClick={() => {
                setShowForm(true);
                setEditingCampaign(null);
                setError(""); // Clear any previous errors
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Buat Kampanye Baru</span>
            </button>
          </div>

          {/* Status Filter - Only show when viewing user campaigns */}
          {showMine && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Filter className="w-5 h-5 text-neutral-600" />
                <h3 className="text-lg font-semibold text-neutral-800">
                  Filter Status Kampanye
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === "All"
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  Semua ({getStatusCount("All")})
                </button>
                <button
                  onClick={() =>
                    setStatusFilter(CampaignStatus.PendingVerification)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === CampaignStatus.PendingVerification
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  Menunggu Verifikasi (
                  {getStatusCount(CampaignStatus.PendingVerification)})
                </button>
                <button
                  onClick={() => setStatusFilter(CampaignStatus.Active)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === CampaignStatus.Active
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  Aktif ({getStatusCount(CampaignStatus.Active)})
                </button>
                <button
                  onClick={() => setStatusFilter(CampaignStatus.Completed)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === CampaignStatus.Completed
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  Selesai ({getStatusCount(CampaignStatus.Completed)})
                </button>
                <button
                  onClick={() => setStatusFilter(CampaignStatus.Rejected)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    statusFilter === CampaignStatus.Rejected
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  Ditolak ({getStatusCount(CampaignStatus.Rejected)})
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={() => setError("")}
                    className="text-rose-600 hover:text-rose-800 underline text-sm mt-1"
                  >
                    Tutup pesan error
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Forms */}
          {showForm && (
            <div className="mb-8">
              <CreateCampaignForm
                onSubmit={handleCreateCampaign}
                onCancel={() => {
                  setShowForm(false);
                  setError(""); // Clear errors when canceling
                }}
                isLoading={createLoading}
              />
            </div>
          )}

          {editingCampaign && (
            <div className="mb-8">
              <UpdateCampaignForm
                campaign={editingCampaign}
                onSubmit={(data) =>
                  handleUpdateCampaign(editingCampaign.id.toString(), data)
                }
                onCancel={() => setEditingCampaign(null)}
                isLoading={updateLoading}
              />
            </div>
          )}

          {/* Campaigns Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Memuat kampanye...</p>
            </div>
          ) : displayCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCampaigns.map((camp) => (
                <CampaignCard
                  key={camp.id}
                  campaign={camp}
                  showActionButtons={showMine}
                  onEdit={handleEditCampaign}
                  onDelete={handleDeleteCampaign}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {showMine ? (
                    <Heart className="w-8 h-8 text-primary-600" />
                  ) : (
                    <Target className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {showMine
                    ? "Belum Ada Kampanye"
                    : "Belum Ada Kampanye Tersedia"}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {showMine
                    ? statusFilter === "All"
                      ? "Anda belum membuat kampanye apapun. Mulai galang dana untuk tujuan mulia Anda!"
                      : `Anda belum memiliki kampanye dengan status "${statusFilter}".`
                    : "Belum ada kampanye yang tersedia saat ini. Periksa kembali nanti."}
                </p>
                {showMine && statusFilter === "All" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Buat Kampanye Pertama</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingCampaign && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white">
                    Konfirmasi Hapus Kampanye
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    Apakah Anda yakin ingin menghapus kampanye &quot;
                    {deletingCampaign.name}&quot;? Tindakan ini tidak dapat
                    dibatalkan.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeletingCampaign(null)}
                      className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900 rounded-xl font-medium transition-all duration-200"
                      disabled={deleteLoading}
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmDeleteCampaign}
                      className="flex-1 px-4 py-2 text-white bg-rose-500 hover:bg-rose-600 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
