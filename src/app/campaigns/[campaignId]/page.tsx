"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Heart,
  Users,
} from "lucide-react";
import Navbar from "@/components/organisms/Navbar";
import DonationForm from "@/components/organisms/DonationForm";
import { serviceApi } from "@/libs/axios/api";
import type { Campaign } from "@/types";

export default function CampaignDetailPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId as string;
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch campaign details
  const fetchCampaignDetail = useCallback(
    async (id: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await serviceApi.get(`/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data as Campaign;
      } catch (error) {
        throw error;
      }
    },
    [router],
  );

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError("");
        const campaignData = await fetchCampaignDetail(campaignId);
        setCampaign(campaignData || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load campaign";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, fetchCampaignDetail]);

  const handleDonateSubmit = async (amount: number) => {
    // TODO: Implement actual donation API call
    alert(`Donasi berhasil: Rp ${amount.toLocaleString("id-ID")}`);
  };

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "PendingVerification":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Aktif";
      case "PendingVerification":
        return "Menunggu Verifikasi";
      case "Completed":
        return "Selesai";
      case "Rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/Background.jpg')" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-medium">
              Memuat detail kampanye...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/Background.jpg')" }}
        >
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h1 className="text-xl font-bold text-neutral-800 mb-2">
                Terjadi Kesalahan
              </h1>
              <p className="text-neutral-600 mb-6">{error}</p>
              <button
                onClick={() => router.back()}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <Navbar />
        <div
          className="min-h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/Background.jpg')" }}
        >
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neutral-600" />
              </div>
              <h1 className="text-xl font-bold text-neutral-800 mb-2">
                Kampanye Tidak Ditemukan
              </h1>
              <p className="text-neutral-600 mb-6">
                Kampanye yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <button
                onClick={() => router.back()}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate progress percentage
  const progress = (campaign.collected_amount / campaign.target_amount) * 100;

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-sm text-black">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center space-x-2 text-black/80 hover:text-black mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center space-x-2 bg-white/20 text-black px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Heart className="w-4 h-4" />
                  <span>Detail Kampanye</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {campaign.name}
                </h1>
                <div className="flex items-center space-x-4 text-black/90">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(campaign.start_date).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(campaign.status)}`}
                    >
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Image & Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Image */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-primary-50 to-secondary-50">
                  {campaign.image_url ? (
                    <Image
                      src={campaign.image_url}
                      alt={campaign.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-500 font-medium">
                          Tidak ada gambar tersedia
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign Description */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-800" />
                  </div>
                  <span>Tentang Kampanye</span>
                </h2>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {campaign.description}
                  </p>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span>Informasi Kampanye</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="font-medium text-neutral-700">
                        Target Donasi
                      </span>
                      <span className="font-bold text-primary-600">
                        Rp {campaign.target_amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="font-medium text-neutral-700">
                        Tanggal Mulai
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {new Date(campaign.start_date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="font-medium text-neutral-700">
                        Terkumpul
                      </span>
                      <span className="font-bold text-emerald-600">
                        Rp {campaign.collected_amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl">
                      <span className="font-medium text-neutral-700">
                        Tanggal Berakhir
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {new Date(campaign.end_date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Donation Progress & Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Progress Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6" />
                      <h2 className="text-xl font-bold">Progress Donasi</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold">
                          Rp {campaign.collected_amount.toLocaleString("id-ID")}
                        </span>
                        <span className="text-primary-100 text-sm font-medium">
                          {progress.toFixed(1)}% tercapai
                        </span>
                      </div>
                      <p className="text-primary-100 text-sm">
                        dari target Rp{" "}
                        {campaign.target_amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-6 border-b border-neutral-100">
                    <div className="relative w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span className="text-neutral-600">
                        Sisa: Rp{" "}
                        {(
                          campaign.target_amount - campaign.collected_amount
                        ).toLocaleString("id-ID")}
                      </span>
                      <span className="flex items-center space-x-1 text-primary-600 font-medium">
                        <Users className="w-4 h-4" />
                        <span>Donatur</span>
                      </span>
                    </div>
                  </div>

                  {/* Donation Form or Status */}
                  <div className="p-6">
                    {campaign.status === "Active" ? (
                      <>
                        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center space-x-2">
                          <Heart className="w-5 h-5 text-primary-500" />
                          <span>Donasi Sekarang</span>
                        </h3>
                        <DonationForm
                          campaignId={campaign.id.toString()}
                          onSubmit={handleDonateSubmit}
                        />
                      </>
                    ) : (
                      <div className="text-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl">
                        <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-6 h-6 text-neutral-500" />
                        </div>
                        <p className="font-medium text-neutral-700 mb-2">
                          {campaign.status === "Completed"
                            ? "Kampanye Telah Selesai"
                            : campaign.status === "PendingVerification"
                              ? "Kampanye Sedang Diverifikasi"
                              : "Kampanye Tidak Aktif"}
                        </p>
                        <p className="text-neutral-500 text-sm">
                          {campaign.status === "Completed"
                            ? "Terima kasih atas dukungan Anda!"
                            : campaign.status === "PendingVerification"
                              ? "Mohon tunggu proses verifikasi"
                              : "Kampanye tidak dapat menerima donasi"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
