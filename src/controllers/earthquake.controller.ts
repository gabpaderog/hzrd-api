import asyncHandler from "../middlewares/async.middleware";
import { EarthquakeService } from "../services/earthquake.service";
import { Request, Response } from "express";

export class EarthquakeController {
   constructor(
      private earthquakeService: EarthquakeService
   ){}

   getEQList = asyncHandler(async (req: Request, res: Response) => {
      const { date } = req.query as {date?: string};

      const response = await this.earthquakeService.getEQList(date);

      res.status(200).json({
         success: true,
         data: response
      });
   });

   getEQById = asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;

      const response = await this.earthquakeService.getEQById(id);
      res.status(200).json({
         success: true,
         data: response
      });
   });

}