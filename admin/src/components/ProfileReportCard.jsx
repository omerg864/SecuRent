import { CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/functions';
import { Link } from 'react-router-dom';

const AvatarInfo = ({ label, image, name }) => (
	<div>
		<p className="font-medium">{label}</p>
		<p className=" flex items-center gap-2 mt-4">
			<img className="h-5 w-5 rounded-full" src={image} alt={label} />
			{name}
		</p>
	</div>
);

const ProfileReportCard = ({ report }) => (
	<Link to={`/report/${report._id}`}>
		<div className="border border-blue-900 dark:border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-2 bg-white dark:bg-black ">
			<div className="flex items-start justify-between mb-2">
				<div className="flex-1">
					<div className="flex items-center space-x-3 mb-2">
						<CheckCircle className="w-4 h-4 text-green-500 dark:text-white" />
						<h3 className="text-lg font-semibold">
							{report.title}
						</h3>
					</div>
					<p className=" mb-3">{report.description}</p>
				</div>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				<AvatarInfo
					label="Business:"
					image={report.business.image || './business-icon.png'}
					name={report.business.name}
				/>
				<AvatarInfo
					label="Reported By:"
					image={report.customer.image || './avatar.png'}
					name={report.customer.name}
				/>
				<div>
					<p className="font-medium">Reported At:</p>
					<p className=" mt-4">{formatDate(report.createdAt)}</p>
				</div>
				<div>
					<p className="font-medium">Resolved At:</p>
					<p className=" mt-4">{formatDate(report.resolutionDate)}</p>
				</div>
			</div>
		</div>
	</Link>
);

export default ProfileReportCard;
