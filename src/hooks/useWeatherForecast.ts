import { weatherService } from '@/service/weather/weather.service';
import { OpenWeatherForecastResponse } from '@/types/weather';
import { useQuery } from '@tanstack/react-query';

type UseWeatherForecastParams =
  | {
      mode: 'city';
      city: string;
    }
  | {
      mode: 'coords';
      lat: number;
      lon: number;
    };

export const useWeatherForecast = (params: UseWeatherForecastParams) => {
  return useQuery<OpenWeatherForecastResponse>({
    queryKey:
      params.mode === 'city'
        ? ['weather-forecast', 'city', params.city]
        : ['weather-forecast', 'coords', params.lat, params.lon],
    queryFn: () => {
      if (params.mode === 'city') {
        return weatherService.getForecastByCity(params.city);
      }

      return weatherService.getForecastByCoords(params.lat, params.lon);
    },
  });
};
