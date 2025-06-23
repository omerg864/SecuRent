import NotificationsTable from "../components/NotificationTable";
import Pagination from "../components/Pagination";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { getAllNotifications, markAdminNotificationAsRead } from "../services/notificationsService";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async (page) => {
    setIsLoading(true);
    try {
      const data = await getAllNotifications(page);
      setNotifications(data.notifications);
      setTotalPages(data.total);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(error.message || "Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markAdminNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError(error.message || "Failed to mark notification as read");
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
      <NotificationsTable notifications={notifications}
      setNotifications={setNotifications}
       markAsRead={markAsRead}/>
      <Pagination totalPages={totalPages} pageSize={10} />
    </>
  );
};

export default Notifications;
