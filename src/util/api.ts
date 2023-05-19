import { OPEN_METEO_API_URL } from "./config";

const request = async <T>(url: string, config?: RequestInit): Promise<T> => {
  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json().catch(() => ({}));
};

const api = {
  get: <T>(
    url: string,
    query?: { [key: string]: string | number | string[] | number[] }
  ): Promise<T> => {
    let finalQuery = `${OPEN_METEO_API_URL}/${url}`;
    if (query) {
      finalQuery += "?";
      Object.keys(query).forEach(key => {
        if (query[key] !== undefined) {
          finalQuery += `${key}=${query[key].toString()}&`;
        }
      });
      finalQuery = finalQuery.slice(0, -1);
    }
    return request<T>(finalQuery);
  },
};

export default api;
