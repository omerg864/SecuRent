import { Link } from "react-router-dom";
import { formatDate } from "../utils/functions";

const ReportsTable = ({ reports }) => {
    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <h4 className='mb-6 text-xl font-semibold text-black dark:text-white'>
                Reports
            </h4>

            <div className='flex flex-col w-full'>
                {/* Table Header */}
                <div className='grid grid-cols-5 w-full rounded-sm bg-gray-2 dark:bg-meta-12'>
                    <div className='p-2.5 xl:p-5 text-sm font-medium uppercase xsm:text-base'>
                        Business
                    </div>
                    <div className='p-2.5 xl:p-5 text-sm font-medium uppercase xsm:text-base'>
                        Customer
                    </div>
                    <div className='p-2.5 xl:p-5 text-sm font-medium uppercase xsm:text-base'>
                        Title
                    </div>
                    <div className='p-2.5 xl:p-5 text-sm font-medium uppercase xsm:text-base'>
                        Created At
                    </div>
                    <div className='p-2.5 xl:p-5 text-sm font-medium uppercase xsm:text-base'>
                        Status
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className='p-5 text-center text-gray-500 dark:text-gray-400'>
                        No reports found.
                    </div>
                ) : (
                    reports.map((report, index) => (
                        <Link
                            key={report._id}
                            to={`/report/${report._id}`}
                            state={report}
                            className={`grid grid-cols-5 w-full items-center cursor-pointer ${
                                index === reports.length - 1
                                    ? ""
                                    : "border-b border-stroke dark:border-strokedark"
                            } hover:bg-gray-2 dark:hover:bg-meta-4`}
                        >
                            {/* Business */}
                            <div className='flex items-center gap-3 p-2.5 xl:p-5'>
                                <img
                                    className='h-8 w-8 rounded-full object-cover'
                                    src={
                                        report.business.image ||
                                        "./business-icon.png"
                                    }
                                    alt='Business'
                                />
                                <p className='text-black dark:text-white'>
                                    {report.business.name}
                                </p>
                            </div>

                            {/* Customer */}
                            <div className='flex items-center gap-3 p-2.5 xl:p-5'>
                                <img
                                    className='h-8 w-8 rounded-full object-cover'
                                    src={
                                        report.customer.image || "./avatar.png"
                                    }
                                    alt='Customer'
                                />
                                <p className='text-black dark:text-white'>
                                    {report.customer.name}
                                </p>
                            </div>

                            {/* Title */}
                            <div className='flex items-center p-2.5 xl:p-5'>
                                <p className='text-black dark:text-white'>
                                    {report.title}
                                </p>
                            </div>

                            {/* Created At */}
                            <div className='flex items-center p-2.5 xl:p-5'>
                                <p className='text-black dark:text-white'>
                                    {formatDate(report.createdAt)}
                                </p>
                            </div>

                            {/* Status */}
                            <div className='flex items-center p-2.5 xl:p-5'>
                                <span
                                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                                        report.status === "open"
                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/20 dark:text-yellow-400"
                                            : report.status === "resolved"
                                            ? "bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400"
                                    }`}
                                >
                                    {report.status}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportsTable;
