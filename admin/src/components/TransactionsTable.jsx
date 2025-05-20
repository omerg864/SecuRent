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
import { formatCurrencySymbol } from "../utils/functions";

export function TransactionsTable({ transactions, currency, isBusiness }) {
  if (!currency) {
    currency = "ILS";
  }

  const formatAmount = (amount) => {
    const symbol = formatCurrencySymbol(currency);
    const formatted = new Intl.NumberFormat("he-IL", {}).format(amount);
    return `${formatted} ${symbol}`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">
                {isBusiness ? "Customer" : "Business"}
              </TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6 text-right">Amount</TableHead>
              <TableHead className="w-1/6 text-right">Opened At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const primary = isBusiness ? tx.customer : tx.business;

              return (
                <TableRow
                  key={tx._id}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <Link to={`/transaction/${tx._id}`} className="contents">
                    {/* Customer or Business with avatar */}
                    <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap">
                      <img
                        src={primary?.image || "/avatar.png"}
                        alt={primary?.name || "User"}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          if (
                            e.currentTarget.src !==
                            window.location.origin + "/avatar.png"
                          ) {
                            e.currentTarget.src = "/avatar.png";
                          }
                        }}
                      />
                      {primary?.name || "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                          ${
                            tx.status === "open"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "closed"
                              ? "bg-gray-200 text-gray-800"
                              : tx.status === "charged"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        `}
                      >
                        {tx.status || "pending"}
                      </span>
                    </TableCell>

                    {/* Amount or Actual Amount */}
                    <TableCell
                      className={`text-right ${
                        tx.status === "charged"
                          ? "text-red-600 dark:text-red-400"
                          : tx.status === "open"
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }`}
                    >
                      {formatAmount(
                        tx.status === "charged" && tx.amount
                          ? tx.charged
                          : tx.amount
                      )}
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="text-right">
                      {formatDate(tx.createdAt)}
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
