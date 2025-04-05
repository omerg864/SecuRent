const CardDataStats = ({ title, total, children }) => {
	return (
		<div className="flex items-center w-full gap-4 text-center rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
			<div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
				{children}
			</div>

			<div className="flex flex-1 items-end justify-between">
				<div>
					<h4 className="text-title-md font-bold text-black dark:text-white">
						{total}
					</h4>
				</div>
				<span className="text-sm font-medium">{title}</span>
			</div>
		</div>
	);
};

export default CardDataStats;
