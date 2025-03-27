import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserRestrictedRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const [searchParams] = useSearchParams();

	if (isAuthenticated) {
		return (
			<Navigate
				to={
					searchParams.get('redirect')
						? `/${searchParams.get('redirect')}`
						: '/'
				}
				replace
			/>
		);
	}

	return children;
};

export default UserRestrictedRoute;
