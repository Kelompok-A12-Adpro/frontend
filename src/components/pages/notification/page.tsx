"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  Trash2,
  Check,
  Mail,
  Users,
  Target,
  Heart,
} from "lucide-react";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import { NotificationItem } from "@/types";
import { serviceApi } from "@/libs/axios/api";
import { Button } from "@/components/atoms/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  variant = "default",
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  variant?: "default" | "primary" | "success" | "warning";
}) => {
  const variantStyles = {
    default: "from-neutral-500 to-neutral-600",
    primary: "from-primary-500 to-secondary-500",
    success: "from-green-500 to-green-600",
    warning: "from-amber-500 to-amber-600",
  };

  return (
    <Card className="group hover:shadow-lg hover:border-primary-200 transition-all duration-300 bg-gradient-to-br from-white to-pink-50/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${variantStyles[variant]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
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

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // TODO: Implement these functions
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await serviceApi.get("/api/notifications/");
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await serviceApi.put(`/api/notifications/${notificationId}`);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, marked_as_read: true }
            : notif,
        ),
      );

      setSuccessMessage("Notification marked as read");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      await serviceApi.delete(`/api/notifications/${notificationId}`);

      // Update local state
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId),
      );

      setSuccessMessage("Notification deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification");
    }
  };

  const toggleSubscription = async () => {
    try {
      setSubscribing(true);

      await serviceApi.post("/api/subscribe");

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsSubscribed(!isSubscribed);

      setSuccessMessage(
        isSubscribed
          ? "Unsubscribed from notifications"
          : "Subscribed to notifications",
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error toggling subscription:", error);
      setError("Failed to update subscription");
    } finally {
      setSubscribing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (target_type: string) => {
    switch (target_type) {
      case "NewCampaign":
        return <Target className="w-5 h-5 text-blue-500" />;
      case "Fundraisers":
        return <Heart className="w-5 h-5 text-pink-500" />;
      case "AllUsers":
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTypeText = (target_type: string) => {
    switch (target_type) {
      case "NewCampaign":
        return "Kampanye Baru";
      case "Fundraisers":
        return "Penggalang Dana";
      case "AllUsers":
        return "Pengumuman";
      default:
        return "Notifikasi";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.marked_as_read);
  const readNotifications = notifications.filter((n) => n.marked_as_read);
  const displayNotifications =
    activeTab === "unread" ? unreadNotifications : readNotifications;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-neutral-600">Loading notifications...</p>
          </div>
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
              onClick={fetchNotifications}
              className="ml-3 text-red-600 hover:text-red-700 underline"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bell className="w-4 h-4" />
            <span>Notification Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Your <span className="text-pink-400">Notifications</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Stay updated with all the latest information about your campaigns
            and activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Bell}
            title="Total Notifications"
            value={notifications.length}
            subtitle="All notifications"
            variant="primary"
          />
          <StatCard
            icon={Check}
            title="Unread"
            value={unreadNotifications.length}
            subtitle="Require attention"
            variant="warning"
          />
          <StatCard
            icon={Target}
            title="Campaign Updates"
            value={
              notifications.filter(
                (n) =>
                  n.target_type === "NewCampaign" ||
                  n.target_type === "Fundraisers",
              ).length
            }
            subtitle="Campaign related"
            variant="success"
          />
          <StatCard
            icon={Users}
            title="System Updates"
            value={
              notifications.filter((n) => n.target_type === "AllUsers").length
            }
            subtitle="Platform announcements"
            variant="default"
          />
        </div>

        {/* Subscription Card */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                    Newsletter Subscription
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {isSubscribed
                      ? "You'll receive notifications for new campaigns and important updates"
                      : "Get notifications about new campaigns and important updates directly to your account"}
                  </p>
                </div>
              </div>
              <Button
                onClick={toggleSubscription}
                disabled={subscribing}
                variant={isSubscribed ? "outline" : "default"}
                className={`min-w-[140px] ${
                  isSubscribed
                    ? "border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    : ""
                }`}
              >
                {subscribing ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <BellOff className="w-4 h-4 mr-2" />
                    Unsubscribe
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "unread"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Unread ({unreadNotifications.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "read"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Read ({readNotifications.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              {activeTab === "unread"
                ? "Unread Notifications"
                : "Read Notifications"}
            </CardTitle>
            <CardDescription>
              {activeTab === "unread"
                ? "Notifications that require your attention"
                : "Previously read notifications"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {displayNotifications.length > 0 ? (
              <div>
                {displayNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-6 transition-all duration-200 hover:bg-neutral-50/50 ${
                      index !== displayNotifications.length - 1
                        ? "border-b border-neutral-100"
                        : ""
                    } ${
                      !notification.marked_as_read ? "bg-primary-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          notification.marked_as_read
                            ? "bg-neutral-100"
                            : "bg-white shadow-sm"
                        }`}
                      >
                        {getNotificationIcon(notification.target_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-800 truncate">
                            {notification.title}
                          </h3>
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full whitespace-nowrap">
                            {getNotificationTypeText(notification.target_type)}
                          </span>
                          {!notification.marked_as_read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-neutral-600 leading-relaxed mb-3">
                          {notification.content}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {new Date(notification.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Only show for non-AllUsers notifications */}
                    {notification.target_type !== "AllUsers" && (
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.marked_as_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {activeTab === "unread" ? (
                      <Bell className="w-8 h-8 text-primary-600" />
                    ) : (
                      <Check className="w-8 h-8 text-primary-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    {activeTab === "unread"
                      ? "No Unread Notifications"
                      : "No Read Notifications"}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {activeTab === "unread"
                      ? "All caught up! We'll notify you when there are new updates."
                      : "No notifications have been marked as read yet."}
                  </p>
                  {activeTab === "unread" && (
                    <Button
                      variant="ghost"
                      onClick={fetchNotifications}
                      className="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-300"
                    >
                      Refresh Notifications
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
