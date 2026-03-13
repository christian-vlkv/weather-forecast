import { ForecastCardProps } from '@/components/forecast/Forecast.types';
import { format, parseISO } from 'date-fns';
import { capitalize, formatDateLabel, formatDayLabel } from './formatters';

export const mapWeatherMainToIcon = (value?: string): ForecastCardProps['item']['icon'] => {
  switch (value?.toLowerCase()) {
    case 'clear':
      return 'weather-sunny';
    case 'clouds':
      return 'weather-cloudy';
    case 'rain':
      return 'weather-rainy';
    case 'drizzle':
      return 'weather-rainy';
    case 'thunderstorm':
      return 'weather-lightning-rainy';
    case 'snow':
      return 'weather-snowy';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'weather-fog';
    default:
      return 'weather-partly-cloudy';
  }
};

export const groupForecastIntoDays = (
  list?: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }[],
): ForecastCardProps['item'][] => {
  if (!list?.length) {
    return [];
  }

  const groupedByDay = list.reduce<Record<string, typeof list>>((acc, item) => {
    const dayKey = format(parseISO(item.dt_txt), 'yyyy-MM-dd');

    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }

    acc[dayKey].push(item);
    return acc;
  }, {});

  return Object.entries(groupedByDay)
    .slice(0, 5)
    .map(([date, items]) => {
      const min = Math.min(...items.map(item => item.main.temp_min));
      const max = Math.max(...items.map(item => item.main.temp_max));

      const representativeItem =
        items.find(item => format(parseISO(item.dt_txt), 'HH:mm:ss') === '12:00:00') ||
        items[Math.floor(items.length / 2)];

      const weatherMain = representativeItem.weather[0]?.main;
      const description = representativeItem.weather[0]?.description;

      return {
        sourceDate: date,
        date: formatDateLabel(date),
        day: formatDayLabel(date),
        condition: capitalize(description),
        min: Math.round(min),
        max: Math.round(max),
        icon: mapWeatherMainToIcon(weatherMain),
      };
    });
};
