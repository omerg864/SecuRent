const FormField = ({ field, register, isEditing, value, error }) => (
	<div>
		<label className="block text-sm font-medium mb-1">{field.label}</label>
		<input
			type={field.type}
			{...register(field.key)}
			value={value}
			disabled={!isEditing}
			className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
				isEditing
					? error
						? 'border-red-300'
						: 'border-gray-300'
					: 'border-gray-200 bg-gray-50'
			}`}
		/>
		{isEditing && error && (
			<p className="text-red-500 text-sm mt-1">{error.message}</p>
		)}
	</div>
);

const EditProfileForm = ({
	register,
	isEditing,
	watchedValues,
	adminData,
	errors,
}) => {
	const fields = [
		{ key: 'name', label: 'Full Name', type: 'text' },
		{ key: 'email', label: 'Email', type: 'email' },
	];

	return (
		<div className="flex justify-center bg-white dark:bg-black">
			<div className="w-full max-w-md space-y-4 bg-white dark:bg-black">
				{fields.map((field) => (
					<FormField
						key={field.key}
						field={field}
						register={register}
						isEditing={isEditing}
						value={
							isEditing
								? watchedValues[field.key] || ''
								: adminData[field.key] || ''
						}
						error={errors[field.key]}
					/>
				))}
			</div>
		</div>
	);
};

export default EditProfileForm;
