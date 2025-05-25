"use client";

import { useProfile } from "@/hooks/useProfile";
import ProfileCard from "@/components/organisms/ProfileCard";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Link from "next/link";
import { Loader2, AlertCircle, UserX, Edit } from "lucide-react";

export default function MyProfile() {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-body text-neutral-700">
              Loading your profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-body text-red-700 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
            <UserX className="h-12 w-12 text-neutral-500" />
            <div className="text-center space-y-2">
              <p className="text-h5 font-semibold text-neutral-800">
                No Profile Found
              </p>
              <p className="text-body text-neutral-600">
                Create your profile to get started.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link
                href="/profile/edit"
                className="flex items-center justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Create Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <ProfileCard data={profile} />

      {/* Floating Edit Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          asChild
        >
          <Link href="/profile/edit" className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span className="hidden sm:inline">Edit Profile</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
