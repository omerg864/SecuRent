import { CustomerInfoCard } from "../components/customer-info-card";
import { TransactionsTable } from "../components/transactions-table";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerTransactions } from "../services/adminServices";
import { getCustomerById } from "../services/customerService";
import Loader from "../components/Loader";

export default function SingleCustomer() {
  const location = useLocation();
  const locationCustomer = location.state;
  const { id } = useParams();

  const [customer, setCustomer] = useState(locationCustomer || null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Fetch customer if not in location state
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!locationCustomer && id) {
        try {
          const fetchedCustomer = await getCustomerById(id);
          setCustomer(fetchedCustomer);
        } catch (error) {
          console.error("Error fetching customer:", error);
        }
      }
    };

    fetchCustomer();
  }, [locationCustomer, id]);

  // Fetch transactions when customer is available
  useEffect(() => {
    const fetchTransactions = async () => {
      if (customer?._id) {
        setLoading(true);
        try {
          const data = await getCustomerTransactions(customer._id);
          setTransactions(data.transactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [customer]);

  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Details:
        </h1>
        <button
          className="min-w-[100px] text-center px-4 py-1.5 rounded-md text-sm font-medium transition
                 border border-yellow-600 text-yellow-600 hover:bg-yellow-50
                 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
        >
          Suspend
        </button>
      </div>

      {customer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CustomerInfoCard customer={customer} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

            {loading ? (
              <Loader />
            ) : transactions.length > 0 ? (
              <TransactionsTable
                transactions={transactions}
                currency={customer.currency}
              />
            ) : (
              <p className="text-muted-foreground">No transactions yet.</p>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
}
