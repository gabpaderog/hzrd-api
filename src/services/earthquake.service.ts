import env from "../config/environment";
import { axiosInstance } from "../config/axios";
import { EQParams } from "../types/earthquake.type";
import { parseEQDetail, parseEQList } from "../parser/earthquake.parser";
import { getMonth, months } from "../utils/date";
import { NotFoundError } from "../utils/error";

export class EarthquakeService {
  private baseUrl = env.PHIVOLCS_EQ_URL;

  async getEQList(date?: string) {
  let url = this.baseUrl;
  let year: string | undefined;
  let month: string | undefined;
  const isCurrent = !date;

  if (date) {
    [year, month] = date.split("-");

    const yearNum = parseInt(year, 10);
    if (yearNum < 2018) return { message: "No data found for years before 2018" };

    const monthName = months[parseInt(month, 10) - 1];
    url = `${this.baseUrl}/EQLatest-Monthly/${year}/${year}_${monthName}.html`;
  }

  const { data } = await axiosInstance.get(url);
  return parseEQList(data, { year, isCurrent });
}

  async getEQById(id: string) {
    const [year, datePart] = id.split("_");
    const monthNumber = datePart.slice(0, 2); 
    const monthName = getMonth(monthNumber);

    const { data } = await axiosInstance.get(
      `${this.baseUrl}/${year}_Earthquake_Information/${monthName}/${id}.html`
    );

    return parseEQDetail(data);
  }
}
