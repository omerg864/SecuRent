import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { getTransactionById } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";
import { getCurrencySymbol } from "../services/httpClient";

const formatDate = (isoString) =>
  new Date(isoString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function SingleTransaction() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  if (loading || !transaction) {
    return <Loader />;
  }

  const currencySymbol = getCurrencySymbol(transaction.currency);

  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transaction Details:
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Info */}
        <div className="lg:col-span-1 space-y-4">
          <Link to={`/business/${transaction.business._id}`} className="block">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Business</h2>
              <div className="flex items-center gap-3">
                <img
                  src={transaction.business.image || "/business-icon.png"}
                  alt={transaction.business.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-medium">{transaction.business.name}</span>
              </div>
            </div>
          </Link>

          <Link to={`/customer/${transaction.customer._id}`} className="block">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Customer</h2>
              <div className="flex items-center gap-3">
                <img
                  src={transaction.customer.image || "/avatar.png"}
                  alt={transaction.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-medium">{transaction.customer.name}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Transaction Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-muted-foreground">
              Description:
            </h3>
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {transaction.description || "No description provided."}
            </p>

            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-medium">Amount:</h3>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {transaction.amount}
                {currencySymbol}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Opening Date:</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.opened_at)}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Return Date:</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.return_date)}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Status:</h3>
              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  transaction.status === "open"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                    : transaction.status === "closed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                {transaction.status}
              </p>
            </div>

            {(transaction.status === "closed" ||
              transaction.status === "charged") && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Close Date:</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.closed_at)}
                </p>
              </div>
            )}

            {transaction.status === "charged" && (
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-medium">
                  Charge Details:
                </h3>
                <p className="text-medium text-red-500">
                  Charged Amount:  
                  {transaction.charged}
                  {currencySymbol}
                </p>
                <p className="text-medium">
                  Reason: {transaction.charged_description}
                </p>
              </div>
            )}

            {(transaction.status === "closed" ||
              transaction.status === "charged") && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">Customer Review:</h3>
                {transaction.review ? (
                  <Link
                    to={`/review/${transaction.review}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Review
                  </Link>
                ) : (
                  <p className="text-muted-foreground">
                    The customer didn’t write a review yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
