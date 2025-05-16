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
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={review._id}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Link
                  to={`/review/${review._id}`}
                  state={review}
                  className="contents"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <img
                      src={review.business.image}
                      alt={review.business.name}
                      className="w-6 h-6 rounded-full"
                    />
                    {review.business.name}
                  </TableCell>
                  <TableCell>{review.rating.overall ?? 0}</TableCell>
                  <TableCell className="truncate">{review.content}</TableCell>
                  <TableCell className="text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
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
