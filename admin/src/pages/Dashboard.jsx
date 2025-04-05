import CardDataStats from '../components/CardDataStats';
import GraphChart from '../components/Charts/GraphChart';
import ColumnChart from '../components/Charts/ColumnChart';
import PieChart from '../components/Charts/PieChart';
import approx from 'approximate-number';
import { GrGroup } from 'react-icons/gr';
import { IoBusinessOutline } from 'react-icons/io5';
import { FaExchangeAlt } from "react-icons/fa";
import { GrSync } from "react-icons/gr";

const ECommerce = () => {
	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
				<CardDataStats
					title="Total Customers"
					total={approx(3456, { capital: true })}
				>
					<GrGroup className="text-primary dark:text-white" />
				</CardDataStats>
				<CardDataStats
					title="Total Businesses"
					total={approx(1234, { capital: true })}
				>
					<IoBusinessOutline className="text-primary dark:text-white" />
				</CardDataStats>
				<CardDataStats
					title="Total transactions"
					total={approx(160000, { capital: true })}
				>
					<FaExchangeAlt className="text-primary dark:text-white" />
					
				</CardDataStats>
				<CardDataStats
					title="Active Transactions"
					total={approx(1234, { capital: true })}
				>
					<GrSync className="text-primary dark:text-white" />
				</CardDataStats>
			</div>

			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<GraphChart />
				<ColumnChart />
				<PieChart />
			</div>
		</>
	);
};

export default ECommerce;
