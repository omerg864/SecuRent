import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CreditCard,
  Award,
  CheckCircle,
  MonitorX,
  Activity,
} from "lucide-react";
import StarRating from "./StarRating";
import { useState } from "react";

export function UserInfoCard({ accountType, account }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const defaultImage =
    accountType === "Business" ? "business-icon.png" : "/avatar.png";

  const accountImage = account?.image || defaultImage;

  const handleImageClick = () => {
    if (accountImage == account.image) setIsOpenModal(true);
  };
  if (!account) {
    return <div>Business not found</div>;
  }

  const closeModal = () => {
    setIsOpenModal(false);
  };
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <img
          src={accountImage}
          alt="Profile Image"
          className="w-24 h-24 rounded-full object-cover"
          onClick={handleImageClick}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />

        <CardTitle className="text-xl">{account.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Category</p>
              <p className="text-sm text-muted-foreground">
                {account.category[0] || "None"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
        </div>
        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">
                {account?.phone || "None"}
              </p>
            </div>
          </div>
        )}

        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {account?.address || "None"}
              </p>
            </div>
          </div>
        )}

        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <BriefcaseBusiness className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Company Number</p>
              <p className="text-sm text-muted-foreground">
                {account?.companyNumber || "None"}
              </p>
            </div>
          </div>
        )}

        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">
                {account?.currency || "None"}
              </p>
            </div>
          </div>
        )}

        {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium">Rating</p>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground mr-2">
                  {Number(account?.rating?.overall ?? 0).toFixed(1)}
                </p>

                <StarRating rating={account?.rating?.overall || 0} size={18} />
              </div>
            </div>
          </div>
        )}
         {accountType === "Business" && (
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Activated</p>
              <p
                className={`text-sm ${
                  account?.activated ? "text-green-500" : "text-red-500"
                }`}
              >
                {account?.activated ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}
          <div className="flex items-start gap-3">
            <MonitorX className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Suspended</p>
              <p
                className={`text-sm ${
                  account?.suspended ? "text-red-500" : "text-green-500"
                }`}
              >
                {account?.suspended ? "Yes" : "No"}
              </p>
            </div>
          </div>
        {accountType === "Customer" && (
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Valid</p>
              <p
                className={`text-sm ${
                  account?.isValid ? "text-green-500" : "text-red-500"
                }`}
              >
                {account?.isValid ? "Valid" : "Invalid"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      {isOpenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative p-4 shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={account?.image}
              alt="Full Image"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
