import { useWeatherForecast } from '@/hooks/useWeatherForecast';
import { capitalize } from '@/utils/formatters';
import { mapWeatherMainToIcon } from '@/utils/weather.utils';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

type DayDetailsRouteParams = {
  date: string;
  mode: 'city' | 'coords';
  city?: string;
  lat?: string;
  lon?: string;
};

export const useDayDetailsWeather = () => {
  const params = useLocalSearchParams<DayDetailsRouteParams>();

  const queryParams =
    params.mode === 'city'
      ? {
          mode: 'city' as const,
          city: params.city || 'Sofia',
        }
      : {
          mode: 'coords' as const,
          lat: Number(params.lat),
          lon: Number(params.lon),
        };

  const { data, isLoading, isFetching } = useWeatherForecast(queryParams);

  const selectedDayItems = useMemo(() => {
    if (!data?.list?.length || !params.date) {
      return [];
    }

    return data.list.filter(item => format(parseISO(item.dt_txt), 'yyyy-MM-dd') === params.date);
  }, [data?.list, params.date]);

  const daySummary = useMemo(() => {
    if (!selectedDayItems.length) {
      return null;
    }

    const min = Math.min(...selectedDayItems.map(item => item.main.temp_min));
    const max = Math.max(...selectedDayItems.map(item => item.main.temp_max));

    const representativeItem =
      selectedDayItems.find(item => format(parseISO(item.dt_txt), 'HH:mm:ss') === '12:00:00') ||
      selectedDayItems[Math.floor(selectedDayItems.length / 2)];

    return {
      dayLabel: format(parseISO(`${params.date}T00:00:00`), 'EEEE'),
      dateLabel: format(parseISO(`${params.date}T00:00:00`), 'EEE, dd MMM'),
      city: data?.city?.name || '--',
      country: data?.city?.country || '--',
      condition: capitalize(representativeItem.weather[0]?.description) || '--',
      min: `L: ${Math.round(min)}°`,
      max: `H: ${Math.round(max)}°`,
      icon: mapWeatherMainToIcon(representativeItem.weather[0]?.main),
    };
  }, [data?.city?.country, data?.city?.name, params.date, selectedDayItems]);

  const hourlyItems = useMemo(() => {
    return selectedDayItems.map(item => ({
      id: `${item.dt}`,
      time: format(parseISO(item.dt_txt), 'HH:mm'),
      temp: `${Math.round(item.main.temp)}°`,
      condition: capitalize(item.weather[0]?.description) || '--',
      humidity: `${item.main.humidity}%`,
      wind: `${Math.round(item.wind.speed)} m/s`,
      icon: mapWeatherMainToIcon(item.weather[0]?.main),
    }));
  }, [selectedDayItems]);

  return {
    isLoading,
    isFetching,
    daySummary,
    hourlyItems,
  };
};
