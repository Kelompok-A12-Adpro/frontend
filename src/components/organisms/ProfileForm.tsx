import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProfile } from "@/hooks/useProfile";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Alert, AlertDescription } from "@/components/molecules/Alert";
import { Loader2, User, Phone, FileText, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ProfileFormProps {
  initial?: Partial<FormValues>;
}

export default function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      phone: initial?.phone ?? "",
      bio: initial?.bio ?? "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      console.log("valid form data", data);
      await saveProfile(data);
      router.push("/profile");
    } catch (e) {
      console.error("Failed to save", e);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.jpg')" }}
    >
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/70 shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <CardTitle className="text-h4 text-center text-neutral-800">
            Edit Profile
          </CardTitle>
          <CardDescription className="text-small text-center text-neutral-500">
            Update your personal information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-neutral-50">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-small flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className="text-body bg-neutral-50"
                />
                {errors.name && (
                  <p className="text-small text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-small flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary-600" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phone")}
                  className="text-body bg-neutral-50"
                />
                {errors.phone && (
                  <p className="text-small text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-small flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-primary-600" />
                  Bio (Optional)
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  {...register("bio")}
                  rows={4}
                  className="w-full px-3 py-2 text-body bg-neutral-50 border border-neutral-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
                {errors.bio && (
                  <p className="text-small text-red-600">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link
                    href="/profile"
                    className="flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Link>
                </Button>

                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
