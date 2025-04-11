import asyncHandler from 'express-async-handler';
import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const getPlaces = asyncHandler(async (req, res) => {
	const { query } = req.query;
	if (!query) return res.status(400).json({ error: 'Missing query' });

	try {
		const response = await axios.get(
			'https://maps.googleapis.com/maps/api/place/autocomplete/json',
			{
				params: {
					input: query,
					key: GOOGLE_API_KEY,
					types: 'address',
				},
			}
		);

		res.json({
			success: true,
			predictions: response.data.predictions.map((prediction) => ({
				id: prediction.place_id,
				description: prediction.description,
			})),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Google API error' });
	}
});

const getPlaceDetails = asyncHandler(async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(400).json({ error: 'Missing placeId' });

	try {
		const response = await axios.get(
			'https://maps.googleapis.com/maps/api/place/details/json',
			{
				params: {
					place_id: id,
					key: GOOGLE_API_KEY,
				},
			}
		);

		const result = response.data.result;
		const location = result.geometry.location;

		res.json({
			success: true,
			address: result.formatted_address,
			location: location, // { lat, lng }
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Google API error' });
	}
});

export { getPlaces, getPlaceDetails };
