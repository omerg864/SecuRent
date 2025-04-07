import express from 'express';
import {
	getPlaces,
	getPlaceDetails,
} from '../controllers/locationController.js';

const router = express.Router();

router.get('/', getPlaces);
router.get('/details', getPlaceDetails);

export default router;
