"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/atoms/Loading";

export default function Page() {
    const [ongoingCampaigns, setOngoingCampaigns] = useState<number>(0);
    const [totalDonations, setTotalDonations] = useState<number>(0);
    const [registeredUsers, setRegisteredUsers] = useState<number>(0);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Mock data for demonstration
                const mockCampaigns: Campaign[] = [
                    {
                        id: "1",
                        title: "Save the Ocean",
                        isActive: true,
                        donationsTotal: 5000,
                    },
                    {
                        id: "2",
                        title: "Plant Trees",
                        isActive: true,
                        donationsTotal: 7500,
                    },
                    {
                        id: "3",
                        title: "Help Homeless",
                        isActive: true,
                        donationsTotal: 3000,
                    },
                    {
                        id: "4",
                        title: "Past Campaign",
                        isActive: false,
                        donationsTotal: 2000,
                    },
                ];

                const mockUsers: User[] = [
                    {
                        id: "1",
                        name: "John Doe",
                        role: "Fundraiser",
                        registeredAt: new Date("2023-10-01"),
                    },
                    {
                        id: "2",
                        name: "Jane Smith",
                        role: "Donor",
                        registeredAt: new Date("2023-10-02"),
                    },
                    {
                        id: "3",
                        name: "Alice Johnson",
                        role: "Fundraiser",
                        registeredAt: new Date("2023-10-03"),
                    },
                    {
                        id: "4",
                        name: "Bob Brown",
                        role: "Donor",
                        registeredAt: new Date("2023-10-04"),
                    },
                    {
                        id: "5",
                        name: "Charlie Wilson",
                        role: "Donor",
                        registeredAt: new Date("2023-10-05"),
                    },
                    {
                        id: "6",
                        name: "David Clark",
                        role: "Fundraiser",
                        registeredAt: new Date("2023-10-06"),
                    },
                ];

                // Calculate stats (harusnya nanti di BE)
                const activeCampaigns = mockCampaigns.filter((camp) => camp.isActive);
                const totalDonationsAmount = mockCampaigns.reduce(
                    (sum, camp) => sum + camp.donationsTotal,
                    0,
                );

                // Sort users by registration date (harusnya nanti di BE)
                const sortedUsers = [...mockUsers]
                    .sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime())
                    .slice(0, 5);

                // Update states
                setOngoingCampaigns(activeCampaigns.length);
                setTotalDonations(totalDonationsAmount);
                setRegisteredUsers(mockUsers.length);
                setRecentUsers(sortedUsers);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                setIsLoading(false);
            }
        };

        setTimeout(() => {
            fetchDashboardData();
        }, 1000);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Ongoing Campaigns */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">
                        Ongoing Campaigns
                    </h2>
                    <div className="flex items-center">
                        <div className="text-3xl font-bold text-gray-900">
                            {ongoingCampaigns}
                        </div>
                    </div>
                </div>

                {/* Total Donations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">
                        Total Donations
                    </h2>
                    <div className="flex items-center">
                        <div className="text-3xl font-bold text-gray-900">
                            ${totalDonations.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Registered Users */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-gray-500 text-sm font-medium uppercase mb-2">
                        Registered Users
                    </h2>
                    <div className="flex items-center">
                        <div className="text-3xl font-bold text-gray-900">
                            {registeredUsers}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Recently Registered Users
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "Fundraiser"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.registeredAt.toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-right text-sm text-gray-500 mt-8">
                <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
}