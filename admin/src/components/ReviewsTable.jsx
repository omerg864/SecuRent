import { Link } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";
import { Card } from "./card";

export function ReviewsTable({ reviews, isBusiness }) {
	if (!reviews || reviews.length === 0) {
		return <p className='text-muted-foreground'>No reviews yet.</p>;
	}

	return (
		<Card>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-1/6'>
								{isBusiness ? "Customer" : "Business"}
							</TableHead>
							<TableHead className='w-5/6'>Comment</TableHead>
							<TableHead className='w-1/6'>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reviews.map((review) => {
							const account = isBusiness
								? review.customer
								: review.business;

							return (
								<TableRow
									key={review._id}
									className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition'
								>
									<Link
										to={`/review/${review._id}`}
										state={review}
										className='contents'
									>
										{/* First Column - Customer or Business */}
										<TableCell className='font-medium flex items-center gap-2 whitespace-nowrap'>
											<img
												src={account?.image || "/avatar.png"}
												alt={account?.name || "User"}
												className='w-6 h-6 rounded-full object-cover'
												onError={(e) => {
													if (
														e.currentTarget.src !==
														window.location.origin + "/avatar.png"
													) {
														e.currentTarget.src = "/avatar.png";
													}
												}}
											/>
											{account?.name || "—"}
										</TableCell>

										{/* Comment */}
										<TableCell className='whitespace-normal break-words align-middle'>
											{review.content}
										</TableCell>

										{/* Date */}
										<TableCell>
											{new Date(review.createdAt).toLocaleDateString("en-GB")}
										</TableCell>
									</Link>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
