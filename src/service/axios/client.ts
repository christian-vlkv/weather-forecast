import axios from 'axios';

export const axiosClient = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_OPENWEATHER_BASE_URL ?? 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
