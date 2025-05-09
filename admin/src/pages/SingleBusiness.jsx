import { BusinessInfoCard } from "../components/business-info-card";
import { TransactionsTable } from "../components/transactions-table";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBusinessTransactions } from "../services/adminServices";
import Loader from "../components/Loader";

export default function SingleBusiness() {
  const location = useLocation();
  const business = location.state;
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getBusinessTransactions(business._id);
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (business?._id) {
      fetchTransactions();
    }
  }, [business]);

  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Business Details:
        </h1>
          <button
            className="min-w-[100px] text-center px-4 py-1.5 rounded-md text-sm font-medium transition
                 border border-yellow-600 text-yellow-600 hover:bg-yellow-50
                 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
          >
            Suspend
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <BusinessInfoCard business={business} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

          {loading ? (
            <Loader />
          ) : transactions.length > 0 ? (
            <TransactionsTable
              transactions={transactions}
              currency={business.currency}
            />
          ) : (
            <p className="text-muted-foreground">No transactions yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
