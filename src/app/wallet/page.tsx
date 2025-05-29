"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { serviceApi } from "@/libs/axios/api";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";

// Types matching your Rust backend
interface WalletData {
  id: number;
  user_id: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  user_id: number;
  transaction_type: string;
  amount: number;
  payment_method?: string;
  phone_number?: string;
  campaign_id?: number;
  campaign_title?: string;
  message?: string;
  status: string;
  created_at: string;
}

interface TopUpRequest {
  method: string;
  phone_number: string;
  amount: number;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  trend?: "up" | "down";
}) => {
  return (
    <Card className="group hover:shadow-lg hover:border-primary-200 transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-sm text-neutral-600 font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
        <CardDescription className="text-xs">{subtitle}</CardDescription>
      </CardContent>
    </Card>
  );
};

const TransactionItem = ({
  transaction,
  onDelete,
  formatCurrency,
}: {
  transaction: Transaction;
  onDelete: (id: number) => void;
  formatCurrency: (amount: number) => string;
}) => {
  const isTopup = transaction.transaction_type === "topup";

  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTopup
              ? "bg-green-100 text-green-600"
              : "bg-pink-100 text-pink-600"
          }`}
        >
          {isTopup ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="font-medium text-neutral-900 capitalize">
            {transaction.transaction_type}
          </div>
          <div className="text-sm text-neutral-500">
            {transaction.payment_method && `via ${transaction.payment_method}`}
            {transaction.campaign_title && `to ${transaction.campaign_title}`}
          </div>
          {transaction.message && (
            <div className="text-xs text-neutral-400 italic mt-1">
              &ldquo;{transaction.message}&rdquo;
            </div>
          )}
          <div className="text-xs text-neutral-400">
            {new Date(transaction.created_at).toLocaleDateString()} at{" "}
            {new Date(transaction.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`font-bold ${isTopup ? "text-green-600" : "text-pink-600"}`}
        >
          {isTopup ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
        <div className="text-xs text-neutral-500 capitalize mb-2">
          {transaction.status}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(transaction.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-auto"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default function WalletPage() {
  // State for wallet data
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // State for top-up form
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("GOPAY");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("wallet");
  const [successMessage, setSuccessMessage] = useState("");

  // API Functions
  const fetchWallet = async (): Promise<WalletData> => {
    const token = localStorage.getItem("token");
    const response = await serviceApi.get("/wallet/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const fetchTransactions = async (): Promise<Transaction[]> => {
    const token = localStorage.getItem("token");
    const response = await serviceApi.get("/wallet/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const topUpWallet = async (data: TopUpRequest): Promise<WalletData> => {
    const token = localStorage.getItem("token");
    const response = await serviceApi.post("/wallet/topup", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const deleteTransaction = async (transactionId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    await serviceApi.delete(`/wallet/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Load wallet and transaction data
  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      const [walletData, transactionData] = await Promise.all([
        fetchWallet(),
        fetchTransactions(),
      ]);

      setWallet(walletData);
      setTransactions(transactionData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load wallet data";
      setError(errorMessage);
      console.error("Error loading wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

  // Calculate statistics
  const totalTopup = transactions
    .filter((t) => t.transaction_type === "topup")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDonations = transactions
    .filter((t) => t.transaction_type === "donation")
    .reduce((sum, t) => sum + t.amount, 0);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle top-up form submission
  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number.parseInt(amount) < 10000) {
      alert("Please enter an amount of at least Rp 10,000");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const topUpData: TopUpRequest = {
        method: paymentMethod,
        phone_number: phoneNumber,
        amount: Number.parseInt(amount),
      };

      const updatedWallet = await topUpWallet(topUpData);

      setWallet(updatedWallet);
      setSuccessMessage(
        `You have successfully topped up ${formatCurrency(Number.parseInt(amount))} to your wallet.`,
      );

      // Reset form
      setAmount("");
      setPhoneNumber("");
      setActiveTab("wallet");

      // Reload transactions to show the new top-up
      await fetchTransactions().then(setTransactions);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process top-up";
      setError(errorMessage);
      alert(`Top-up failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (transactionId: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      setSuccessMessage("Transaction deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete transaction";
      alert(`Delete failed: ${errorMessage}`);
    }
  };

  // Predefined amounts for top-up
  const predefinedAmounts = [50000, 100000, 200000, 500000];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <Button onClick={loadWalletData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
      <Navbar />

      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
            <Button
              variant="ghost"
              onClick={loadWalletData}
              className="ml-3 text-red-600 hover:text-red-700 underline"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Wallet className="w-4 h-4" />
            <span>Wallet Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Your <span className="text-pink-400">Wallet</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Manage your donations and track your impact with our secure wallet
            system
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
            {["wallet", "topup", "transactions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
              >
                {tab === "topup" ? "Top Up" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Tab */}
        {activeTab === "wallet" && wallet && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatCard
                icon={Wallet}
                title="Current Balance"
                value={formatCurrency(wallet.balance)}
                subtitle="Available for donations"
              />
              <StatCard
                icon={TrendingUp}
                title="Total Top Up"
                value={formatCurrency(totalTopup)}
                subtitle="All time"
                trend="up"
              />
              <StatCard
                icon={TrendingDown}
                title="Total Donations"
                value={formatCurrency(totalDonations)}
                subtitle="All time"
                trend="down"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setActiveTab("topup")}
                className="inline-flex items-center gap-2"
              >
                Top Up Wallet
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("transactions")}
                className="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-300"
              >
                View All Transactions
              </Button>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.slice(0, 5).length > 0 ? (
                  <div>
                    {transactions.slice(0, 5).map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onDelete={handleDeleteTransaction}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    No transactions found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Up Tab */}
        {activeTab === "topup" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Top Up Your Wallet</CardTitle>
                <CardDescription>
                  Choose an amount and payment method to add funds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleTopUp} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Amount (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={10000}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {predefinedAmounts.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setAmount(value.toString())}
                          className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                            amount === value.toString()
                              ? "border-primary-500 bg-primary-50 text-primary-700"
                              : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {formatCurrency(value)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      {["GOPAY", "DANA"].map((method) => (
                        <div
                          key={method}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            paymentMethod === method
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                          onClick={() => setPaymentMethod(method)}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="mr-3"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                              <Smartphone className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-sm text-neutral-500 mt-2">
                      Enter the phone number associated with your{" "}
                      {paymentMethod} account
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-lg"
                  >
                    {isLoading
                      ? "Processing..."
                      : `Top Up ${amount ? formatCurrency(Number.parseInt(amount)) : ""}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">All Transactions</CardTitle>
                <CardDescription>
                  Complete history of your wallet activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length > 0 ? (
                  <div>
                    {transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onDelete={handleDeleteTransaction}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    <Wallet className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                    <p className="text-lg font-medium mb-2">
                      No transactions found
                    </p>
                    <p>
                      Start by topping up your wallet to see transactions here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
