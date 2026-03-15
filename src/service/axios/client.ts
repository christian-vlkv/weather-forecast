import axios from 'axios';

const OPENWEATHER_BASE_URL =
  process.env.EXPO_PUBLIC_OPENWEATHER_BASE_URL ?? 'https://api.openweathermap.org/data/2.5';

export const axiosClient = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
