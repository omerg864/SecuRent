import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAdmin } from '../services/adminServices';
import { z } from 'zod';
import EditProfileHeader from './EditProfileHeader';
import ProfileImage from './ProfileImage';
import EditProfileForm from './EditProfileFormField';
import { useAuth } from '../context/AuthContext';

const ProfileEdit = ({ adminData, onSave }) => {
	const { updateUser } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(adminData.image || '');
	const [deleteImageFlag, setDeleteImageFlag] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
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
			setIsUpdating(true);
			await updateAdmin({
				name: data.name,
				email: data.email,
				imageFile,
				imageDeleteFlag: deleteImageFlag,
			});

			const currentUser = JSON.parse(localStorage.getItem('user'));
			const updatedUserData = {
				...currentUser,
				name: data.name,
				email: data.email,
				image: imagePreview,
			};
			localStorage.setItem('user', JSON.stringify(updatedUserData));

			updateUser();

			onSave?.({
				...data,
				image: imagePreview,
			});
			setIsEditing(false);
			setDeleteImageFlag(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsUpdating(false);
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 bg-white dark:bg-black pt-2 pb-10 rounded-xl px-5"
		>
			<EditProfileHeader
				isEditing={isEditing}
				onEdit={handleEdit}
				onCancel={handleCancel}
				isUpdating={isUpdating}
			/>
			<ProfileImage
				imagePreview={imagePreview}
				isEditing={isEditing}
				onImageChange={handleImageChange}
				onDeleteImage={handleDeleteImage}
			/>
			<EditProfileForm
				register={register}
				isEditing={isEditing}
				watchedValues={watchedValues}
				adminData={adminData}
				errors={errors}
			/>
		</form>
	);
};
export default ProfileEdit;
