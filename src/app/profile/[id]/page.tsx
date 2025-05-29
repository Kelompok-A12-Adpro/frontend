"use client";

import { useProfile } from "@/hooks/useProfile";
import ProfileCard from "@/components/organisms/ProfileCard";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/atoms/Card";
import { Loader2, AlertCircle, UserX } from "lucide-react";

export default function PublicProfile() {
  const params = useParams<{ id: string }>();
  const { profile, loading, error } = useProfile(Number(params.id));

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-body text-neutral-700">Loading profile...</p>
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
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <UserX className="h-8 w-8 text-neutral-500" />
            <p className="text-body text-neutral-700 text-center">
              Profile not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProfileCard data={profile} />;
}
