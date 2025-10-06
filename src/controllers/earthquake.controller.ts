import asyncHandler from "../middlewares/async.middleware";
import { EarthquakeService } from "../services/earthquake.services";
import { Request, Response } from "express";

export class EarthquakeController {
   constructor(
      private earthquakeService: EarthquakeService
   ){}

   getLatest = asyncHandler(async (req: Request, res: Response) => {
      const response = await this.earthquakeService.getLatest();

      res.status(200).json({
         success: true,
         data: response
      });
   });

   getDetail = asyncHandler(async (req: Request, res: Response) => {
      const { url } = req.query;
      if(!url || typeof url !== 'string') {
         return res.status(400).json({ message: "Invalid URL parameter" });
      }

      const response = await this.earthquakeService.getDetail(url)
      res.status(200).json({
         success: true,
         data: response
      });
   });

   getMonthly = asyncHandler(async (req: Request, res: Response) => {
      const { year, month } = req.params;
      if(!year || !month) {
         return res.status(400).json({ message: "Year and month parameters are required" });
      }

      const response = await this.earthquakeService.getMonthly(year, month);
      res.status(200).json({
         success: true,
         data: response
      });
   });

}