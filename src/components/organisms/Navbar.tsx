"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  DollarSign,
  Heart,
  LogOut,
  Menu,
  X,
  Target,
  Bell,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { NotificationItem } from "@/types";
import { serviceApi } from "@/libs/axios/api";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const router = useRouter();

  const navItems = [
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Campaigns", icon: Target, href: "/campaigns" },
    { name: "Wallet", icon: DollarSign, href: "/wallet" },
  ];

  // Fetch notifications to get unread count
  const fetchNotifications = async () => {
    try {
      const response = await serviceApi.get("/api/notifications/");
      if (response.data.success && response.data.data) {
        // Count notifications that are not marked as read
        const unreadCount = response.data.data.filter(
          (notification: NotificationItem) => !notification.marked_as_read,
        ).length;
        setUnreadNotifications(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Optional: Set up polling to refresh notification count every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Custom notification item component
  const NotificationItem = ({ isMobile = false }) => (
    <Link
      href="/notification"
      className={`flex items-center ${isMobile ? "space-x-3 px-3 py-3" : "space-x-2 px-3 py-2"} rounded-lg text-${isMobile ? "base" : "sm"} font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 relative`}
      onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
    >
      <div className="relative">
        <Bell
          className={`w-${isMobile ? "5" : "4"} h-${isMobile ? "5" : "4"}`}
        />
        {unreadNotifications > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadNotifications > 99 ? "99+" : unreadNotifications}
          </div>
        )}
      </div>
      <span>Notification</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <Image
                src="/Logo.png"
                alt="Logo"
                width={72}
                height={32}
                className="mx-auto my-4"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <NotificationItem />
            </div>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-error hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 border border-neutral-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <NotificationItem isMobile={true} />
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-neutral-600 hover:text-error hover:bg-red-50 transition-all duration-200 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
