import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { getReportById, resolveReport } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/functions';

export default function SingleReport() {
	const { id } = useParams();

	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [resolutionText, setResolutionText] = useState('');
	const [resolving, setResolving] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		const fetchReport = async () => {
			setLoading(true);
			try {
				const data = await getReportById(id);
				setReport(data);
			} catch (error) {
				console.error('Error fetching report:', error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchReport();
	}, [id]);

	const handleResolve = async () => {
		setResolving(true);
		try {
			const response = await resolveReport(
				'resolved',
				resolutionText,
				id
			);
			if (response) {
				setReport((prev) => ({
					...prev,
					status: 'resolved',
					resolution: resolutionText,
					resolvedAt: new Date().toISOString(),
					resolutionBy: {
						name: user.name,
						email: user.email,
					},
				}));
				setResolutionText('');
			}
		} catch (error) {
			console.error('Error resolving report:', error);
		} finally {
			setResolving(false);
		}
	};

	const navigate = useNavigate();
	const handleAdminClick = () => {
		navigate('/profile', { state: { email: report.resolutionBy.email } });
	};

	if (loading || !report) {
		return <Loader />;
	}
	return (
		<main className="container mx-auto px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Report Details:
				</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-1 space-y-4">
					<Link
						to={`/business/${report.business._id}`}
						className="block"
					>
						<div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
							<h2 className="text-xl font-semibold mb-2">
								Business
							</h2>
							<div className="flex items-center gap-3">
								<img
									src={
										report.business.image ||
										'/business-icon.png'
									}
									alt={report.business.name}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<span className="font-medium">
									{report.business.name}
								</span>
							</div>
						</div>
					</Link>

					<Link
						to={`/customer/${report.customer._id}`}
						className="block"
					>
						<div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
							<h2 className="text-xl font-semibold mb-2">
								Customer
							</h2>
							<div className="flex items-center gap-3">
								<img
									src={report.customer.image || '/avatar.png'}
									alt={report.customer.name}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<span className="font-medium">
									{report.customer.name}
								</span>
							</div>
						</div>
					</Link>
				</div>

				<div className="lg:col-span-2 space-y-6">
					<div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h3 className="text-lg font-medium mb-2 text-muted-foreground">
							Title:
						</h3>
						<h2 className="text-2xl font-semibold mb-4">
							{report.title || 'No title provided.'}
						</h2>

						<h3 className="text-lg font-medium mb-2 text-muted-foreground">
							Content:
						</h3>
						<p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
							{report.content || 'No content provided.'}
						</p>

						<div className="mt-6">
							<h3 className="text-lg font-medium mb-2">Images</h3>
							{report.images?.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{report.images.map((imgUrl, index) => (
										<img
											key={index}
											src={imgUrl}
											alt={`Report image ${index + 1}`}
											className="w-full h-48 object-cover rounded-md"
										/>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">
									No images provided.
								</p>
							)}
						</div>

						<div className="mt-6">
							<h3 className="text-lg font-medium mb-1">
								Report Date:
							</h3>
							<p className="text-sm text-muted-foreground">
								{formatDate(report.createdAt)}
							</p>

							{report.status === 'resolved' &&
								report.resolvedAt && (
									<div className="mt-2">
										<h3 className="text-lg font-medium mb-1">
											Resolved Date:
										</h3>
										<p className="text-sm text-muted-foreground">
											{formatDate(report.resolvedAt)}
										</p>
									</div>
								)}
						</div>
					</div>

					<div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h3 className="text-lg font-medium mb-2">Status</h3>
						<p
							className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
								report.status === 'open'
									? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
									: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
							}`}
						>
							{report.status}
						</p>

						{report.status === 'open' ? (
							<div className="mt-4 space-y-3">
								<textarea
									rows={4}
									value={resolutionText}
									onChange={(e) =>
										setResolutionText(e.target.value)
									}
									className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 text-sm dark:bg-gray-800 dark:text-white"
									placeholder="Describe how the issue was resolved..."
								/>
								<button
									onClick={handleResolve}
									disabled={resolving || !resolutionText}
									className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
								>
									{resolving ? 'Resolving...' : 'Resolve'}
								</button>
							</div>
						) : (
							<div className="mt-4 space-y-2">
								<div className="flex items-center gap-3">
									<span className="text-sm font-medium flex items-center gap-2">
										Resolved by :
										<img
											src={
												report.resolutionBy?.image ||
												'/avatar.png'
											}
											className="h-8 w-8 rounded-full"
										></img>
										<button
											onClick={handleAdminClick}
											className="text-blue-600 hover:underline dark:text-blue-400"
										>
											{report.resolutionBy.name}
										</button>
									</span>
								</div>
								{report.resolution && (
									<div>
										<h4 className="text-sm font-semibold">
											Resolution:
										</h4>
										<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
											{report.resolution}
										</p>
									</div>
								)}
								{report.resolutionDate && (
									<div>
										<h4 className="text-sm font-semibold">
											Resolved At:
										</h4>
										<p className="text-sm text-muted-foreground">
											{formatDate(report.resolutionDate)}
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
