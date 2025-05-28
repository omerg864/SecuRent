import { Edit3 } from 'lucide-react';

const EditProfileHeader = ({ isEditing, onEdit, onCancel }) => (
	<div className="flex justify-between items-center bg-white dark:bg-black">
		<h2 className="text-2xl font-semibold">Edit Profile</h2>
		<div className="space-x-3 bg-white dark:bg-black">
			{isEditing ? (
				<>
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 bg-white dark:bg-black rounded-lg transition-colors hover:bg-gray-200 hover:dark:bg-gray-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 rounded-lg bg-white dark:bg-black hover:bg-gray-200 hover:dark:bg-gray-800"
					>
						Save Changes
					</button>
				</>
			) : (
				<button
					type="button"
					onClick={onEdit}
					className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 hover:bg-gray-200 hover:dark:bg-gray-800"
				>
					<Edit3 className="w-4 h-4" />
					<span>Edit Profile</span>
				</button>
			)}
		</div>
	</div>
);

export default EditProfileHeader;
