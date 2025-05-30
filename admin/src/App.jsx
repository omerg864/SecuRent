import { Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UserRestrictedRoute from './components/routes/UserRestrictedRoute';
import Businesses from './pages/Businesses';
import SingleBusiness from './pages/SingleBusiness';
import Reports from './pages/Reports';
import SingleReport from './pages/SingleReport';
import SingleCustomer from './pages/SingleCustomer';
import Customers from './pages/Customers';
import SingleTransaction from './pages/SingleTransaction';
import SingleReview from './pages/SingleReview';
import Notifications from './pages/Notifications';
import ProfilePage from './pages/ProfilePage';

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
					path="/customers"
					element={
						<ProtectedRoute>
							<Customers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reports"
					element={
						<ProtectedRoute>
							<Reports />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoute>
							<Notifications />
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
				<Route
					path="/business/:id"
					element={
						<ProtectedRoute>
							<SingleBusiness />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/report/:id"
					element={
						<ProtectedRoute>
							<SingleReport />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/customer/:id"
					element={
						<ProtectedRoute>
							<SingleCustomer />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/transaction/:id"
					element={
						<ProtectedRoute>
							<SingleTransaction />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/review/:id"
					element={
						<ProtectedRoute>
							<SingleReview />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile/"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</DefaultLayout>
	);
}

export default App;
