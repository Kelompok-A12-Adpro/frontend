"use client"; // This component uses state and event handlers

import React, { useState } from "react";

interface DonationFormProps {
  campaignId: string;
  onSubmit: (amount: number, message: string) => void; // MODIFIED: message is now string
  isSubmitting?: boolean; // ADDED: for disabling the button
}

const DonationForm: React.FC<DonationFormProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  campaignId,
  onSubmit,
  isSubmitting, // ADDED
}) => {
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (amount === "" || amount <= 0) {
      alert("Masukkan jumlah donasi yang valid.");
      return;
    }

    // MODIFIED: Pass message.trim() which will be a string (empty if no message)
    onSubmit(Number(amount), message.trim());

    // Optionally clear the form after submission - consider if the parent should control this
    // For now, let's keep it, but if donation fails, user might want data to persist.
    // A better approach might be to clear only on successful submission,
    // which would require more state from the parent or a callback.
    setAmount("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Jumlah Donasi (Rp)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : parseInt(e.target.value, 10))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="contoh: 50000"
          min="1000"
          required
          disabled={isSubmitting} // ADDED
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pesan (Opsional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Semoga cepat sembuh 🙏🏽"
          disabled={isSubmitting} // ADDED
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" // ADDED: disabled styles
        disabled={isSubmitting} // ADDED
      >
        {isSubmitting ? "Memproses..." : "Donasi Sekarang"}{" "}
        {/* ADDED: loading text */}
      </button>
    </form>
  );
};

export default DonationForm;
