import CustomersTable from "../components/CustomersTable";
import Pagination from "../components/Pagination";
import { useState, useEffect } from "react";
import { getAllCustomers } from "../services/adminServices";
import Loader from "../components/Loader";
import { Search } from "lucide-react";

const Customers = () => {;
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingSearch, setPendingSearch] = useState("");

  const fetchCustomers = async (page) => {
    setIsLoading(true);
    try {
      const data = await getAllCustomers(page);
      setFilteredCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error.message || "Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const handleSearch = async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const data = await getAllCustomers(page, pendingSearch);
      setFilteredCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(error.message || "Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
        <Loader isLoading={isLoading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full max-w-xs mb-4">
        <input
          type="text"
          placeholder="Search by customer name"
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          className="w-full p-3 pr-12 border border-gray-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-boxdark-2 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="absolute top-1/2 -translate-y-1/2 right-2 p-2 text-white bg-primary rounded-lg hover:bg-opacity-80 transition"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>
      <CustomersTable customers={filteredCustomers} />
      <Pagination totalPages={totalPages} pageSize={10} />
    </>
  );
};

export default Customers;
