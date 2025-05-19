import { useState } from "react";
import { toggleBusinessSuspension } from "../services/adminServices";

export default function BusinessSuspensionButton({ business, onStatusChange }) {
    const [isToggling, setIsToggling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = async () => {
        if (!business?._id) return;
        try {
            setIsToggling(true);
            const res = await toggleBusinessSuspension(business._id);
            onStatusChange({ ...business, suspended: res.suspended });
        } catch (error) {
            alert(error.message);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isToggling}
                className={`min-w-[100px] text-center px-4 py-1.5 rounded-md text-sm font-medium transition border 
                    ${
                        business?.suspended
                            ? "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                            : "border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                    }`}
            >
                {business?.suspended ? "Activate" : "Suspend"}
            </button>

            {showConfirm && (
                <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50'>
                    <div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl max-w-lg w-full'>
                        <h3 className='text-xl font-bold mb-4 text-gray-800 dark:text-white'>
                            {business?.suspended
                                ? "Activate Business?"
                                : "Suspend Business?"}
                        </h3>
                        <p className='text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6'>
                            {business?.suspended
                                ? "This business will be reactivated and allowed to open new transactions."
                                : "Suspending this business will block them from opening new transactions. They will still be able to close existing ones."}
                        </p>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className='px-5 py-2 rounded-md text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleToggle();
                                    setShowConfirm(false);
                                }}
                                className={`px-5 py-2 rounded-md text-base font-semibold transition
                                    ${
                                        business?.suspended
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-yellow-600 text-white hover:bg-yellow-700"
                                    }`}
                            >
                                {business?.suspended ? "Activate" : "Suspend"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
