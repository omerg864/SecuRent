import { Link } from 'react-router-dom';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';
import { Card } from './card';
import { useEffect, useState } from 'react';
import Paging from './Paging';

const ReportsTable = ({ accountType, reports }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [reportsPerPage] = useState(5);

	useEffect(() => {
		setCurrentPage(1);
	}, [reports]);
	if (!reports || reports.length === 0) {
		return <p className="text-muted-foreground">No reports yet.</p>;
	}

	const indexOfLastReport = currentPage * reportsPerPage;
	const indexOfFirstReport = indexOfLastReport - reportsPerPage;
	const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

	return (
		<Card>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/4">
								{accountType === 'Business'
									? 'Customer'
									: 'Business'}
							</TableHead>
							<TableHead className="w-1/4">Title</TableHead>
							<TableHead className="w-1/5">Status</TableHead>
							<TableHead className="w-1/5">Resolved By</TableHead>
							<TableHead className="w-1/5">Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentReports.map((report) => (
							<TableRow
								key={report._id}
								className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
							>
								<Link
									to={`/report/${report._id}`}
									state={report}
									className="contents"
								>
									<TableCell className="font-medium flex items-center gap-2 whitespace-nowrap">
										<img
											src={
												accountType === 'Business'
													? report.customer?.image ||
													  '/admin/public/avatar.png'
													: report.business?.image ||
													  `/admin/public/business-icon.png`
											}
											alt={
												accountType === 'Business'
													? report.customer?.name ||
													  'Customer'
													: report.business?.name ||
													  'Business'
											}
											className="w-6 h-6 rounded-full"
											onError={(e) => {
												if (
													e.currentTarget.src !==
													window.location.origin +
														'/avatar.png'
												) {
													e.currentTarget.src =
														'/avatar.png';
												}
											}}
										/>
										{accountType === 'Business'
											? report.customer?.name || '—'
											: report.business?.name || '—'}
									</TableCell>

									<TableCell>{report.title}</TableCell>
									<TableCell>
										<span
											className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                                                ${
													report.status === 'resolved'
														? 'bg-green-100 text-green-800'
														: 'bg-yellow-100 text-yellow-800'
												}
                                            `}
										>
											{report.status}
										</span>
									</TableCell>
									<TableCell>
										{report.resolutionBy?.name || '—'}
									</TableCell>
									<TableCell>
										{new Date(
											report.createdAt
										).toLocaleDateString('en-GB')}
									</TableCell>
								</Link>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{reports.length > 0 && (
				<Paging
					totalItems={reports.length}
					itemsPerPage={reportsPerPage}
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
				/>
			)}
		</Card>
	);
};
export default ReportsTable;
