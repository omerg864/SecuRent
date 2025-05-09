import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CreditCard,
  Award,
} from "lucide-react";

export function BusinessInfoCard({ business }) {
  console.log("Business Info Card:", business);

  if (!business) {
    return <div>Business not found</div>;
  }
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <img
          src={business?.image || "../../public/business-icon.png"}
          alt="Business Logo"
          className="w-12 h-12 rounded-full object-cover"
        />
      <CardTitle className="text-xl">{business.name}</CardTitle>
    </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Category</p>
            <p className="text-sm text-muted-foreground">
              {business.category[0] || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{business.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">
              {business?.phone || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-muted-foreground">
              {business?.address || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BriefcaseBusiness className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Company Number</p>
            <p className="text-sm text-muted-foreground">
              {business?.companyNumber || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Currency</p>
            <p className="text-sm text-muted-foreground">
              {business?.currency || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5 text-yellow-500" />
          <div>
            <p className="font-medium">Rating</p>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">
                {business?.rating?.overall}
              </p>
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Number.parseInt(business?.rating?.overall)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
