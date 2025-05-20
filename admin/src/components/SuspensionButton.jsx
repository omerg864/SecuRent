import { useState } from 'react';
import {
	toggleBusinessSuspension,
	toggleCustomerSuspension,
} from '../services/adminServices';

export default function SuspensionButton({
	accountType,
	account,
	onStatusChange,
}) {
	const [isToggling, setIsToggling] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleToggle = async () => {
		if (!account?._id) return;
		try {
			setIsToggling(true);
			const res =
				accountType === 'Business'
					? await toggleBusinessSuspension(account._id)
					: await toggleCustomerSuspension(account._id);
			onStatusChange({ ...account, suspended: res.suspended });
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
						account?.suspended
							? 'border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20'
							: 'border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900/20'
					}`}
			>
				{account?.suspended ? 'Activate' : 'Suspend'}
			</button>

			{showConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl max-w-lg w-full">
						<h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
							{account?.suspended
								? `Activate ${accountType}?`
								: `Suspend ${accountType}?`}
						</h3>
						<p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
							{account?.suspended
								? `This ${accountType.toLowerCase()} will be reactivated and allowed to open new transactions.`
								: `Suspending this ${accountType.toLowerCase()} will block them from opening new transactions. They will still be able to close existing ones.`}
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setShowConfirm(false)}
								className="px-5 py-2 rounded-md text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
										account?.suspended
											? 'bg-green-600 text-white hover:bg-green-700'
											: 'bg-yellow-600 text-white hover:bg-yellow-700'
									}`}
							>
								{account?.suspended ? 'Activate' : 'Suspend'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
