import React from "react";

export const ReportsTable = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <p className="text-muted-foreground">No reports yet.</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Reports</h4>
      <div className="flex flex-col">
        <div className="grid grid-cols-5 bg-gray-2 dark:bg-meta-4 rounded-sm">
          <div className="p-2.5 xl:p-5 font-medium">Business</div>
          <div className="p-2.5 xl:p-5 font-medium">Title</div>
          <div className="p-2.5 xl:p-5 font-medium">Status</div>
          <div className="p-2.5 xl:p-5 font-medium">Resolved By</div>
          <div className="p-2.5 xl:p-5 font-medium">Date</div>
        </div>

        {reports.map((report) => (
          <div
            key={report._id}
            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
          >
            <div className="p-2.5 xl:p-5 flex items-center gap-3">
              <img src={report.business.image} alt="" className="w-8 h-8 rounded-full" />
              <span>{report.business.name}</span>
            </div>
            <div className="p-2.5 xl:p-5">{report.title}</div>
            <div className="p-2.5 xl:p-5 capitalize">
              <span className={`text-sm font-medium px-2 py-0.5 rounded ${report.status === "resolved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                {report.status}
              </span>
            </div>
            <div className="p-2.5 xl:p-5">{report.resolutionBy?.name || "—"}</div>
            <div className="p-2.5 xl:p-5">{new Date(report.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
