import { groupForecastIntoDays, mapWeatherMainToIcon } from '@/utils/weather.utils';

describe('mapWeatherMainToIcon', () => {
  it('maps clear to sunny icon', () => {
    expect(mapWeatherMainToIcon('Clear')).toBe('weather-sunny');
  });

  it('maps clouds to cloudy icon', () => {
    expect(mapWeatherMainToIcon('Clouds')).toBe('weather-cloudy');
  });

  it('maps rain to rainy icon', () => {
    expect(mapWeatherMainToIcon('Rain')).toBe('weather-rainy');
  });

  it('falls back to partly cloudy for unknown values', () => {
    expect(mapWeatherMainToIcon('SomethingElse')).toBe('weather-partly-cloudy');
    expect(mapWeatherMainToIcon(undefined)).toBe('weather-partly-cloudy');
  });
});

describe('groupForecastIntoDays', () => {
  it('returns empty array when list is missing', () => {
    expect(groupForecastIntoDays()).toEqual([]);
  });

  it('groups items by day and returns summarized forecast data', () => {
    const list = [
      {
        dt: 1,
        dt_txt: '2026-03-13 09:00:00',
        main: {
          temp: 12,
          temp_min: 10,
          temp_max: 13,
          feels_like: 11,
          humidity: 60,
        },
        weather: [{ main: 'Clouds', description: 'broken clouds', icon: '03d' }],
        wind: { speed: 3 },
      },
      {
        dt: 2,
        dt_txt: '2026-03-13 12:00:00',
        main: {
          temp: 15,
          temp_min: 11,
          temp_max: 16,
          feels_like: 14,
          humidity: 55,
        },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 4 },
      },
      {
        dt: 3,
        dt_txt: '2026-03-14 12:00:00',
        main: {
          temp: 8,
          temp_min: 6,
          temp_max: 9,
          feels_like: 7,
          humidity: 70,
        },
        weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
        wind: { speed: 6 },
      },
    ];

    const result = groupForecastIntoDays(list);

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      sourceDate: '2026-03-13',
      condition: 'Clear sky',
      min: 10,
      max: 16,
      icon: 'weather-sunny',
    });

    expect(result[1]).toMatchObject({
      sourceDate: '2026-03-14',
      condition: 'Light rain',
      min: 6,
      max: 9,
      icon: 'weather-rainy',
    });
  });

  it('prefers the 12:00 item as representative when present', () => {
    const list = [
      {
        dt: 1,
        dt_txt: '2026-03-13 09:00:00',
        main: {
          temp: 12,
          temp_min: 10,
          temp_max: 12,
          feels_like: 11,
          humidity: 60,
        },
        weather: [{ main: 'Clouds', description: 'broken clouds', icon: '03d' }],
        wind: { speed: 3 },
      },
      {
        dt: 2,
        dt_txt: '2026-03-13 12:00:00',
        main: {
          temp: 15,
          temp_min: 11,
          temp_max: 16,
          feels_like: 14,
          humidity: 55,
        },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 4 },
      },
    ];

    const result = groupForecastIntoDays(list);

    expect(result[0].condition).toBe('Clear sky');
    expect(result[0].icon).toBe('weather-sunny');
  });

  it('returns empty array when list is empty', () => {
    expect(groupForecastIntoDays([])).toEqual([]);
  });

  it('uses a fallback representative item when 12:00 is missing', () => {
    const list = [
      {
        dt: 1,
        dt_txt: '2026-03-13 09:00:00',
        main: { temp: 12, temp_min: 10, temp_max: 13, feels_like: 11, humidity: 60 },
        weather: [{ main: 'Clouds', description: 'broken clouds', icon: '03d' }],
        wind: { speed: 3 },
      },
      {
        dt: 2,
        dt_txt: '2026-03-13 15:00:00',
        main: { temp: 16, temp_min: 11, temp_max: 17, feels_like: 15, humidity: 50 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 4 },
      },
    ];

    const result = groupForecastIntoDays(list);

    expect(result).toHaveLength(1);
    expect(result[0].min).toBe(10);
    expect(result[0].max).toBe(17);
  });
});
