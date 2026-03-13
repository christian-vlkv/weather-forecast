import { useDayDetailsWeather } from '@/hooks/useDayDetailsWeather';
import { renderHook } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/hooks/useWeatherForecast', () => ({
  useWeatherForecast: jest.fn(),
}));

import { useWeatherForecast } from '@/hooks/useWeatherForecast';
import { useLocalSearchParams } from 'expo-router';

describe('useDayDetailsWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns filtered hourly items and summary for selected date', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      date: '2026-03-14',
      mode: 'city',
      city: 'Sofia',
    });

    (useWeatherForecast as jest.Mock).mockReturnValue({
      data: {
        city: { name: 'Sofia', country: 'BG' },
        list: [
          {
            dt: 1,
            dt_txt: '2026-03-14 09:00:00',
            main: {
              temp: 10,
              temp_min: 8,
              temp_max: 10,
              feels_like: 9,
              humidity: 80,
            },
            weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
            wind: { speed: 5 },
          },
          {
            dt: 2,
            dt_txt: '2026-03-14 12:00:00',
            main: {
              temp: 14,
              temp_min: 9,
              temp_max: 15,
              feels_like: 13,
              humidity: 70,
            },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 4 },
          },
          {
            dt: 3,
            dt_txt: '2026-03-15 12:00:00',
            main: {
              temp: 20,
              temp_min: 18,
              temp_max: 21,
              feels_like: 19,
              humidity: 50,
            },
            weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
            wind: { speed: 6 },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useDayDetailsWeather());

    expect(result.current.daySummary).toMatchObject({
      city: 'Sofia',
      country: 'BG',
      condition: 'Clear sky',
      min: 'L: 8°',
      max: 'H: 15°',
      icon: 'weather-sunny',
    });

    expect(result.current.hourlyItems).toHaveLength(2);
    expect(result.current.hourlyItems[0]).toMatchObject({
      time: '09:00',
      temp: '10°',
      condition: 'Scattered clouds',
      humidity: '80%',
      wind: '5 m/s',
      icon: 'weather-cloudy',
    });
  });

  it('returns empty values when there is no matching date data', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      date: '2026-03-20',
      mode: 'city',
      city: 'Sofia',
    });

    (useWeatherForecast as jest.Mock).mockReturnValue({
      data: {
        city: { name: 'Sofia', country: 'BG' },
        list: [],
      },
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useDayDetailsWeather());

    expect(result.current.daySummary).toBeNull();
    expect(result.current.hourlyItems).toEqual([]);
  });
});
