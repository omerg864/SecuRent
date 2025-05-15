import { Link } from "react-router-dom";

const ReportsTable = ({ reports }) => {
    return (
        <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
            <h4 className='mb-6 text-xl font-semibold text-black dark:text-white'>
                Reports
            </h4>

            <div className='flex flex-col'>
                <div className='grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4'>
                    <div className='p-2.5 xl:p-5'>Business</div>
                    <div className='p-2.5 xl:p-5 text-center'>Customer</div>
                    <div className='p-2.5 xl:p-5 text-center'>Title</div>
                    <div className='p-2.5 xl:p-5 text-center'>Created At</div>
                    <div className='p-2.5 xl:p-5 text-center'>Status</div>
                    <div className='p-2.5 xl:p-5 text-center'>Action</div>
                </div>

                {reports.length === 0 ? (
                    <div className='p-5 text-center text-gray-500 dark:text-gray-400'>
                        No reports found.
                    </div>
                ) : (
                    reports.map((report, index) => (
                        <div
                            key={report._id}
                            className={`grid grid-cols-6 items-center ${
                                index === reports.length - 1
                                    ? ""
                                    : "border-b border-stroke dark:border-strokedark"
                            } hover:bg-gray-2 dark:hover:bg-meta-4 p-2.5 xl:p-5`}
                        >
                            {/* Business */}
                            <div className='flex items-center gap-3'>
                                <div className='flex-shrink-0 hidden sm:block'>
                                    <img
                                        className='h-8 w-8 rounded-full'
                                        src={
                                            report.business.image ||
                                            "./business-icon.png"
                                        }
                                        alt='Business'
                                    />
                                </div>
                                <p className='text-black dark:text-white'>
                                    {report.business.name}
                                </p>
                            </div>

                            {/* Customer */}
                            <div className='flex items-center justify-center gap-3'>
                                <div className='flex-shrink-0 hidden sm:block'>
                                    <img
                                        className='h-8 w-8 rounded-full'
                                        src={
                                            report.customer.image ||
                                            "./avatar.png"
                                        }
                                        alt='Customer'
                                    />
                                </div>
                                <p className='text-black dark:text-white'>
                                    {report.customer.name}
                                </p>
                            </div>

                            {/* Title */}
                            <div className='flex items-center justify-center'>
                                <p className='text-black dark:text-white'>
                                    {report.title}
                                </p>
                            </div>

                            {/* Created At */}
                            <div className='flex justify-center'>
                                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                                    {new Date(
                                        report.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Status */}
                            <div className='flex justify-center'>
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

                            {/* Action */}
                            <div className='flex justify-center'>
                                <Link
                                    to={`/report/${report._id}`}
                                    state={report}
                                    className='text-sm text-blue-600 hover:underline'
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReportsTable;
