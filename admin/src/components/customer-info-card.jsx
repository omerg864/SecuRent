import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  UserCircle2,
  CheckCircle,
  ShieldX,
} from "lucide-react";

export function CustomerInfoCard({ customer }) {
  console.log("Customer Info Card:", customer);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <img
          src={customer?.image || "../../public/customer-icon.png"}
          alt="Customer Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <CardTitle className="text-xl">{customer.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">
              {customer?.phone || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-muted-foreground">
              {customer?.address || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Currency</p>
            <p className="text-sm text-muted-foreground">
              {customer?.currency || "None"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldX className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Suspended</p>
            <p
              className={`text-sm ${
                customer?.suspended ? "text-red-500" : "text-green-500"
              }`}
            >
              {customer?.suspended ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Valid</p>
            <p
              className={`text-sm ${
                customer?.isValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {customer?.isValid ? "Valid" : "Invalid"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
