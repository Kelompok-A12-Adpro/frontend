"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

export default function UnauthorizedPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.jpg')" }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-600" />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-neutral-800">
              Access Denied
            </h1>
            <p className="text-body text-neutral-600 max-w-sm">
              {
                "You don't have permission to access this page. Please check your credentials or contact support if you believe this is an error."
              }
            </p>
          </div>

          {/* Action Buttons */}
          <Button asChild className="w-full">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
