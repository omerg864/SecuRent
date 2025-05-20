import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/table";
import { Card } from "./card";

export function BusinessTransactionsTable({ transactions, currency }) {
    if (!currency) {
        currency = "ILS";
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency
        }).format(amount);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB");
    };

    return (
        <Card>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-1/4'>Customer</TableHead>
                            <TableHead className='w-1/6'>Status</TableHead>
                            <TableHead className='w-1/6 text-right'>
                                Amount
                            </TableHead>
                            <TableHead className='w-1/6 text-right'>
                                Opened At
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow
                                key={tx._id}
                                className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                            >
                                <Link
                                    to={`/transaction/${tx._id}`}
                                    className='contents'
                                >
                                    {/* Customer with avatar */}
                                    <TableCell className='font-medium flex items-center gap-2 whitespace-nowrap'>
                                        <img
                                            src={
                                                tx.customer?.image ||
                                                "/avatar.png"
                                            }
                                            alt={
                                                tx.customer?.name || "Customer"
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

                                        {tx.customer?.name || "—"}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell className='capitalize'>
                                        {tx.status || "pending"}
                                    </TableCell>

                                    {/* Amount or Actual Amount */}
                                    <TableCell className='text-right'>
                                        {formatAmount(
                                            tx.status === "closed" &&
                                                tx.actual_amount
                                                ? tx.actual_amount
                                                : tx.amount
                                        )}
                                    </TableCell>

                                    {/* Created At */}
                                    <TableCell className='text-right'>
                                        {formatDate(tx.createdAt)}
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
