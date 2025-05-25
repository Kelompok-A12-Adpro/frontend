import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Profile } from "@/hooks/useProfile";
import {
  User,
  Mail,
  Phone,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface Props {
  data: Profile;
}

export default function ProfileCard({ data }: Props) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('/Background.jpg')" }}
    >
      <Card className="w-full max-w-2xl backdrop-blur-sm bg-white/70 shadow-lg">
        <CardHeader className="space-y-4 pb-6">
          <CardTitle className="text-h3 text-center text-neutral-800">
            {data.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Mail className="w-5 h-5 text-primary-600" />
              <span className="text-body text-neutral-700">{data.email}</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <Phone className="w-5 h-5 text-primary-600" />
              <span className="text-body text-neutral-700">{data.phone}</span>
            </div>
          </div>

          {data.bio && (
            <div className="p-4 bg-white/50 rounded-lg">
              <h3 className="text-h5 font-semibold text-neutral-800 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                About
              </h3>
              <p className="text-body text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          {data.campaigns?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-h4 font-semibold text-neutral-800 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary-600" />
                Fundraising Campaigns
              </h3>

              <div className="space-y-4">
                {data.campaigns.map((c) => (
                  <Card
                    key={c.id}
                    className="bg-white/60 border border-white/20 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-h5 font-semibold text-neutral-800 mb-2">
                            {c.name}
                          </h4>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-neutral-500" />
                              <span className="text-small text-neutral-600">
                                Target:{" "}
                                <span className="font-semibold">
                                  Rp{c.target_amount.toLocaleString()}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-small text-neutral-600">
                                Collected:{" "}
                                <span className="font-semibold text-green-700">
                                  Rp{c.collected_amount.toLocaleString()}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CheckCircle
                            className={`w-4 h-4 ${
                              c.status === "active"
                                ? "text-green-600"
                                : c.status === "completed"
                                  ? "text-blue-600"
                                  : "text-neutral-500"
                            }`}
                          />
                          <span
                            className={`text-small font-medium capitalize px-2 py-1 rounded-full ${
                              c.status === "active"
                                ? "bg-green-100 text-green-800"
                                : c.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((c.collected_amount / c.target_amount) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>

                      <div className="text-right">
                        <span className="text-small text-neutral-600">
                          {Math.round(
                            (c.collected_amount / c.target_amount) * 100,
                          )}
                          % funded
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
