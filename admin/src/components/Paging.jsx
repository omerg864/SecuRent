const Paging = ({ totalItems, itemsPerPage, setCurrentPage, currentPage }) => {
	if (totalItems <= itemsPerPage) return;
	const pageCount = Math.ceil(totalItems / itemsPerPage);
	const pages = [];

	for (let i = 1; i <= pageCount; i++) {
		pages.push(i);
	}

	return (
		<div className="flex justify-center items-center gap-2 mt-2 mb-2">
			{pageCount > 1 && (
				<button
					onClick={() =>
						currentPage > 1 && setCurrentPage(currentPage - 1)
					}
					disabled={currentPage === 1}
					className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Previous
				</button>
			)}

			{pages.map((page) => (
				<button
					key={page}
					onClick={() => setCurrentPage(page)}
					className={`px-3 py-1 rounded ${
						page === currentPage
							? 'bg-blue-500 text-white'
							: 'border hover:bg-gray-100'
					}`}
				>
					{page}
				</button>
			))}

			{pageCount > 1 && (
				<button
					onClick={() =>
						currentPage < pageCount &&
						setCurrentPage(currentPage + 1)
					}
					disabled={currentPage === pageCount}
					className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
				</button>
			)}
		</div>
	);
};

export default Paging;
