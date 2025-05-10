import { Link } from "react-router-dom";

const ReportsTable = ({ reports }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Open Reports
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Business Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Customer Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Report Title
            </h5>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="p-5 text-center text-gray-500 dark:text-gray-400">
            There are no open reports.
          </div>
        ) : (
          reports.map((report, index) => (
            <Link
              to={`/report/${report._id}`}
              state={report}
              key={report._id}
              className={`grid grid-cols-3 items-center ${
                index === reports.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              } hover:bg-gray-2 dark:hover:bg-meta-4 p-2.5 xl:p-5`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 hidden sm:block">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={report.business.image || "./business-icon.png"}
                    alt="Business"
                  />
                </div>
                <p className="text-black dark:text-white">
                  {report.business.name}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="flex-shrink-0 hidden sm:block">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={report.customer.image || "./avatar.png"}
                    alt="Customer"
                  />
                </div>
                <p className="text-black dark:text-white">
                  {report.customer.name}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <p className="text-black dark:text-white">{report.title}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsTable;
