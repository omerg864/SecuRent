import BusinessesTable from "../components/BusinessesTable";
import Pagination from "../components/Pagination";
import { useState } from "react";
import { useEffect } from "react";
import { getAllBusinesses } from "../services/adminServices";
import Loader from "../components/Loader";

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBusinesses = async (page) => {
    setIsLoading(true);
    try {
      const data = await getAllBusinesses(page);
      console.log("Businesses data:", data);
      setBusinesses(data.businesses);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setError(error.message || "Failed to fetch businesses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(page);
  }, [page]);
  // TODO: connect to backend

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
      <BusinessesTable businesses={businesses} />
      <Pagination totalPages={10} pageSize={10} />
    </>
  );
};

export default Businesses;
