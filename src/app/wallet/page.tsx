"use client"

import type React from "react"

import { useState } from "react"

export default function WalletPage() {
  // Hardcoded user data for Ivan
  const user = {
    id: "1",
    name: "Ivan",
    email: "ivan@example.com",
    role: "donor",
    balance: 500000,
  }

  // Hardcoded transaction data
  const transactions = [
    {
      id: "t1",
      userId: "1",
      type: "topup",
      amount: 200000,
      paymentMethod: "GOPAY",
      phoneNumber: "081234567890",
      timestamp: new Date(2023, 4, 15),
      status: "completed",
    },
    {
      id: "t2",
      userId: "1",
      type: "topup",
      amount: 300000,
      paymentMethod: "DANA",
      phoneNumber: "081234567891",
      timestamp: new Date(2023, 4, 20),
      status: "completed",
    },
    {
      id: "t3",
      userId: "1",
      type: "donation",
      amount: 100000,
      campaignId: "c1",
      campaignTitle: "Help Build a School",
      message: "Semoga cepat terkumpul 🙏",
      timestamp: new Date(2023, 4, 25),
      status: "completed",
    },
  ]

  // State for top-up form
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("GOPAY")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTopUpForm, setShowTopUpForm] = useState(false)
  const [activeTab, setActiveTab] = useState("wallet") // wallet, topup, transactions
  const [successMessage, setSuccessMessage] = useState("")

  // Calculate statistics
  const totalTopup = transactions
    .filter((t) => t.type === "topup" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDonations = transactions
    .filter((t) => t.type === "donation" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Handle top-up form submission
  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseInt(amount) < 10000) {
      alert("Please enter an amount of at least Rp 10,000")
      return
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMessage(`You have successfully topped up ${formatCurrency(Number.parseInt(amount))} to your wallet.`)
      setAmount("")
      setPhoneNumber("")
      setActiveTab("wallet")

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    }, 1500)
  }

  // Predefined amounts for top-up
  const predefinedAmounts = [50000, 100000, 200000, 500000]

  // Common styles
  const styles = {
    container: {
      fontFamily: "Arial, Helvetica, sans-serif",
      width: "100%",
      minHeight: "100vh",
      padding: "20px",
      color: "#171717",
      background: "#ffffff",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    subheader: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "24px",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    cardValue: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "4px",
    },
    cardSubtext: {
      fontSize: "12px",
      color: "#666",
    },
    button: {
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    outlineButton: {
      background: "white",
      color: "#3b82f6",
      border: "1px solid #3b82f6",
      borderRadius: "6px",
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    tabButton: {
      padding: "10px 16px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      borderBottom: "2px solid transparent",
    },
    activeTabButton: {
      borderBottom: "2px solid #3b82f6",
      color: "#3b82f6",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      fontSize: "14px",
    },
    radioGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    },
    radioOption: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
    },
    successMessage: {
      background: "#dcfce7",
      color: "#166534",
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
    },
    flexRow: {
      display: "flex",
      gap: "12px",
      marginTop: "16px",
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #e5e7eb",
      marginBottom: "24px",
    },
    transactionItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #f3f4f6",
    },
    transactionType: {
      fontWeight: "bold",
      textTransform: "capitalize" as const,
    },
    transactionMeta: {
      fontSize: "12px",
      color: "#666",
    },
    transactionAmount: {
      fontWeight: "bold",
      textAlign: "right" as const,
    },
    topupAmount: {
      color: "#16a34a",
    },
    donationAmount: {
      color: "#dc2626",
    },
  }

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", width: "100%" }}>
      <div style={styles.container}>
        {/* Success message */}
        {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

        {/* Header */}
        <div>
          <h1 style={styles.header}>Wallet</h1>
          <p style={styles.subheader}>Manage your wallet and transactions</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "wallet" ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab("wallet")}
          >
            Wallet
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "topup" ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab("topup")}
          >
            Top Up
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "transactions" ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
        </div>

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <>
            <div style={styles.grid}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Current Balance</div>
                <div style={styles.cardValue}>{formatCurrency(user.balance)}</div>
                <div style={styles.cardSubtext}>Available for donations</div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Total Top Up</div>
                <div style={styles.cardValue}>{formatCurrency(totalTopup)}</div>
                <div style={styles.cardSubtext}>All time</div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Total Donations</div>
                <div style={styles.cardValue}>{formatCurrency(totalDonations)}</div>
                <div style={styles.cardSubtext}>All time</div>
              </div>
            </div>

            <div style={styles.flexRow}>
              <button style={styles.button} onClick={() => setActiveTab("topup")}>
                Top Up Wallet
              </button>
              <button style={styles.outlineButton} onClick={() => setActiveTab("transactions")}>
                View Transactions
              </button>
            </div>

            {/* Recent Transactions */}
            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Recent Transactions</h2>
              <div style={styles.card}>
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div>
                      <div style={styles.transactionType}>{transaction.type}</div>
                      <div style={styles.transactionMeta}>
                        {transaction.paymentMethod && `via ${transaction.paymentMethod}`}
                        {transaction.campaignTitle && `to ${transaction.campaignTitle}`}
                      </div>
                      <div style={styles.transactionMeta}>{transaction.timestamp.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div
                        style={{
                          ...styles.transactionAmount,
                          ...(transaction.type === "topup" ? styles.topupAmount : styles.donationAmount),
                        }}
                      >
                        {transaction.type === "topup" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div style={styles.transactionMeta}>{transaction.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Top Up Tab */}
        {activeTab === "topup" && (
          <div style={styles.card}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>Top Up</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>Choose an amount and payment method</p>

            <form onSubmit={handleTopUp}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="amount">
                  Amount (Rp)
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={10000}
                  required
                  style={styles.input}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                  {predefinedAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value.toString())}
                      style={{
                        padding: "8px",
                        border: amount === value.toString() ? "1px solid #3b82f6" : "1px solid #e5e7eb",
                        borderRadius: "6px",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Payment Method</label>
                <div style={styles.radioGroup}>
                  <div style={styles.radioOption}>
                    <input
                      type="radio"
                      id="gopay"
                      name="paymentMethod"
                      value="GOPAY"
                      checked={paymentMethod === "GOPAY"}
                      onChange={() => setPaymentMethod("GOPAY")}
                      style={{ marginRight: "8px" }}
                    />
                    <label htmlFor="gopay">GOPAY</label>
                  </div>
                  <div style={styles.radioOption}>
                    <input
                      type="radio"
                      id="dana"
                      name="paymentMethod"
                      value="DANA"
                      checked={paymentMethod === "DANA"}
                      onChange={() => setPaymentMethod("DANA")}
                      style={{ marginRight: "8px" }}
                    />
                    <label htmlFor="dana">DANA</label>
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={styles.input}
                />
                <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  Enter the phone number associated with your {paymentMethod} account
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  width: "100%",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Processing..." : `Top Up ${amount ? formatCurrency(Number.parseInt(amount)) : ""}`}
              </button>
            </form>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            <div style={styles.card}>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div>
                      <div style={styles.transactionType}>{transaction.type}</div>
                      <div style={styles.transactionMeta}>
                        {transaction.paymentMethod && `via ${transaction.paymentMethod}`}
                        {transaction.campaignTitle && `to ${transaction.campaignTitle}`}
                      </div>
                      {transaction.message && (
                        <div style={{ fontSize: "13px", fontStyle: "italic", marginTop: "4px" }}>
                          "{transaction.message}"
                        </div>
                      )}
                      <div style={styles.transactionMeta}>
                        {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          ...styles.transactionAmount,
                          ...(transaction.type === "topup" ? styles.topupAmount : styles.donationAmount),
                        }}
                      >
                        {transaction.type === "topup" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: "#f3f4f6",
                          display: "inline-block",
                          marginTop: "4px",
                          textTransform: "capitalize" as const,
                        }}
                      >
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "24px", color: "#666" }}>No transactions found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
