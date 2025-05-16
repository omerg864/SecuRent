import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CustomerInfoCard } from "../components/customer-info-card";
import { TransactionsTable } from "../components/transactions-table";
import { ReviewsTable } from "../components/customerReviewsTable ";
import { ReportsTable } from "../components/customerReportsTable.jsx";
import { getCustomerById } from "../services/customerService";
import {
  getCustomerTransactions,
  getCustomerReviews,
  getCustomerReports,
} from "../services/adminServices";
import Loader from "../components/Loader";

export default function SingleCustomer() {
  const location = useLocation();
  const locationCustomer = location.state;
  const { id } = useParams();

  const [customer, setCustomer] = useState(locationCustomer || null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (customer?._id) {
        setLoading(true);
        try {
          const [txRes, revRes, repRes] = await Promise.all([
            getCustomerTransactions(customer._id),
            getCustomerReviews(customer._id),
            getCustomerReports(customer._id),
          ]);
          setTransactions(txRes.transactions);
          setReviews(revRes.reviews);
          setReports(repRes.reports);
        } catch (err) {
          console.error("Error fetching customer data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : customer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* שמאל */}
          <div className="lg:col-span-1">
            <div className="h-full min-h-[400px] max-h-[500px] overflow-auto">
              <CustomerInfoCard customer={customer} />
            </div>
          </div>

          {/* ימין */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
              <TransactionsTable
                transactions={transactions}
                currency={customer.currency}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <ReviewsTable reviews={reviews} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Reports</h2>
              <ReportsTable reports={reports} />
            </section>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
}
