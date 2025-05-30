import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
import Paging from "./Paging";
export function TransactionsTable({ accountType, transactions, currency }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

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

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">{`${
                accountType === "Business" ? "Customer" : "Business"
              }`}</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6 text-right">Amount</TableHead>
              <TableHead className="w-1/6 text-right">Opened At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((tx) => (
              <TableRow
                key={tx._id}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Link to={`/transaction/${tx._id}`} className="contents">
                  <TableCell className="font-medium flex items-center gap-2 whitespace-nowrap">
                    <img
                      src={
                        accountType === "Business"
                          ? tx.customer?.image || "/admin/public/avatar.png"
                          : tx.business?.image ||
                            "/admin/public/business-icon.png"
                      }
                      alt={
                        accountType === "Business"
                          ? tx.customer?.name || "Customer"
                          : tx.business?.name || "Business"
                      }
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

                    {accountType === "Business"
                      ? tx.customer?.name || "—"
                      : tx.business?.name || "—"}
                  </TableCell>

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

                  <TableCell className={`text-right ${
                        tx.status === "charged"
                          ? "text-red-600 dark:text-red-400"
                          : tx.status === "open"
                          ? "text-green-600 dark:text-green-400"
                          : ""
                      }`}>
                    {formatAmount(
                      tx.status === "charged" && tx.amount
                        ? tx.charged
                        : tx.amount
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatDate(tx.createdAt)}
                  </TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Paging
        totalItems={transactions.length}
        itemsPerPage={transactionsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </Card>
  );
}
