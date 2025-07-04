import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { useAuth } from '../../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import { CiLogout } from 'react-icons/ci';

const DropdownUser = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { logout, user } = useAuth();

	return (
		<ClickOutside
			onClick={() => setDropdownOpen(false)}
			className="relative"
		>
			<Link
				onClick={() => setDropdownOpen(!dropdownOpen)}
				className="flex items-center gap-4"
				to="#"
			>
				<span className="hidden text-right lg:block">
					<span className="block text-sm font-medium text-black dark:text-white">
						{user.name}
					</span>
					<span className="block text-xs">{user.role}</span>
				</span>

				<img
					src={user.image ? user.image : './avatar.png'}
					alt="User"
					className="rounded-full h-12 w-12"
				/>

				<svg
					className="hidden fill-current sm:block"
					width="12"
					height="8"
					viewBox="0 0 12 8"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
						fill=""
					/>
				</svg>
			</Link>

			{/* <!-- Dropdown Start --> */}
			{dropdownOpen && (
				<div
					className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
				>
					<ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
						<li>
							<Link
								to="/profile"
								state={{
									email: JSON.parse(
										localStorage.getItem('user')
									)?.email,
								}}
								className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
							>
								<FiUser />
								My Profile
							</Link>
						</li>
					</ul>
					<button
						onClick={logout}
						className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
					>
						<CiLogout />
						Log Out
					</button>
				</div>
			)}
			{/* <!-- Dropdown End --> */}
		</ClickOutside>
	);
};

export default DropdownUser;
