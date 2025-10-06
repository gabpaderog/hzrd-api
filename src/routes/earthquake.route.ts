import { Router } from "express";
import { EarthquakeController } from "../controllers/earthquake.controller";
import { EarthquakeService } from "../services/earthquake.service";

const router = Router();
const earthquakeService = new EarthquakeService();
const earthquakeController = new EarthquakeController(earthquakeService);

router.get("/latest", earthquakeController.getLatest);
router.get("/details", earthquakeController.getDetails)
router.get("/:year/:month", earthquakeController.getMonthly);

export default router;