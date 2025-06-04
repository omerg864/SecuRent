import { User, Mail, Calendar, CheckCircle } from 'lucide-react';
import ProfileImage from './ProfileImage';

const ProfileInfo = ({ adminData, reportsResolved, isLoggedUser }) => {
	return (
		<div className="max-w mx-auto p-6 bg-white dark:bg-black rounded-xl shadow space-y-10">
			<div className="text-center space-y-4">
				<h3 className="text-2xl font-semibold">
					{isLoggedUser ? 'Hey' : ''} {adminData.name}{' '}
				</h3>
				<ProfileImage
					imagePreview={adminData.image}
					isEditing={false}
					showControls={false}
				/>
			</div>

			{/* Personal Information */}
			<div className="space-y-6">
				<h3 className="text-xl font-medium border-b pb-2">
					{isLoggedUser ? 'Your Information' : 'Info'}
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{[
						{
							icon: User,
							label: 'Name',
							value: adminData.name,
						},
						{
							icon: Mail,
							label: 'Email',
							value: adminData.email,
						},
						{
							icon: Calendar,
							label: 'Join Date',
							value: new Date(
								adminData.createdAt
							).toLocaleDateString(),
						},
						{
							icon: CheckCircle,
							label: 'Reports Resolved',
							value: reportsResolved,
						},
					].map(({ icon: Icon, label, value }) => (
						<div key={label} className="flex items-start space-x-4">
							<Icon className="w-6 h-6 mt-1" />
							<div>
								<p className="text-sm font-semibold">{label}</p>
								<p className="text-base">{value}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;
