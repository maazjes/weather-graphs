export type GetHourlyTemperaturesQuery = {
  latitude: number;
  longitude: number;
};

export type GetHourlyTemperaturesRes = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: "GMT";
  timezone_abbreviation: "GMT";
  hourly_units: {
    time: "iso8601";
    temperature: "°C";
  };
  hourly: {
    time: Date[];
    temperature_2m: number[];
  };
};
