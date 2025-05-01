"use client"; // This component uses state and event handlers

import React, { useState } from 'react';

interface DonationFormProps {
  campaignId: string; // Needed if form submission logic depends on it here
  onSubmit: (amount: number, message: string | null) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ campaignId, onSubmit }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Basic validation
    if (amount === '' || amount <= 0) {
      alert('Masukkan jumlah donasi yang valid.');
      return;
    }

    // Call the onSubmit prop passed from the parent page
    onSubmit(Number(amount), message.trim() || null); // Pass null if message is empty

    // Optionally clear the form after submission
    // setAmount('');
    // setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah Donasi (Rp)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="contoh: 50000"
          min="1000" // Example minimum donation
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
      >
        Donasi Sekarang
      </button>
    </form>
  );
};

export default DonationForm;