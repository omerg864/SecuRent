import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    BriefcaseBusiness,
    CreditCard,
    Award
} from "lucide-react";
import StarRating from "./StarRating";

export function BusinessInfoCard({ business }) {
    console.log("Business Info Card:", business);

    if (!business) {
        return <div>Business not found</div>;
    }
    return (
        <Card className='h-full'>
            <CardHeader className='pb-2 flex flex-row items-center gap-4'>
                <img
                    src={business?.image || "../../public/business-icon.png"}
                    alt='Business Logo'
                    className='w-12 h-12 rounded-full object-cover'
                />
                <CardTitle className='text-xl'>{business.name}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-start gap-3'>
                    <Building2 className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Category</p>
                        <p className='text-sm text-muted-foreground'>
                            {business.category[0] || "None"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Mail className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Email</p>
                        <p className='text-sm text-muted-foreground'>
                            {business.email}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Phone className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Phone</p>
                        <p className='text-sm text-muted-foreground'>
                            {business?.phone || "None"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Address</p>
                        <p className='text-sm text-muted-foreground'>
                            {business?.address || "None"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <BriefcaseBusiness className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Company Number</p>
                        <p className='text-sm text-muted-foreground'>
                            {business?.companyNumber || "None"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <CreditCard className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5' />
                    <div>
                        <p className='font-medium'>Currency</p>
                        <p className='text-sm text-muted-foreground'>
                            {business?.currency || "None"}
                        </p>
                    </div>
                </div>

                <div className='flex items-start gap-3'>
                    <Award className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5 text-yellow-500' />
                    <div>
                        <p className='font-medium'>Rating</p>
                        <div className='flex items-center'>
                            <p className='text-sm text-muted-foreground'>
                                {Number(business?.rating?.overall ?? 0).toFixed(
                                    1
                                )}
                            </p>

                            <StarRating
                                rating={business?.rating?.overall || 0}
                                size={18}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
