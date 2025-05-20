import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getCustomerById } from '../services/customerService';
import {
	getCustomerTransactions,
	getCustomerReviews,
	getCustomerReports,
} from '../services/adminServices';
import Loader from '../components/Loader';
import SuspensionButton from '../components/SuspensionButton.jsx';
import { UserInfoCard } from '../components/UserInfoCard.jsx';
import { TransactionsTable } from '../components/TransactionsTable.jsx';
import { ReviewsTable } from '../components/ReviewsTable.jsx';
import ReportsTable from '../components/ReportsTable.jsx';

export default function SingleCustomer() {
	const location = useLocation();
	const locationCustomer = location.state;
	const { id } = useParams();

	const [customer, setCustomer] = useState(locationCustomer || null);
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [reports, setReports] = useState([]);

	useEffect(() => {
		const fetchCustomer = async () => {
			if (!locationCustomer && id) {
				try {
					const fetchedCustomer = await getCustomerById(id);
					setCustomer(fetchedCustomer);
				} catch (error) {
					console.error('Error fetching customer:', error);
				}
			}
		};
		fetchCustomer();
	}, [locationCustomer, id]);

	useEffect(() => {
		const fetchData = async () => {
			if (customer?._id) {
				setLoading(true);
				try {
					const [txRes, revRes, repRes] = await Promise.all([
						getCustomerTransactions(customer._id),
						getCustomerReviews(customer._id),
						getCustomerReports(customer._id),
					]);
					setTransactions(txRes.transactions);
					setReviews(revRes.reviews);
					setReports(repRes.reports);
				} catch (err) {
					console.error('Error fetching customer data:', err);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchData();
	}, [customer]);

	return (
		<main className="container mx-auto px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Customer Details:
				</h1>
				<div className="flex items-center gap-4">
					{customer?.suspended && (
						<div className="flex items-center gap-2 text-red-600 dark:text-red-400">
							<div className="text-4xl leading-none">⚠️</div>
							<p className="text-sm font-bold leading-tight">
								This customer is currently suspended.
								<br />
								New transactions are blocked.
							</p>
						</div>
					)}
					<SuspensionButton
						accountType="Customer"
						account={customer}
						onStatusChange={setCustomer}
					/>
				</div>
			</div>
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Loader />
				</div>
			) : customer ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
					{/* שמאל */}
					<div className="lg:col-span-1">
						<div className="h-full min-h-[400px] max-h-[500px] overflow-auto">
							<UserInfoCard
								accountType="Customer"
								account={customer}
							/>
						</div>
					</div>

					{/* ימין */}
					<div className="lg:col-span-2 space-y-8">
						<section>
							<h2 className="text-2xl font-semibold mb-4">
								Transactions
							</h2>
							<TransactionsTable
								accountType="Customer"
								transactions={transactions}
								currency={customer.currency}
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								Reviews
							</h2>
							<ReviewsTable
								accountType="Customer"
								reviews={reviews}
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-4">
								Reports
							</h2>
							<ReportsTable
								accountType="Customer"
								reports={reports}
							/>
						</section>
					</div>
				</div>
			) : (
				<Loader />
			)}
		</main>
	);
}
