"use client";

import React, { useState } from "react";
import type { CreateCampaignRequest } from "@/types";

interface CreateCampaignFormProps {
  onSubmit: (data: CreateCampaignRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    name: "",
    description: "",
    target_amount: 0,
    start_date: "",
    end_date: "",
    image_url: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCampaignRequest, string>>
  >({});

  const [serverError, setServerError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCampaignRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama kampanye wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    // Simplified validation: min 100,000 and max 100,000,000
    if (formData.target_amount < 100000) {
      newErrors.target_amount = "Target donasi minimal Rp 100.000";
    } else if (formData.target_amount > 1000000000) {
      newErrors.target_amount = "Target donasi maksimal Rp 1.000.000.000";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Tanggal mulai wajib diisi";
    }

    if (!formData.end_date) {
      newErrors.end_date = "Tanggal berakhir wajib diisi";
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.start_date = "Tanggal mulai tidak boleh kurang dari hari ini";
      }

      if (endDate <= startDate) {
        newErrors.end_date = "Tanggal berakhir harus setelah tanggal mulai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      // Log the data being sent for debugging
      console.log("=== Form Data Before Processing ===");
      console.log("Raw form data:", formData);

      // Create properly formatted payload
      const payload: CreateCampaignRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        target_amount: Number(formData.target_amount),
        start_date: formData.start_date,
        end_date: formData.end_date,
        image_url: formData.image_url?.trim() || "",
      };

      console.log("=== Payload Before Sending ===");
      console.log("Formatted payload:", payload);
      console.log("JSON string:", JSON.stringify(payload));

      await onSubmit(payload);
    } catch (error) {
      throw error; // Let the error boundary handle it
    }
  };

  const handleInputChange = (
    field: keyof CreateCampaignRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  // Set default dates
  React.useEffect(() => {
    if (!formData.start_date) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, start_date: todayStr }));
    }
    if (!formData.end_date) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, end_date: nextMonthStr }));
    }
  }, [formData.start_date, formData.end_date]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-6">
        <h3 className="text-4xl font-bold text-black">Buat Kampanye Baru</h3>
        <p className="text-2xl mt-1 text-black">
          Mulai galang dana untuk tujuan mulia Anda
        </p>
      </div>

      {/* Server Error Display */}
      {serverError && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mx-8 mt-6">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
            <div>
              <p className="text-rose-700 font-medium">Error</p>
              <p className="text-rose-600 text-sm mt-1">{serverError}</p>
            </div>
          </div>
        </div>
      )}

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
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 ${
              errors.name
                ? "border-rose-300 bg-rose-50"
                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
            }`}
            placeholder="Contoh: Bantu Pendidikan Anak Dhuafa"
            disabled={isLoading}
            maxLength={255}
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
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 resize-none ${
              errors.description
                ? "border-rose-300 bg-rose-50"
                : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
            }`}
            placeholder="Jelaskan tujuan kampanye Anda dengan detail. Ceritakan mengapa kampanye ini penting dan bagaimana donasi akan digunakan..."
            disabled={isLoading}
            maxLength={2000}
          />
          <div className="flex justify-between items-center">
            <div>
              {errors.description && (
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
                  <p className="text-rose-600 text-sm font-medium">
                    {errors.description}
                  </p>
                </div>
              )}
            </div>
            <span className="text-xs text-neutral-500">
              {formData.description.length}/2000
            </span>
          </div>
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
              min="100000"
              max="1000000000"
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 ${
                errors.target_amount
                  ? "border-rose-300 bg-rose-50"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
              }`}
              placeholder="5000000"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Target donasi: minimal Rp 100.000, maksimal Rp 1.000.000.000
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
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200"
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
          />
          <p className="text-xs text-neutral-500 mt-1">
            Gunakan gambar yang menarik dan relevan dengan kampanye Anda
          </p>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label
              htmlFor="start_date"
              className="block text-sm font-semibold text-neutral-800"
            >
              Tanggal Mulai *
            </label>
            <input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 ${
                errors.start_date
                  ? "border-rose-300 bg-rose-50"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 focus:bg-white"
              }`}
              disabled={isLoading}
            />
            {errors.start_date && (
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 rounded-full bg-rose-500 flex-shrink-0 mt-0.5"></div>
                <p className="text-rose-600 text-sm font-medium">
                  {errors.start_date}
                </p>
              </div>
            )}
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
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              min={
                formData.start_date || new Date().toISOString().split("T")[0]
              }
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 ${
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
            className="flex-1 px-6 py-3 text-pink-500 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              "Buat Kampanye"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
