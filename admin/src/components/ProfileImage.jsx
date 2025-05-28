import { Trash2 } from 'lucide-react';

const ProfileImage = ({
	imagePreview,
	isEditing = false,
	onImageChange,
	onDeleteImage,
	size = 'w-28 h-28',
	showControls = true,
	className = '',
	imageClassName = '',
}) => (
	<div
		className={`flex flex-col items-center space-y-4 bg-white dark:bg-black ${className}`}
	>
		<div className={`${size} rounded-full overflow-hidden border`}>
			<img
				src={imagePreview || './avatar.png'}
				alt="Profile"
				className={`w-full h-full object-cover ${imageClassName}`}
			/>
		</div>
		{isEditing && showControls && (
			<div className="space-y-2 text-center bg-white dark:bg-black">
				<input
					type="file"
					accept="image/*"
					onChange={onImageChange}
					className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 hover:file:bg-blue-100"
				/>
				{imagePreview && (
					<button
						type="button"
						onClick={onDeleteImage}
						className="flex items-center justify-center text-red-600 hover:text-red-800 text-sm mx-auto"
					>
						<Trash2 className="w-4 h-4 mr-1" />
						Delete Image
					</button>
				)}
			</div>
		)}
	</div>
);

export default ProfileImage;
