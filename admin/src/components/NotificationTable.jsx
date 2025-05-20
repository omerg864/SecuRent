import { Link } from "react-router-dom";

const NotificationsTable = ({ notifications }) => {
  const hasCustomer = notifications.some((n) => n.customer);
  const hasBusiness = notifications.some((n) => n.business);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Notifications
      </h4>

      <div className="flex flex-col">
        <div className={`grid rounded-sm bg-gray-2 dark:bg-meta-4`} style={{ gridTemplateColumns: `repeat(${hasCustomer + hasBusiness + 1}, 1fr)` }}>
          {hasCustomer && (
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Customer</h5>
            </div>
          )}
          {hasBusiness && (
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">Business</h5>
            </div>
          )}
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Content</h5>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-5 text-center text-gray-500 dark:text-gray-400">
            There are no notifications.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={notification._id}
              className={`grid items-center ${
                index !== notifications.length - 1
                  ? "border-b border-stroke dark:border-strokedark"
                  : ""
              } p-2.5 xl:p-5 hover:bg-gray-1 dark:hover:bg-meta-4`}
              style={{ gridTemplateColumns: `repeat(${hasCustomer + hasBusiness + 1}, 1fr)` }}
            >
              {hasCustomer && notification.customer ? (
                <Link
                  to={`/customer/${notification.customer._id}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 hidden sm:block">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={notification.customer.image || "./avatar.png"}
                      alt="Customer"
                    />
                  </div>
                  <p className="text-black dark:text-white">{notification.customer.name}</p>
                </Link>
              ) : (
                hasCustomer && <div />
              )}
              {hasBusiness && notification.business ? (
                <Link
                  to={`/business/${notification.business._id}`}
                  className="flex items-center justify-center gap-3 hover:underline text-primary"
                >
                  <div className="flex-shrink-0 hidden sm:block">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={notification.business.image || "./business-icon.png"}
                      alt="Business"
                    />
                  </div>
                  <p className="text-black dark:text-white">{notification.business.name}</p>
                </Link>
              ) : (
                hasBusiness && <div />
              )}
              <div className="flex items-center justify-center">
                <p className="text-black dark:text-white text-center break-words whitespace-pre-line">
                  {notification.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsTable;
