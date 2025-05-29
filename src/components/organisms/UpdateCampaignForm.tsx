"use client";

import React, { useState } from "react";
import type { Campaign, UpdateCampaignRequest } from "@/types";

interface UpdateCampaignFormProps {
  campaign: Campaign;
  onSubmit: (data: UpdateCampaignRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const UpdateCampaignForm: React.FC<UpdateCampaignFormProps> = ({
  campaign,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateCampaignRequest>({
    name: campaign.name,
    description: campaign.description,
    target_amount: campaign.target_amount,
    end_date: new Date(campaign.end_date).toISOString().split("T")[0],
    image_url: campaign.image_url || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateCampaignRequest, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateCampaignRequest, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nama kampanye wajib diisi";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    if (formData.target_amount && formData.target_amount <= 100000) {
      newErrors.target_amount = "Target amount harus lebih dari Rp 100.000";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Tanggal berakhir wajib diisi";
    }

    if (formData.end_date) {
      const endDate = new Date(formData.end_date);
      const startDate = new Date(campaign.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate <= startDate) {
        newErrors.end_date = "Tanggal berakhir harus setelah tanggal mulai";
      }

      if (endDate < today) {
        newErrors.end_date =
          "Tanggal berakhir tidak boleh kurang dari hari ini";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Only send fields that have been changed
      const updatedData: UpdateCampaignRequest = {};

      if (formData.name !== campaign.name) {
        updatedData.name = formData.name;
      }
      if (formData.description !== campaign.description) {
        updatedData.description = formData.description;
      }
      if (formData.target_amount !== campaign.target_amount) {
        updatedData.target_amount = formData.target_amount;
      }
      if (
        formData.end_date !==
        new Date(campaign.end_date).toISOString().split("T")[0]
      ) {
        updatedData.end_date = formData.end_date;
      }
      if (formData.image_url !== (campaign.image_url || "")) {
        updatedData.image_url = formData.image_url;
      }

      await onSubmit(updatedData);
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  const handleInputChange = (
    field: keyof UpdateCampaignRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
        <h3 className="text-2xl font-bold text-white">Edit Kampanye</h3>
        <p className="text-amber-100 mt-1">
          Perbarui informasi kampanye &quot;{campaign.name}&quot;
        </p>
      </div>

      {/* Campaign Status Info */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-8 py-4 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              campaign.status === "PendingVerification"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          ></div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Status saat ini:
              <span
                className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === "PendingVerification"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}
              >
                {campaign.status === "PendingVerification"
                  ? "Menunggu Verifikasi"
                  : "Ditolak"}
              </span>
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              Anda dapat mengedit kampanye yang statusnya &quot;Menunggu
              Verifikasi&quot; atau &quot;Ditolak&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Campaign Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-neutral-800"
          >
            Nama Kampanye *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 ${
              errors.name
                ? "border-rose-300 bg-rose-50"
                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
            }`}
            placeholder="Masukkan nama kampanye"
            disabled={isLoading}
          />
          {errors.name && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
              <p className="text-rose-600 text-sm font-medium">{errors.name}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-neutral-800"
          >
            Deskripsi Kampanye *
          </label>
          <textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 resize-none ${
              errors.description
                ? "border-rose-300 bg-rose-50"
                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
            }`}
            placeholder="Jelaskan tujuan kampanye Anda"
            disabled={isLoading}
          />
          {errors.description && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
              <p className="text-rose-600 text-sm font-medium">
                {errors.description}
              </p>
            </div>
          )}
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <label
            htmlFor="target_amount"
            className="block text-sm font-semibold text-neutral-800"
          >
            Target Donasi *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-neutral-500 font-medium">Rp</span>
            </div>
            <input
              id="target_amount"
              type="number"
              value={formData.target_amount || ""}
              onChange={(e) =>
                handleInputChange("target_amount", Number(e.target.value))
              }
              min="100001"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 ${
                errors.target_amount
                  ? "border-rose-300 bg-rose-50"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
              }`}
              placeholder="50000000"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Minimum target donasi adalah Rp 100.000
          </p>
          {errors.target_amount && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
              <p className="text-rose-600 text-sm font-medium">
                {errors.target_amount}
              </p>
            </div>
          )}
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label
            htmlFor="image_url"
            className="block text-sm font-semibold text-neutral-800"
          >
            URL Gambar Kampanye
            <span className="text-neutral-500 font-normal ml-1">
              (Opsional)
            </span>
          </label>
          <input
            id="image_url"
            type="url"
            value={formData.image_url || ""}
            onChange={(e) => handleInputChange("image_url", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-200"
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Gunakan gambar yang menarik dan relevan dengan kampanye Anda
          </p>
        </div>

        {/* Date Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date (Read-only) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-800">
              Tanggal Mulai
              <span className="text-neutral-500 font-normal ml-1">
                (Tidak dapat diubah)
              </span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={
                  new Date(campaign.start_date).toISOString().split("T")[0]
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-100 text-neutral-600 cursor-not-allowed"
                disabled
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15l-3-3h6l-3 3z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-neutral-500">
              Tanggal mulai tidak dapat diubah setelah kampanye dibuat
            </p>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label
              htmlFor="end_date"
              className="block text-sm font-semibold text-neutral-800"
            >
              Tanggal Berakhir *
            </label>
            <input
              id="end_date"
              type="date"
              value={formData.end_date || ""}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 ${
                errors.end_date
                  ? "border-rose-300 bg-rose-50"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
              }`}
              disabled={isLoading}
            />
            {errors.end_date && (
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
                <p className="text-rose-600 text-sm font-medium">
                  {errors.end_date}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-neutral-300"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              "Update Kampanye"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCampaignForm;
