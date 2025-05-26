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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCampaignRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama kampanye wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }

    if (formData.target_amount <= 100000) {
      newErrors.target_amount = "Target amount harus lebih dari Rp 100.0000";
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

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        target_amount: 0,
        start_date: "",
        end_date: "",
        image_url: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold mb-4">Buat Kampanye Baru</h3>

      {/* Campaign Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Kampanye *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Masukkan nama kampanye"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deskripsi *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Jelaskan tujuan kampanye Anda"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Target Amount */}
      <div>
        <label
          htmlFor="target_amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Target Donasi (Rp) *
        </label>
        <input
          id="target_amount"
          type="number"
          value={formData.target_amount || ""}
          onChange={(e) =>
            handleInputChange("target_amount", Number(e.target.value))
          }
          min="1"
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.target_amount ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="50000000"
          disabled={isLoading}
        />
        {errors.target_amount && (
          <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          URL Gambar (Opsional)
        </label>
        <input
          id="image_url"
          type="url"
          value={formData.image_url || ""}
          onChange={(e) => handleInputChange("image_url", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
          disabled={isLoading}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Mulai *
          </label>
          <input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange("start_date", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start_date ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Berakhir *
          </label>
          <input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end_date ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          disabled={isLoading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Buat Kampanye"}
        </button>
      </div>
    </form>
  );
};

export default CreateCampaignForm;
