import { useEffect, useState } from 'react';
import Paging from './Paging';
import ProfileReportCard from './ProfileReportCard';

const ProfileReports = ({ reports }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 4;

	useEffect(() => {
		setCurrentPage(1);
	}, [reports]);

	const currentReports = reports.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<div className="space-y-3 bg-white dark:bg-black pt-2 pl-4 pr-4 pb-5">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold ">Reports Handled</h2>
					<div className="text-sm ">
						Total: {reports.length} reports
					</div>
				</div>

				<div className="space-y-4 ">
					{currentReports.map((report) => (
						<ProfileReportCard key={report._id} report={report} />
					))}
				</div>
			</div>

			<Paging
				totalItems={reports.length}
				itemsPerPage={itemsPerPage}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</>
	);
};

export default ProfileReports;
