import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { getReviewById } from "../services/reviewService"; // You'll need to implement this

// Helper to format date
const formatDate = (isoString) =>
  new Date(isoString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function SingleReview() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const data = await getReviewById(id);
        setReview(data);
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReview();
  }, [id]);

  if (loading || !review) {
    return <Loader />;
  }

  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Details:
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Link to={`/business/${review.business._id}`} className="block">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Business</h2>
              <div className="flex items-center gap-3">
                <img
                  src={review.business.image || "/business-icon.png"}
                  alt={review.business.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-medium">{review.business.name}</span>
              </div>
            </div>
          </Link>

          <Link to={`/customer/${review.customer._id}`} className="block">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:bg-gray-2 dark:hover:bg-meta-4 transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Customer</h2>
              <div className="flex items-center gap-3">
                <img
                  src={review.customer.image || "/avatar.png"}
                  alt={review.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-medium">{review.customer.name}</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-muted-foreground">
              Review Content:
            </h3>
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {review.content || "No content provided."}
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Images</h3>
              {review.images?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {review.images.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No images provided.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-1">Review Date:</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-1">Transaction</h3>
              {review.transaction ? (
                <Link
                  to={`/transaction/${review.transaction}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Transaction Details
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No linked transaction.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
