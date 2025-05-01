// src/components/CampaignCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define the type for campaign props
interface Campaign {
  id: string;
  title: string;
  description: string; // Keep it short for the card
  imageUrl: string;
  goal: number;
  currentAmount: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = (campaign.currentAmount / campaign.goal) * 100;
  const descriptionSnippet = campaign.description.length > 100
    ? campaign.description.substring(0, 97) + '...'
    : campaign.description;


  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={campaign.imageUrl}
          alt={campaign.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{descriptionSnippet}</p>

        {/* Progress Info */}
        <div className="mb-3">
           <div className="flex justify-between text-sm mb-1">
             <span className="font-medium text-blue-600">Rp {campaign.currentAmount.toLocaleString('id-ID')}</span>
             <span className="text-gray-500">Target: Rp {campaign.goal.toLocaleString('id-ID')}</span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2">
             <div
               className="bg-blue-600 h-2 rounded-full"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
        </div>

        <Link href={`/campaigns/${campaign.id}`} legacyBehavior>
          <a className="mt-auto block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors duration-200">
            Lihat Detail & Donasi
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;