import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BusinessInfoCard } from "../components/business-info-card";
import { TransactionsTable } from "../components/transactions-table";
import { ReviewsTable } from "../components/BusinessReviewsTable";
import { ReportsTable } from "../components/BusinessReportsTable";
import Loader from "../components/Loader";
import {
    getBusinessTransactions,
    getBusinessReviews,
    getBusinessReports
} from "../services/adminServices";
import { getBusinessById } from "../services/businessService";

export default function SingleBusiness() {
    const location = useLocation();
    const locationBusiness = location.state;
    const { id } = useParams();

    const [business, setBusiness] = useState(locationBusiness || null);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reports, setReports] = useState([]);

    // Fetch business if not in location state
    useEffect(() => {
        const fetchBusiness = async () => {
            if (!locationBusiness && id) {
                try {
                    const fetchedBusiness = await getBusinessById(id);
                    setBusiness(fetchedBusiness);
                } catch (error) {
                    console.error("Error fetching business:", error);
                }
            }
        };
        fetchBusiness();
    }, [locationBusiness, id]);

    // Fetch all business data once business is loaded
    useEffect(() => {
        const fetchAllData = async () => {
            if (business?._id) {
                setLoading(true);
                try {
                    const [txRes, revRes, repRes] = await Promise.all([
                        getBusinessTransactions(business._id),
                        getBusinessReviews(business._id),
                        getBusinessReports(business._id)
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
        <main className='container mx-auto px-4'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    Business Details:
                </h1>
                <button
                    className='min-w-[100px] text-center px-4 py-1.5 rounded-md text-sm font-medium transition
                   border border-yellow-600 text-yellow-600 hover:bg-yellow-50
                   dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
                >
                    Suspend
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <Loader />
                </div>
            ) : business ? (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
                    {/* Left */}
                    <div className='lg:col-span-1'>
                        <div className='h-full min-h-[400px] max-h-[500px] overflow-auto'>
                            <BusinessInfoCard business={business} />
                        </div>
                    </div>

                    {/* Right */}
                    <div className='lg:col-span-2 space-y-8'>
                        <section>
                            <h2 className='text-2xl font-semibold mb-4'>
                                Transactions
                            </h2>
                            {transactions.length > 0 ? (
                                <TransactionsTable
                                    transactions={transactions}
                                    currency={business.currency}
                                />
                            ) : (
                                <p className='text-muted-foreground'>
                                    No transactions yet.
                                </p>
                            )}
                        </section>

                        {
                            <section>
                                <h2 className='text-2xl font-semibold mb-4'>
                                    Reviews
                                </h2>
                                <ReviewsTable reviews={reviews} />
                            </section>
                        }

                        <section>
                            <h2 className='text-2xl font-semibold mb-4'>
                                Reports
                            </h2>
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
