import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();
	const path = window.location.pathname.slice(1);

	if (!isAuthenticated) {
		return (
			<Navigate
				to={path ? `/login?redirect=${path}` : '/login'}
				replace
			/>
		);
	}

	return children;
};

export default ProtectedRoute;
