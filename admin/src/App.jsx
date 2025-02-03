import { Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Dashboard from './pages/Dashboard';

function App() {
	return (
		<DefaultLayout>
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</DefaultLayout>
	);
}

export default App;
