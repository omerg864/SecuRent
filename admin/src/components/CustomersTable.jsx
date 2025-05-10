import { Link } from 'react-router-dom';

const CustomersTable = ({ customers }) => {
	return (
		<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
			<h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
				Customers
			</h4>

			<div className="flex flex-col">
				<div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
					<div className="p-2.5 xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Name
						</h5>
					</div>
					<div className="hidden p-2.5 text-center sm:block xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Email
						</h5>
					</div>
					<div className="p-2.5 text-center xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Suspended
						</h5>
					</div>
					<div className="p-2.5 text-center xl:p-5">
						<h5 className="text-sm font-medium uppercase xsm:text-base">
							Valid
						</h5>
					</div>
				</div>

				{customers.map((customer, key) => (
					<div
						className={`grid grid-cols-2 sm:grid-cols-4 ${
							key === customers.length - 1
								? ''
								: 'border-b border-stroke dark:border-strokedark'
						}`}
						key={customer._id}
					>
						<Link
							to={`/customer/${customer._id}`}
							state={customer}
							className="flex items-center gap-3 p-2.5 xl:p-5 hover:bg-gray-2 dark:hover:bg-meta-4"
						>
							<div className="flex-shrink-0 hidden sm:block">
								<img
									className="h-8 w-8 rounded-full"
									src={
										customer.image
											? customer.image
											: './customer-icon.png'
									}
									alt="Customer"
								/>
							</div>
							<p className="text-black dark:text-white">
								{customer.name}
							</p>
						</Link>

						<div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
							<p className="text-black dark:text-white">
								{customer.email}
							</p>
						</div>

						<div className="flex items-center justify-center p-2.5 xl:p-5">
							<p className={customer.suspended ? "text-red-500" : "text-green-500"}>
								{customer.suspended ? "Yes" : "No"}
							</p>
						</div>

						<div className="flex items-center justify-center p-2.5 xl:p-5">
							<p className={customer.isValid ? "text-green-500" : "text-red-500"}>
								{customer.isValid ? "Valid" : "Invalid"}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CustomersTable;
