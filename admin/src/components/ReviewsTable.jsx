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

export function ReviewsTable({ accountType, reviews }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [reviewsPerPage] = useState(5);
	useEffect(() => {
		setCurrentPage(1);
	}, [reviews]);

	if (!reviews || reviews.length === 0) {
		return <p className="text-muted-foreground">No reviews yet.</p>;
	}

	const indexOfLastReview = currentPage * reviewsPerPage;
	const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
	const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

	return (
		<Card>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-2/6">
								{accountType === 'Business'
									? 'Customer'
									: 'Business'}
							</TableHead>
							<TableHead className="w-3/6">Comment</TableHead>
							<TableHead className="w-1/6">Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currentReviews.map((review) => (
							<TableRow
								key={review._id}
								className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
							>
								<Link
									to={`/review/${review._id}`}
									state={review}
									className="contents"
								>
									<TableCell className="font-medium flex items-center gap-2 whitespace-nowrap">
										<img
											src={
												accountType === 'Business'
													? review.customer?.image ||
													  '/admin/public/avatar.png'
													: review.business?.image ||
													  `/admin/public/business-icon.png`
											}
											alt={
												accountType === 'Business'
													? review.customer?.name ||
													  'Customer'
													: review.business?.name ||
													  'Business'
											}
											className="w-6 h-6 rounded-full object-cover"
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
											? review.customer?.name || '—'
											: review.business?.name || '—'}
									</TableCell>
									<TableCell className="whitespace-normal break-words align-middle">
										{review.content}
									</TableCell>

									<TableCell>
										{new Date(
											review.createdAt
										).toLocaleDateString('en-GB')}
									</TableCell>
								</Link>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<Paging
				totalItems={reviews.length}
				itemsPerPage={reviewsPerPage}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
			/>
		</Card>
	);
}
