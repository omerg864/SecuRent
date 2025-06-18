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
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
	const location = useLocation();
	const stateEmail = location.state?.email;
	const [activeTab, setActiveTab] = useState('profile');
	const [isLoading, setIsLoading] = useState(false);
	const [resolvedReports, setResolvedReports] = useState([]);
	const [adminData, setAdminData] = useState({});
	const [loggedUserEmail, setLoggedUserEmail] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const loggedUser = JSON.parse(localStorage.getItem('user'));
				setLoggedUserEmail(loggedUser?.email);
				const { admin } = await getAdminByEmail(stateEmail);
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
	}, [loggedUserEmail, stateEmail]);

	// Rest of your component remains the same...
	const tabs = [
		{ id: 'profile', label: 'Info', icon: User },
		...(loggedUserEmail === stateEmail
			? [{ id: 'edit', label: 'Edit Profile', icon: Edit3 }]
			: []),
		{ id: 'reports', label: 'Reports', icon: FileText },
	];

	const renderTabContent = {
		profile: (
			<ProfileInfo
				adminData={adminData}
				reportsResolved={resolvedReports.length}
				isLoggedUser={loggedUserEmail === stateEmail}
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
					loginUserPage={stateEmail ? false : false}
				/>
				<div className=" rounded-lg shadow-sm p-6">
					{renderTabContent}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
