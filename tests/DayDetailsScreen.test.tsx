import DayDetailsScreen from '@/app/day/[date]';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/hooks/useDayDetailsWeather', () => ({
  useDayDetailsWeather: jest.fn(),
}));

jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: () => 56,
}));

jest.mock('@/components/ui/AnimatedWeatherIcon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockAnimatedWeatherIcon() {
    return <Text>AnimatedWeatherIcon</Text>;
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name, testID }: { name?: string; testID?: string }) => (
    <Text testID={testID}>{name ?? 'icon'}</Text>
  );

  return {
    MaterialCommunityIcons: MockIcon,
    Ionicons: MockIcon,
    Feather: MockIcon,
    FontAwesome: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
  };
});

const mockUseDayDetailsWeather = require('@/hooks/useDayDetailsWeather').useDayDetailsWeather;

describe('DayDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseDayDetailsWeather.mockReturnValue({
      isLoading: true,
      isFetching: false,
      daySummary: null,
      hourlyItems: [],
    });

    const { getByText } = render(<DayDetailsScreen />);

    expect(getByText('Day Details')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders hourly items', () => {
    mockUseDayDetailsWeather.mockReturnValue({
      isLoading: false,
      isFetching: false,
      daySummary: {
        dayLabel: 'Friday',
        dateLabel: 'Fri, 14 Mar',
        city: 'Sofia',
        country: 'BG',
        condition: 'Clear sky',
        min: 'L: 6°',
        max: 'H: 15°',
        icon: 'weather-sunny',
      },
      hourlyItems: [
        {
          id: '1',
          time: '09:00',
          temp: '10°',
          condition: 'Clear sky',
          humidity: '70%',
          wind: '4 m/s',
          icon: 'weather-sunny',
        },
      ],
    });

    const { getByText } = render(<DayDetailsScreen />);

    expect(getByText('Friday')).toBeTruthy();
    expect(getByText('09:00')).toBeTruthy();
    expect(getByText('10°')).toBeTruthy();
  });
});
