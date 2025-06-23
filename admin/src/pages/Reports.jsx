import OpenReportsTable from '../components/OpenReportsTable';
import Pagination from '../components/Pagination';
import { useState, useEffect } from 'react';
import { getAllReports } from '../services/reportService'; // <-- You need to implement this service
import Loader from '../components/Loader';

const Reports = () => {
	const [reports, setReports] = useState([]);
	const [filteredReports, setFilteredReports] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchReports = async (page) => {
		setIsLoading(true);
		try {
			const data = await getAllReports(page, 'open');
			setReports(data.reports);
			setFilteredReports(data.reports);
			setTotalPages(data.total);
			console.log('Reports data: ', totalPages);
		} catch (error) {
			console.error('Error fetching reports:', error);
			setError(error.message || 'Failed to fetch reports');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchReports(page);
	}, [page]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
				<Loader isLoading={isLoading} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<>
			<OpenReportsTable reports={filteredReports} />
			<Pagination totalPages={totalPages} pageSize={10} />
		</>
	);
};

export default Reports;
