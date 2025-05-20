import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
	Building2,
	Mail,
	Phone,
	MapPin,
	BriefcaseBusiness,
	CreditCard,
	Award,
	CheckCircle,
} from 'lucide-react';
import StarRating from './StarRating';

export function UserInfoCard({ accountType, account }) {
	console.log('Business Info Card:', account);

	if (!account) {
		return <div>Business not found</div>;
	}
	return (
		<Card className="h-full">
			<CardHeader className="pb-2 flex flex-row items-center gap-4">
				<img
					src={
						account?.image ||
						`../../public/${
							accountType === 'Business'
								? 'business-icon.png'
								: 'avatar.png'
						}`
					}
					alt="Business Logo"
					className="w-12 h-12 rounded-full object-cover"
				/>
				<CardTitle className="text-xl">{account.name}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{accountType === 'Business' && (
					<div className="flex items-start gap-3">
						<Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">Category</p>
							<p className="text-sm text-muted-foreground">
								{account.category[0] || 'None'}
							</p>
						</div>
					</div>
				)}

				<div className="flex items-start gap-3">
					<Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p className="font-medium">Email</p>
						<p className="text-sm text-muted-foreground">
							{account.email}
						</p>
					</div>
				</div>

				<div className="flex items-start gap-3">
					<Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p className="font-medium">Phone</p>
						<p className="text-sm text-muted-foreground">
							{account?.phone || 'None'}
						</p>
					</div>
				</div>

				{accountType === 'Business' && (
					<div className="flex items-start gap-3">
						<MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">Address</p>
							<p className="text-sm text-muted-foreground">
								{account?.address || 'None'}
							</p>
						</div>
					</div>
				)}

				{accountType === 'Business' && (
					<div className="flex items-start gap-3">
						<BriefcaseBusiness className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">Company Number</p>
							<p className="text-sm text-muted-foreground">
								{account?.companyNumber || 'None'}
							</p>
						</div>
					</div>
				)}

				{accountType === 'Business' && (
					<div className="flex items-start gap-3">
						<CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">Currency</p>
							<p className="text-sm text-muted-foreground">
								{account?.currency || 'None'}
							</p>
						</div>
					</div>
				)}

				{accountType === 'Business' && (
					<div className="flex items-start gap-3">
						<Award className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5 text-yellow-500" />
						<div>
							<p className="font-medium">Rating</p>
							<div className="flex items-center">
								<p className="text-sm text-muted-foreground mr-2">
									{Number(
										account?.rating?.overall ?? 0
									).toFixed(1)}
								</p>

								<StarRating
									rating={account?.rating?.overall || 0}
									size={18}
								/>
							</div>
						</div>
					</div>
				)}

				{accountType === 'Customer' && (
					<div className="flex items-start gap-3">
						<CheckCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<p className="font-medium">Valid</p>
							<p
								className={`text-sm ${
									account?.isValid
										? 'text-green-500'
										: 'text-red-500'
								}`}
							>
								{account?.isValid ? 'Valid' : 'Invalid'}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
