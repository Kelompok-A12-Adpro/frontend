import React from "react";
import Link from "next/link";
import { Campaign, CampaignStatus } from "@/types";
import Image from "next/image";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = (campaign.collected_amount / campaign.target_amount) * 100;
  const descriptionSnippet =
    campaign.description.length > 100
      ? campaign.description.substring(0, 97) + "..."
      : campaign.description;

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.Active:
        return "text-green-600 bg-green-100";
      case CampaignStatus.PendingVerification:
        return "text-yellow-600 bg-yellow-100";
      case CampaignStatus.Rejected:
        return "text-red-600 bg-red-100";
      case CampaignStatus.Completed:
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={campaign.image_url || "/default-campaign-image.jpg"}
          alt={campaign.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold flex-1">{campaign.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
          >
            {campaign.status}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {descriptionSnippet}
        </p>

        {/* Progress Info */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-blue-600">
              Rp {campaign.collected_amount.toLocaleString("id-ID")}
            </span>
            <span className="text-gray-500">
              Target: Rp {campaign.target_amount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {progress.toFixed(1)}% tercapai
          </div>
        </div>

        {/* Campaign Dates */}
        <div className="text-xs text-gray-500 mb-3">
          <div>
            Mulai: {new Date(campaign.start_date).toLocaleDateString("id-ID")}
          </div>
          <div>
            Berakhir: {new Date(campaign.end_date).toLocaleDateString("id-ID")}
          </div>
        </div>

        <Link href={`/campaigns/${campaign.id}`} legacyBehavior>
          <a className="mt-auto block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50">
            {campaign.status === CampaignStatus.Active
              ? "Lihat Detail & Donasi"
              : "Lihat Detail"}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
