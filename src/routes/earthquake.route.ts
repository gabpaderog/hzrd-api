import { Router } from "express";
import { EarthquakeController } from "../controllers/earthquake.controller";
import { EarthquakeService } from "../services/earthquake.service";

const router = Router();
const earthquakeService = new EarthquakeService();
const earthquakeController = new EarthquakeController(earthquakeService);

router.get("/", earthquakeController.getEQList);
router.get("/:id", earthquakeController.getEQById);


export default router;
