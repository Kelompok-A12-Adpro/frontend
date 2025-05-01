// src/app/campaigns/[campaignId]/page.tsx
"use client"; // Needed because we'll use client-side interaction (form)

import React from 'react';
import Image from 'next/image';
import DonationForm from '@/components/organisms/DonationForm'; // Assuming components are in src/components

// --- Mock Data (Replace with actual API fetch based on campaignId) ---
const mockCampaignDetail = {
  id: '1',
  title: 'Bantu Anak Yatim Piatu',
  description: 'Penggalangan dana ini bertujuan untuk mendukung kebutuhan dasar anak yatim piatu di panti asuhan Kasih Bunda. Dana akan digunakan untuk biaya sekolah, makanan bergizi, dan pakaian layak.',
  imageUrl: '/placeholder-image.jpg', // Replace with actual image path or URL
  goal: 10000000,
  currentAmount: 3500000,
  fundraiser: {
    name: 'Yayasan Kasih Bunda',
    profileUrl: '/fundraiser/kasih-bunda', // Example link
  },
  // Add other details like deadline, etc.
};
// --- End Mock Data ---

// Define params type for type safety
interface CampaignDetailPageProps {
  params: {
    campaignId: string;
  };
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { campaignId } = params;

  // In a real app, fetch campaign details based on campaignId
  // For now, we use mock data, pretending it matches the ID '1'
  const campaign = campaignId === mockCampaignDetail.id ? mockCampaignDetail : null;

  const handleDonateSubmit = (amount: number, message: string | null) => {
    console.log(`--- Donate Button Pressed ---`);
    console.log(`Campaign ID: ${campaignId}`);
    console.log(`Amount: ${amount}`);
    console.log(`Message: ${message || 'No message'}`);
    // TODO: Implement API call to process the donation
    // - Send campaignId, amount, message to the backend
    // - Handle success/error response (e.g., show notification, redirect)
    // - Update user's wallet balance (likely done on backend, reflected on FE)
    alert(`Donation submitted (simulated): Amount ${amount}, Message: "${message || ''}"`);
  };

   const handleDeleteMessage = (messageId: string) => {
    // Note: This button might belong elsewhere (e.g., user's donation history page)
    // but adding a placeholder here if needed on this page for some reason.
    console.log(`--- Delete Message Button Pressed ---`);
    console.log(`Message ID to delete: ${messageId}`);
    // TODO: Implement API call to delete the specific message
    // - Requires knowing the specific message ID to delete
    // - Handle success/error response
    alert(`Delete message requested (simulated): Message ID ${messageId}`);
  }


  if (!campaign) {
    // Handle case where campaign is not found
    return <div className="container mx-auto px-4 py-8">Kampanye tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="md:col-span-2">
          <div className="relative w-full h-64 md:h-96 mb-4 bg-gray-200 rounded">
            <Image
              src={campaign.imageUrl}
              alt={campaign.title}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">Detail Kampanye</h2>
          <p className="text-gray-700 mb-4">{campaign.description}</p>

           <h3 className="text-lg font-semibold mb-2">Diselenggarakan oleh:</h3>
           {/* TODO: Make fundraiser name a link if profileUrl exists */}
           <p className="text-gray-700 mb-4">{campaign.fundraiser.name}</p>

           {/* Example Placeholder for deleting a message (if applicable here) */}
           {/* You'd typically list donations/messages first */}
           {/* <button
             onClick={() => handleDeleteMessage('some-message-id')}
             className="text-red-500 hover:text-red-700 text-sm"
           >
             Hapus Pesan Contoh (ID: some-message-id)
           </button> */}

        </div>

        {/* Right Column: Donation Progress & Form */}
        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Donasi Sekarang</h2>
            <div className="mb-4">
              <p className="text-lg font-bold text-blue-600">
                Rp {campaign.currentAmount.toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-gray-600">
                terkumpul dari target Rp {campaign.goal.toLocaleString('id-ID')}
              </p>
              {/* Optional: Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(campaign.currentAmount / campaign.goal) * 100}%` }}
                ></div>
              </div>
            </div>
            <DonationForm
              campaignId={campaign.id}
              onSubmit={handleDonateSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}