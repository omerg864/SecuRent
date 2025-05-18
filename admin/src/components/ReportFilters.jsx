import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const ReportFilters = ({ reports, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        console.log("Raw reports before filtering:", reports);

        for (const r of reports) {
            console.log("business name:", r.business?.name);
            console.log("status:", r.status);
            console.log("createdAt:", r.createdAt);
        }

        const filtered = reports
            .filter(
                (r) =>
                    typeof r.business?.name === "string" &&
                    r.business.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
            .filter((r) => statusFilter === "all" || r.status === statusFilter)
            .filter((r) => {
                const created = new Date(r.createdAt);
                const afterStart = startDate
                    ? created >= new Date(startDate)
                    : true;
                const beforeEnd = endDate ? created <= new Date(endDate) : true;
                return afterStart && beforeEnd;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        onFilter(filtered);
        console.log("Filtered reports:", filtered);
    }, [searchTerm, statusFilter, startDate, endDate, reports]);

    return (
        <div className='flex flex-wrap gap-4 items-end mb-6'>
            {/* Business name search */}
            <div className='relative'>
                <input
                    type='text'
                    placeholder='Search business...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 dark:bg-boxdark dark:text-white'
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>

            {/* Status filter */}
            <div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className='h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-boxdark dark:text-white'
                >
                    <option value='all'>All statuses</option>
                    <option value='open'>Open</option>
                    <option value='resolved'>Resolved</option>
                    <option value='rejected'>Rejected</option>
                </select>
            </div>

            {/* Start Date */}
            <div className='flex flex-col'>
                <span className='text-xs text-gray-600 dark:text-gray-400 mb-1'>
                    From
                </span>
                <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-boxdark dark:text-white'
                />
            </div>

            {/* End Date */}
            <div className='flex flex-col'>
                <span className='text-xs text-gray-600 dark:text-gray-400 mb-1'>
                    To
                </span>
                <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-boxdark dark:text-white'
                />
            </div>
        </div>
    );
};

export default ReportFilters;
