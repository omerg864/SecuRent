import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { useState } from 'react';
import Loader from '../components/Loader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { password_regex } from '../utils/regex';
import { register as registerAdmin } from '../services/adminServices';
import { toast } from 'react-toastify';

const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [registrationError, setRegistrationError] = useState('');
	const navigate = useNavigate(); // Add this hook

	const schema = z
		.object({
			name: z.string().min(2, 'name must be at least 2 characters long'),
			email: z.string().email('Invalid email address'),
			password: z
				.string()
				.min(8, 'Password must be at least 8 characters')
				.regex(password_regex, {
					message:
						'Password must contain at least 1 uppercase, 1 lowercase, 1 number',
				}),
			confirmPassword: z.string(),
      code: z.string().min(6, 'Code must be at least 6 characters long'),
		})
		.refine((data) => data.password === data.confirmPassword, {
			path: ['confirmPassword'], // Path to show the error message on the confirmPassword field
			message: 'Passwords must match',
		});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const handleRegister = async (data) => {
		setIsLoading(true);
		setRegistrationError('');

		try {
			const result = await registerAdmin({
				name: data.name,
				email: data.email,
				password: data.password,
				role: 'admin',
        code: data.code,
			});

			toast.info('Admin registered successfully!');
			console.log('Registration result:', result);
			navigate('/login');
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Something went wrong';
			setRegistrationError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<Loader isLoading={isLoading} />
			</div>
		);
	}
	return (
		<main className="w-full p-8 shadow-default flex items-center justify-center dark:bg-boxdark-2">
			<div className="max-w-2xl flex-1 w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="flex flex-wrap items-center">
					<div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
						<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
							<span className="mb-1.5 block font-medium">
								SecuRent
							</span>
							<h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
								Sign Up to Admin Panel
							</h2>

							<form onSubmit={handleSubmit(handleRegister)}>
								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Name
									</label>
									<div className="relative">
										<input
											{...register('name')}
											type="text"
											placeholder="Enter your full name"
											className={`w-full rounded-lg border ${
												errors.name
													? 'border-red-500'
													: 'border-stroke'
											} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>
										<FiUser className="w-6 h-6 absolute right-4 top-4" />
									</div>
									{errors.name && (
										<p className="mt-1 text-sm text-red-500">
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Email
									</label>
									<div className="relative">
										<input
											{...register('email')}
											type="email"
											placeholder="Enter your email"
											className={`w-full rounded-lg border ${
												errors.email
													? 'border-red-500'
													: 'border-stroke'
											} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>
										<MdOutlineEmail className="w-6 h-6 absolute right-4 top-4" />
									</div>
									{errors.email && (
										<p className="mt-1 text-sm text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>

								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Password
									</label>
									<div className="relative">
										<input
											{...register('password')}
											type="password"
											placeholder="Enter your password"
											className={`w-full rounded-lg border ${
												errors.password
													? 'border-red-500'
													: 'border-stroke'
											} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>
										<MdLockOutline className="w-6 h-6 absolute right-4 top-4" />
									</div>
									{errors.password && (
										<p className="mt-1 text-sm text-red-500">
											{errors.password.message}
										</p>
									)}
								</div>

								<div className="mb-4">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Re-type Password
									</label>
									<div className="relative">
										<input
											{...register('confirmPassword')}
											type="password"
											placeholder="Re-enter your password"
											className={`w-full rounded-lg border ${
												errors.confirmPassword
													? 'border-red-500'
													: 'border-stroke'
											} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>
										<MdLockOutline className="w-6 h-6 absolute right-4 top-4" />
									</div>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-500">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

                <div className="mb-6">
									<label className="mb-2.5 block font-medium text-black dark:text-white">
										Verification Code
									</label>
									<div className="relative">
										<input
											{...register('code')}
											type="text"
											placeholder="Enter your verification code"
											className={`w-full rounded-lg border ${
												errors.code
													? 'border-red-500'
													: 'border-stroke'
											} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
										/>
										<MdLockOutline className="w-6 h-6 absolute right-4 top-4" />
									</div>
									{errors.code && (
										<p className="mt-1 text-sm text-red-500">
											{errors.code.message}
										</p>
									)}
								</div>

								<div className="mb-5">
									<input
										type="submit"
										value="Create account"
										disabled={isSubmitting}
										className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-70"
									/>
								</div>

								{registrationError && (
									<div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
										{registrationError}
									</div>
								)}

								<div className="mt-6 text-center">
									<p>
										Already have an account?{' '}
										<Link
											to="/login"
											className="text-primary"
										>
											Sign in
										</Link>
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Register;
