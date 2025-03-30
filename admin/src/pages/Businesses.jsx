import BusinessesTable from '../components/BusinessesTable';
import Pagination from '../components/Pagination';
const Businesses = () => {
	// TODO: connect to backend
	const businesses = [
		{
			_id: '1',
			name: 'Business Name',
			category: 'Category',
			transactions: 0,
			charges: 0,
			logo: './business-icon.png',
		},
		{
			_id: '2',
			name: 'Business Name',
			category: 'Category',
			transactions: 0,
			charges: 0,
		},
		{
			_id: '3',
			name: 'Business Name',
			category: 'Category',
			transactions: 0,
			charges: 0,
			logo: './business-icon.png',
		},
		{
			_id: '4',
			name: 'Business Name',
			category: 'Category',
			transactions: 0,
			charges: 0,
			logo: './business-icon.png',
		},
		{
			_id: '5',
			name: 'Business Name',
			category: 'Category',
			transactions: 0,
			charges: 0,
		},
	];
	return (
		<>
			<BusinessesTable businesses={businesses} />

			<Pagination totalPages={10} pageSize={10} />
		</>
	);
};

export default Businesses;
