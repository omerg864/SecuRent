import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table"
import { Card } from "./card"


export function TransactionsTable({ transactions, currency }) {
  // Format amount with currency
  if (!currency) {
    currency = "ILS"
  }
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.business.name}</TableCell>
                <TableCell>{transaction.customer.name}</TableCell>
                <TableCell className="text-right">{formatAmount(transaction.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
