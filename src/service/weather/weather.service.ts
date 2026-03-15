import { OpenWeatherForecastResponse } from '@/types/weather';
import { axiosRequest } from '../axios/request';

// i know this is not the best practice to expose the key this way
// but its for testing purposes and easier to run the project
const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? 'cf7bba1f5018334d1490a4d799245d83';

if (!API_KEY) {
  console.warn('Missing EXPO_PUBLIC_OPENWEATHER_API_KEY');
}

export const weatherService = {
  getForecastByCity: async (city: string) => {
    return axiosRequest.get<OpenWeatherForecastResponse>('/forecast', {
      q: city,
      appid: API_KEY,
      units: 'metric',
    });
  },

  getForecastByCoords: async (lat: number, lon: number) => {
    return axiosRequest.get<OpenWeatherForecastResponse>('/forecast', {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    });
  },
};
