"use client";

import React from "react";
import { Heart, ArrowRight, Shield, Target, Users } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/organisms/Navbar";
import { Button } from "@/components/atoms/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Footer from "@/components/organisms/Footer";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="group hover:shadow-lg hover:border-primary-200 transition-all bg-pink-200 duration-300">
      <CardHeader>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Donations",
      description:
        "Your donations are protected with bank-level security and transparent tracking.",
    },
    {
      icon: Target,
      title: "Targeted Campaigns",
      description:
        "Create and discover campaigns that matter to you with precise targeting tools.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a community of changemakers working together to make a difference.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Making a Difference Together</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Help the Future,{" "}
              <span className="text-pink-400">One Campaign</span> at a Time
            </h1>

            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect passionate donors with meaningful causes. Create,
              discover, and support campaigns that drive real change in
              communities worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/campaigns" passHref>
                <Button className="inline-flex items-center gap-2">
                  Start a Campaign
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/campaigns" passHref>
                <Button
                  variant="ghost"
                  className="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-300"
                >
                  Explore Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose GatherLove?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We provide the tools and platform you need to make a meaningful
              impact through secure, transparent fundraising.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of donors and campaigners creating positive change
            every day.
          </p>
          <Link href="/campaigns" passHref>
            <Button className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-neutral-50">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
