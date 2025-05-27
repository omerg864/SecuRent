import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Trash2 } from 'lucide-react';
import { updateAdmin } from '../services/adminServices';
import { z } from 'zod';

const ProfileEdit = ({ adminData, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(adminData.image || '');
	const [deleteImageFlag, setDeleteImageFlag] = useState(false);

	const schema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters long'),
		email: z.string().email('Invalid email address'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: adminData.name || '',
			email: adminData.email || '',
		},
	});

	const watchedValues = watch();

	const handleEdit = () => {
		setIsEditing(true);
		reset({
			name: adminData.name || '',
			email: adminData.email || '',
		});
		setImagePreview(adminData.image || '');
	};

	const onSubmit = async (data) => {
		try {
			await updateAdmin({
				name: data.name,
				email: data.email,
				imageFile,
				imageDeleteFlag: deleteImageFlag,
			});

			onSave?.({
				...data,
				image: imagePreview,
			});

			setIsEditing(false);
			setDeleteImageFlag(false);
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	};

	const handleCancel = () => {
		reset({
			name: adminData.name || '',
			email: adminData.email || '',
		});
		setImageFile(null);
		setImagePreview(adminData.image || '');
		setDeleteImageFlag(false);
		setIsEditing(false);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
			setDeleteImageFlag(false);
		}
	};

	const handleDeleteImage = () => {
		setImageFile(null);
		setImagePreview('');
		setDeleteImageFlag(true);
	};

	return (
		<div className="space-y-6 bg-white dark:bg-black pt-2 pb-10 rounded-xl pl-5 pr-5">
			<div className="flex justify-between items-center bg-white dark:bg-black">
				<h2 className="text-2xl font-semibold ">Edit Profile</h2>
				<div className="space-x-3 bg-white dark:bg-black">
					{isEditing ? (
						<>
							<button
								onClick={handleCancel}
								className="px-4 py-2 border bg-white dark:bg-black rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit(onSubmit)}
								className="px-4 py-2 rounded-lg bg-white dark:bg-black "
							>
								Save Changes
							</button>
						</>
					) : (
						<button
							onClick={handleEdit}
							className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 hover:bg-gray-200 hover:dark:bg-gray-800"
						>
							<Edit3 className="w-4 h-4" />
							<span>Edit Profile</span>
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col items-center space-y-4 bg-white dark:bg-black">
				<div className="w-28 h-28 rounded-full overflow-hidden border ">
					<img
						src={imagePreview ? imagePreview : './avatar.png'}
						alt="Profile"
						className="w-full h-full object-cover"
					/>
				</div>
				{isEditing && (
					<div className="space-y-2 text-center bg-white dark:bg-black">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 hover:file:bg-blue-100"
						/>
						{imagePreview && (
							<button
								type="button"
								onClick={handleDeleteImage}
								className="flex items-center justify-center text-red-600 hover:text-red-800 text-sm mx-auto"
							>
								<Trash2 className="w-4 h-4 mr-1" />
								Delete Image
							</button>
						)}
					</div>
				)}
			</div>

			<div className="flex justify-center bg-white dark:bg-black">
				<div className="w-full max-w-md space-y-4 bg-white dark:bg-black">
					{[
						{ key: 'name', label: 'Full Name', type: 'text' },
						{ key: 'email', label: 'Email', type: 'email' },
					].map(({ key, label, type }) => (
						<div key={key}>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								{label}
							</label>
							<input
								type={type}
								{...register(key)}
								value={
									isEditing
										? watchedValues[key] || ''
										: adminData[key] || ''
								}
								disabled={!isEditing}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									isEditing
										? errors[key]
											? 'border-red-300'
											: 'border-gray-300'
										: 'border-gray-200 bg-gray-50'
								}`}
							/>
							{isEditing && errors[key] && (
								<p className="text-red-500 text-sm mt-1">
									{errors[key].message}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProfileEdit;
