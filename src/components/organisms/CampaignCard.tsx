import React from "react";
import Link from "next/link";
import { Campaign, CampaignStatus } from "@/types";
import Image from "next/image";

interface CampaignCardProps {
  campaign: Campaign;
  showActionButtons?: boolean;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  showActionButtons = false,
  onEdit,
  onDelete,
}) => {
  const progress = (campaign.collected_amount / campaign.target_amount) * 100;
  const descriptionSnippet =
    campaign.description.length > 100
      ? campaign.description.substring(0, 97) + "..."
      : campaign.description;

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.Active:
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case CampaignStatus.PendingVerification:
        return "text-amber-700 bg-amber-50 border-amber-200";
      case CampaignStatus.Rejected:
        return "text-rose-700 bg-rose-50 border-rose-200";
      case CampaignStatus.Completed:
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-neutral-700 bg-neutral-50 border-neutral-200";
    }
  };

  // Check if campaign can be edited (only PendingVerification)
  const canEdit = campaign.status === CampaignStatus.PendingVerification;

  // Check if campaign can be deleted (only Rejected)
  const canDelete = campaign.status === CampaignStatus.Rejected;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit && canEdit) {
      onEdit(campaign);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && canDelete) {
      onDelete(campaign);
    }
  };

  return (
    <div className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col">
      {/* Campaign Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary-50 to-secondary-50">
        <Image
          src={campaign.image_url || "/foto-banjir.jpeg"}
          alt={campaign.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}
          >
            {campaign.status === CampaignStatus.PendingVerification
              ? "Menunggu Verifikasi"
              : campaign.status === CampaignStatus.Active
                ? "Aktif"
                : campaign.status === CampaignStatus.Completed
                  ? "Selesai"
                  : campaign.status === CampaignStatus.Rejected
                    ? "Ditolak"
                    : campaign.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
          {campaign.name}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
          {descriptionSnippet}
        </p>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-primary-600">
              Rp {campaign.collected_amount.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              {progress.toFixed(1)}% tercapai
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-500">
              Target: Rp {campaign.target_amount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Campaign Timeline */}
        <div className="border-t border-neutral-100 pt-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col">
              <span className="text-neutral-500 font-medium">Mulai</span>
              <span className="text-neutral-700 font-semibold">
                {new Date(campaign.start_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-neutral-500 font-medium">Berakhir</span>
              <span className="text-neutral-700 font-semibold">
                {new Date(campaign.end_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Edit Button - Only show for PendingVerification */}
          {showActionButtons && canEdit && (
            <button
              onClick={handleEditClick}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Edit Kampanye
            </button>
          )}

          {/* Delete Button - Only show for Rejected */}
          {showActionButtons && canDelete && (
            <button
              onClick={handleDeleteClick}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Hapus Kampanye
            </button>
          )}

          {/* View Detail Button */}
          <Link href={`/campaigns/${campaign.id}`} legacyBehavior>
            <a className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-pink-500 font-medium text-center py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm hover:shadow-md">
              {campaign.status === CampaignStatus.Active
                ? "Lihat Detail & Donasi"
                : "Lihat Detail"}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
