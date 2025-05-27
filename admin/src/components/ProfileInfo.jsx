import { User, Mail, Calendar, CheckCircle } from 'lucide-react';

const ProfileInfo = ({ adminData, isLoading, reportsResolved }) => {
	if (isLoading) {
		console.log('Admin Data: ', adminData);
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black rounded-xl shadow space-y-10">
			<div className="text-center space-y-4">
				<h3 className="text-2xl font-semibold">
					Hey {adminData.name}!
				</h3>
				<div className="w-28 h-28 rounded-full overflow-hidden border mx-auto">
					<img
						src={adminData.image ? adminData.image : './avatar.png'}
						alt="Profile"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Personal Information */}
			<div className="space-y-6">
				<h3 className="text-xl font-medium border-b pb-2">
					Your Information
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
