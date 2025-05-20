import NotificationsTable from "../components/NotificationTable";
import Pagination from "../components/Pagination";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { getAllNotifications } from "../services/notificationsService";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async (page) => {
    setIsLoading(true);
    try {
      const data = await getAllNotifications(page);
      setNotifications(data.notifications);
      setFilteredNotifications(data.notifications);
      const pages = (data.total / 10);
      setTotalPages(pages);
      console.log("Notifications data: ", data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message || "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

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
      <NotificationsTable notifications={filteredNotifications} />
      <Pagination totalPages={totalPages} pageSize={10} />
    </>
  );
};

export default Notifications;
