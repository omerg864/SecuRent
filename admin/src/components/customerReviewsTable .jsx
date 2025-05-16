import React from "react";

export const ReviewsTable = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Reviews</h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 bg-gray-2 dark:bg-meta-4 rounded-sm">
          <div className="p-2.5 xl:p-5 font-medium">Business</div>
          <div className="p-2.5 xl:p-5 font-medium">Rating</div>
          <div className="p-2.5 xl:p-5 font-medium">Comment</div>
          <div className="p-2.5 xl:p-5 font-medium">Date</div>
        </div>

        {reviews.map((review) => (
          <div
            key={review._id}
            className="grid grid-cols-4 border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
          >
            <div className="p-2.5 xl:p-5 flex items-center gap-3">
              <img src={review.business.image} alt="" className="w-8 h-8 rounded-full" />
              <span>{review.business.name}</span>
            </div>
            <div className="p-2.5 xl:p-5">{review.rating.overall ?? 0}</div>
            <div className="p-2.5 xl:p-5 truncate">{review.content}</div>
            <div className="p-2.5 xl:p-5">{new Date(review.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
