"use client";

import { useProfile } from "@/hooks/useProfile";
import ProfileForm from "@/components/organisms/ProfileForm";
import { Card, CardContent } from "@/components/atoms/Card";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditProfile() {
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

  return <ProfileForm initial={profile ?? {}} />;
}
