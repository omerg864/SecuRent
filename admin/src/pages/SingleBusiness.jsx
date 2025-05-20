import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BusinessInfoCard } from "../components/business-info-card";
import { TransactionsTable } from "../components/TransactionsTable";
import { ReviewsTable } from "../components/ReviewsTable";
import { ReportsTableSingle } from "../components/ReportsTableSingle";
import Loader from "../components/Loader";
import {
  getBusinessTransactions,
  getBusinessReviews,
  getBusinessReports,
} from "../services/adminServices";
import { getBusinessById } from "../services/businessService";
import SuspensionButton from "../components/SuspensionButton";

export default function SingleBusiness() {
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);

  // Fetch business if not in location state
  useEffect(() => {
    const fetchBusiness = async () => {
      if (id) {
        try {
          const fetchedBusiness = await getBusinessById(id);
          setBusiness(fetchedBusiness);
        } catch (error) {
          console.error("Error fetching business:", error);
        }
      }
    };
    fetchBusiness();
  }, [id]);

  // Fetch all business data once business is loaded
  useEffect(() => {
    const fetchAllData = async () => {
      if (business?._id) {
        setLoading(true);
        try {
          const [txRes, revRes, repRes] = await Promise.all([
            getBusinessTransactions(business._id),
            getBusinessReviews(business._id),
            getBusinessReports(business._id),
          ]);
          setTransactions(txRes.transactions);
          setReviews(revRes.reviews);
          setReports(repRes.reports);
        } catch (error) {
          console.error("Error fetching business data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAllData();
  }, [business]);

  return (
    <main className="container mx-auto px-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Business Details:
          </h1>
          <div className="flex items-center gap-4">
            {business?.suspended && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="text-4xl leading-none">⚠️</div>
                <p className="text-sm font-bold leading-tight">
                  This business is currently suspended.
                  <br />
                  New transactions are blocked.
                </p>
              </div>
            )}
            {console.log("Single Business: ", business)}
            <SuspensionButton
              accountType="Business"
              account={business}
              onStatusChange={setBusiness}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : business ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left */}
          <div className="lg:col-span-1">
            <div className="h-full">
              <BusinessInfoCard business={business} />
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
              {transactions.length > 0 ? (
                <TransactionsTable
                  transactions={transactions}
                  currency={business.currency}
				  isBusiness={true}
                />
              ) : (
                <p className="text-muted-foreground">No transactions yet.</p>
              )}
            </section>

            {
              <section>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <ReviewsTable reviews={reviews} 
				isBusiness={true}/>
              </section>
            }

            <section>
              <h2 className="text-2xl font-semibold mb-4">Reports</h2>
              <ReportsTableSingle reports={reports}
			  isBusiness={true} />
            </section>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
}
