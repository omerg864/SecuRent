import { Link } from 'react-router-dom';

const BusinessesTable = ({ businesses }) => {
	return (
		<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
			<h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
				Businesses
			</h4>

			<div className="flex flex-col">
				<div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
					<div className="p-2.5 xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Name
						</h5>
					</div>
					<div className="hidden p-2.5 text-center sm:block xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Category
						</h5>
					</div>
					<div className="p-2.5 text-center xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Transactions
						</h5>
					</div>
					<div className="p-2.5 text-center xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Charges
						</h5>
					</div>
				</div>

				{businesses.map((business, key) => (
					<Link
						to={`/business/${business._id}`}
						state={business}
						key={business._id}
						className={`grid grid-cols-3 sm:grid-cols-4 items-center hover:bg-gray-2 dark:hover:bg-meta-4 ${
							key === businesses.length - 1
								? ''
								: 'border-b border-stroke dark:border-strokedark'
						} p-2.5 xl:p-5`}
					>
						{/* Name */}
						<div className="flex items-center gap-3">
							<div className="flex-shrink-0 hidden sm:block">
								<img
									className="h-8 w-8 rounded-full"
									src={business.image || './business-icon.png'}
									alt="Brand"
								/>
							</div>
							<p className="text-black dark:text-white">
								{business.name}
							</p>
						</div>

						{/* Category */}
						<div className="hidden items-center justify-center sm:flex">
							<p className="text-black dark:text-white">
								{business.category?.[0] || 'No Category'}
							</p>
						</div>

						{/* Transactions */}
						<div className="flex items-center justify-center">
							<p className="text-black dark:text-white">
								{business.transactionCount}
							</p>
						</div>

						{/* Charges */}
						<div className="flex items-center justify-center">
							<p className="text-meta-3">
								{business.chargedTransactionCount}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default BusinessesTable;
