import { Link } from 'react-router-dom';
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md';
import GoogleLogin from '../components/GoogleLogin';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
	login as loginService,
	googleLogin as googleLoginService,
} from '../services/adminServices';
import DarkModeSwitcher from '../components/Header/DarkModeSwitcher';
const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState('');
	const { login } = useAuth();

	const schema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(schema) });

	const handleLogin = async (data) => {
		setIsLoading(true);
		setLoginError(''); // Clear previous errors
		try {
			const user = await loginService(data.email, data.password);
			login(user);
			toast.success(`Welcome back, ${user.name}!`);
		} catch (error) {
			console.error('Login failed:', error);
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				'Login failed, please try again.';
			setLoginError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};
	const loginWithGoogle = async (authResult) => {
		if (authResult['code']) {
			setIsLoading(true);
			setLoginError('');
			try {
				const user = await googleLoginService(authResult.code);
				login(user);
				toast.success(`Welcome back, ${user.name}!`);
			} catch (error) {
				console.error('Google login failed:', error);
				const errorMessage =
					error.response?.data?.message ||
					error.message ||
					'Google login failed, please try again.';
				setLoginError(errorMessage);
				toast.error(errorMessage);
			} finally {
				setIsLoading(false);
			}
		} else {
			console.error(authResult);
			toast.error('Google login failed');
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen dark:bg-boxdark-2">
				<Loader isLoading={isLoading} />
			</div>
		);
	}

	return (
		<main className="w-full p-8 shadow-default flex items-center justify-center dark:bg-boxdark-2">
			<div className="max-w-2xl flex-1 w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<ul className="flex p-2 justify-end">
					{/* <!-- Dark Mode Toggler --> */}
					<DarkModeSwitcher />
					{/* <!-- Dark Mode Toggler --> */}
				</ul>
				<div className="flex flex-wrap items-center relative">
					<div className="w-full border-stroke dark:border-strokedark xl:border-l-2">
						<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
							<span className="mb-1.5 block font-medium">
								SecuRent
							</span>
							<h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
								Sign In to Admin Panel
							</h2>
							<form
								onSubmit={(e) => {
									e.preventDefault(); // This prevents page refresh
									handleSubmit(handleLogin)(e);
								}}
							>
								{/* Email Field */}
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

								{/* Password Field */}
								<div className="mb-6">
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

								{/* Server Error Message */}
								{loginError && (
									<div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
										{loginError}
									</div>
								)}

								<div className="mb-5">
									<input
										type="submit"
										value="Sign In"
										disabled={isSubmitting}
										className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-70"
									/>
								</div>

								<GoogleLogin authResponse={loginWithGoogle} />

								<div className="mt-6 text-center">
									<p>
										{"Don't have an account? "}
										<Link
											to="/register"
											className="text-primary"
										>
											Sign Up
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

export default Login;
