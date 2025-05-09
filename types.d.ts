interface User {
    id: string;
    name: string;
    role: "Fundraiser" | "Donor";
    registeredAt: Date;
}

interface Campaign {
    id: string;
    title: string;
    isActive: boolean;
    donationsTotal: number;
}

interface Transaction {
    id: string;
    amount: number;
    date: Date;
}