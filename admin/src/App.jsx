import { Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UserRestrictedRoute from './components/routes/UserRestrictedRoute';
import Businesses from './pages/Businesses';

function App() {
	return (
		<DefaultLayout>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/login"
					element={
						<UserRestrictedRoute>
							<Login />
						</UserRestrictedRoute>
					}
				/>
				<Route
					path="/businesses"
					element={
						<ProtectedRoute>
							<Businesses />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<UserRestrictedRoute>
							<Register />
						</UserRestrictedRoute>
					}
				/>
			</Routes>
		</DefaultLayout>
	);
}

export default App;
