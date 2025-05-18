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

export function ReportsTable({ reports }) {
    if (!reports || reports.length === 0) {
        return <p className='text-muted-foreground'>No reports yet.</p>;
    }

    return (
        <Card>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Resolved By</TableHead>
                            <TableHead className='text-right'>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow
                                key={report._id}
                                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                            >
                                <Link
                                    to={`/report/${report._id}`}
                                    state={report}
                                    className='contents'
                                >
                                    <TableCell className='font-medium flex items-center gap-2'>
                                        {report.customer?.image && (
                                            <img
                                                src={report.customer.image}
                                                alt={report.customer.name}
                                                className='w-6 h-6 rounded-full'
                                            />
                                        )}
                                        {report.customer?.name || "—"}
                                    </TableCell>
                                    <TableCell>{report.title}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-sm font-medium px-2 py-0.5 rounded ${
                                                report.status === "resolved"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }`}
                                        >
                                            {report.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {report.resolutionBy?.name || "—"}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {new Date(
                                            report.createdAt
                                        ).toLocaleDateString('en-GB')}
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
