import env from "../config/environment";
import { axiosInstance } from "../config/axios";
import { parseEQDetail, parseEQList } from "../utils/scraper";

export class EarthquakeService {
   async getLatest() {
      const res = await axiosInstance.get(env.PHIVOLCS_EQ_URL);
      return parseEQList(res.data);
   }

   async getDetails(url: string) {
      const res = await axiosInstance.get(env.PHIVOLCS_EQ_URL + url);
      return parseEQDetail(res.data);
   }

   async getMonthly(year: string, month: string) {
      const res = await axiosInstance.get(`${env.PHIVOLCS_EQ_URL}/EQLatest-Monthly/${year}/${year}_${month}.html`);
      return parseEQList(res.data);
   }
}