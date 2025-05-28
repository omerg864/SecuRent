import { useEffect, useState } from 'react';
import { User, Edit3, FileText } from 'lucide-react';
import {
	getAdminByEmail,
	getAllResolvedReportsByAdminId,
} from '../services/adminServices';
import ProfileEdit from '../components/ProfileEdit';
import ProfileReports from '../components/ProfileReports';
import ProfileInfo from '../components/ProfileInfo';
import NavigationTabs from '../components/NavigationTabs';
import Loader from '../components/Loader';

const tabs = [
	{ id: 'profile', label: 'Info', icon: User },
	{ id: 'edit', label: 'Edit Profile', icon: Edit3 },
	{ id: 'reports', label: 'Reports', icon: FileText },
];

const ProfilePage = () => {
	const [activeTab, setActiveTab] = useState('profile');
	const [isLoading, setIsLoading] = useState(false);
	const [resolvedReports, setResolvedReports] = useState([]);
	const [adminData, setAdminData] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const email = JSON.parse(localStorage.getItem('user'))?.email;
				const { admin } = await getAdminByEmail(email);
				setAdminData(admin);

				const { reports } = await getAllResolvedReportsByAdminId(
					admin._id
				);
				setResolvedReports(reports);
			} catch (err) {
				console.error('Error fetching data:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const renderTabContent = {
		profile: (
			<ProfileInfo
				adminData={adminData}
				reportsResolved={resolvedReports.length}
			/>
		),
		edit: <ProfileEdit adminData={adminData} onSave={setAdminData} />,
		reports: <ProfileReports reports={resolvedReports} />,
	}[activeTab];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
				<Loader isLoading={isLoading} />
			</div>
		);
	}

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<NavigationTabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>
				<div className=" rounded-lg shadow-sm p-6">
					{renderTabContent}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
