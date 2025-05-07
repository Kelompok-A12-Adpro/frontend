// src/app/campaigns/page.tsx
import React from "react";
import CampaignCard from "@/components/organisms/CampaignCard"; // Assuming components are in src/components

// --- Mock Data (Replace with actual API fetch) ---
const mockCampaigns = [
  {
    id: "1",
    title: "Bantu Anak Yatim Piatu",
    description:
      "Penggalangan dana untuk mendukung kebutuhan dasar anak yatim.",
    imageUrl: "/placeholder-image.jpg", // Replace with actual image path or URL
    goal: 10000000,
    currentAmount: 3500000,
  },
  {
    id: "2",
    title: "Renovasi Masjid Al-Hidayah",
    description: "Ayo bantu renovasi masjid kebanggaan kita.",
    imageUrl: "/placeholder-image.jpg",
    goal: 50000000,
    currentAmount: 12000000,
  },
  // Add more mock campaigns as needed
];
// --- End Mock Data ---

export default function CampaignsPage() {
  // In a real app, you would fetch campaigns here using useEffect or server-side fetching
  const campaigns = mockCampaigns;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Semua Kampanye</h1>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <p>Belum ada kampanye yang tersedia.</p>
      )}
    </div>
  );
}
