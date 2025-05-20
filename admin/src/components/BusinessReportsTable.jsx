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
                            <TableHead className='w-1/4'>Customer</TableHead>
                            <TableHead className='w-1/4'>Title</TableHead>
                            <TableHead className='w-1/5'>Status</TableHead>
                            <TableHead className='w-1/5'>Resolved By</TableHead>
                            <TableHead className='w-1/5'>Date</TableHead>
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
                                    <TableCell className='font-medium flex items-center gap-2 whitespace-nowrap'>
                                        <img
                                            src={
                                                report.customer?.image ||
                                                "/avatar.png"
                                            }
                                            alt={
                                                report.customer?.name ||
                                                "Customer"
                                            }
                                            className='w-6 h-6 rounded-full'
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
                                        {report.customer?.name || "—"}
                                    </TableCell>

                                    <TableCell>{report.title}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                                                ${
                                                    report.status === "resolved"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }
                                            `}
                                        >
                                            {report.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {report.resolutionBy?.name || "—"}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            report.createdAt
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
