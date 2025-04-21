import CardDataStats from '../components/CardDataStats';
import GraphChart from '../components/Charts/GraphChart';
import ColumnChart from '../components/Charts/ColumnChart';
import approx from 'approximate-number';
import { GrGroup } from 'react-icons/gr';
import { IoBusinessOutline } from 'react-icons/io5';
import { FaExchangeAlt } from 'react-icons/fa';
import { GrSync } from 'react-icons/gr';
import { useEffect, useState, useRef } from 'react';
import Loader from '../components/Loader';
import { analytics } from '../services/adminServices';

const ECommerce = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [analyticsData, setAnalyticsData] = useState({
		numCustomers: 0,
		numBusinesses: 0,
		numTransactions: 0,
		numActiveTransactions: 0,
		transactionsByMonth: [],
		oneYearAgo: new Date(),
		now: new Date(),
		transactionsThisWeek: [],
		transactionsLastWeek: [],
	});
	const hasFetched = useRef(false);

	const getAnalytics = async () => {
		setIsLoading(true);
		try {
			const data = await analytics();
			console.log('Analytics data:', data);
			setAnalyticsData(data.analytics);
		} catch (error) {
			console.error('Error fetching analytics:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!hasFetched.current) {
			hasFetched.current = true;
			getAnalytics();
		}
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
				<Loader isLoading={isLoading} />
			</div>
		);
	}
	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
				<CardDataStats
					title="Total Customers"
					total={approx(analyticsData.numCustomers, {
						capital: true,
					})}
				>
					<GrGroup className="text-primary dark:text-white" />
				</CardDataStats>
				<CardDataStats
					title="Total Businesses"
					total={approx(analyticsData.numBusinesses, {
						capital: true,
					})}
				>
					<IoBusinessOutline className="text-primary dark:text-white" />
				</CardDataStats>
				<CardDataStats
					title="Total transactions"
					total={approx(analyticsData.numTransactions, {
						capital: true,
					})}
				>
					<FaExchangeAlt className="text-primary dark:text-white" />
				</CardDataStats>
				<CardDataStats
					title="Active Transactions"
					total={approx(analyticsData.numActiveTransactions, {
						capital: true,
					})}
				>
					<GrSync className="text-primary dark:text-white" />
				</CardDataStats>
			</div>

			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<GraphChart analyticsData={analyticsData} />
				<ColumnChart analyticsData={analyticsData} />
				{/* Maybe add later: <PieChart />*/}
			</div>
		</>
	);
};

export default ECommerce;
