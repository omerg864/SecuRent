import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "./table";
import { Card } from "./card";

export function ReviewsTable({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <p className='text-muted-foreground'>No reviews yet.</p>;
    }

    return (
        <Card>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-1/4'>Customer</TableHead>
                            <TableHead className='w-1/4 text-center'>
                                Rating
                            </TableHead>
                            <TableHead className='w-1/2'>Comment</TableHead>
                            <TableHead className='w-1/8'>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow
                                key={review._id}
                                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                            >
                                <Link
                                    to={`/review/${review._id}`}
                                    state={review}
                                    className='contents'
                                >
                                    <TableCell className='font-medium flex items-center gap-2 whitespace-nowrap'>
                                        <img
                                            src={
                                                review.customer?.image ||
                                                "/avatar.png"
                                            }
                                            alt={
                                                review.customer?.name ||
                                                "Customer"
                                            }
                                            className='w-6 h-6 rounded-full object-cover'
                                            onError={(e) => {
                                                if (
                                                    e.currentTarget.src !==
                                                    window.location.origin +
                                                        "/avatar.png"
                                                ) {
                                                    e.currentTarget.src =
                                                        "/avatar.png";
                                                }
                                            }}
                                        />
                                        {review.customer?.name || "—"}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        {review.rating?.overall ?? 0}
                                    </TableCell>
                                    <TableCell className='whitespace-normal break-words align-middle'>
                                        {review.content}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString("en-GB")}
                                    </TableCell>
                                </Link>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
