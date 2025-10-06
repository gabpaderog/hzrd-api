import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { AxiosError } from "axios";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
   if(err instanceof AppError) {
      return res.status(err.statusCode).json({ 
         success: false,
         message: err.message 
      });
   }

   if(err instanceof AxiosError) {
      return res.status(err.response?.status || 500).json({ 
         success: false,
         message: err.message 
      });
   }

   return res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
   });
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
   return res.status(404).json({ 
      success: false,
      message: "Route not found"
   });
}