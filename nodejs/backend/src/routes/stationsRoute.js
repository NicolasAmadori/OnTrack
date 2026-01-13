import { Router } from 'express';

import {
    get_all_stations
} from '../controllers/stationsController.js';

import {
    getAllStationsValidator
} from "#src/validators/stationValidators.js";

const router = Router();

router.get('/search', getAllStationsValidator, get_all_stations);

export default router;
