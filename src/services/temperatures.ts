import { GetHourlyTemperaturesQuery, GetHourlyTemperaturesRes } from "../types";
import api from "../util/api";
import { getDate } from "../util/helpers";

const getHourlyTemperatures = (query: GetHourlyTemperaturesQuery) => {
  const todaysDate = getDate();
  return api.get<GetHourlyTemperaturesRes>("v1/forecast", {
    ...query,
    hourly: "temperature_2m",
    start_date: todaysDate,
    end_date: todaysDate,
  });
};

const getBulkHourlyTemperatures = (queries: GetHourlyTemperaturesQuery[]) =>
  Promise.all(
    queries.map(query =>
      getHourlyTemperatures({
        latitude: query.latitude,
        longitude: query.longitude,
      })
    )
  );

export { getHourlyTemperatures, getBulkHourlyTemperatures };
