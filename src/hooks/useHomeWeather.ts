import { useWeatherForecast } from '@/hooks/useWeatherForecast';
import { getApiErrorMessage, isApiError } from '@/service/axios/request';
import { ForecastMode, OpenWeatherForecastResponse } from '@/types/weather';
import { capitalize } from '@/utils/formatters';
import { groupForecastIntoDays, mapWeatherMainToIcon } from '@/utils/weather.utils';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

const DEFAULT_LOCATION = {
  city: 'Sofia',
  country: 'Bulgaria',
};

const DEFAULT_FORECAST_MODE: ForecastMode = {
  type: 'city',
  city: 'Sofia',
};

export const useHomeWeather = () => {
  const [committedForecast, setCommittedForecast] = useState<OpenWeatherForecastResponse | null>(
    null,
  );
  const [committedLocationName, setCommittedLocationName] = useState(DEFAULT_LOCATION);
  const [committedForecastMode, setCommittedForecastMode] =
    useState<ForecastMode>(DEFAULT_FORECAST_MODE);
  const [requestSource, setRequestSource] = useState<'initial' | 'search' | 'location' | null>(
    'initial',
  );
  const [forecastMode, setForecastMode] = useState<ForecastMode>(DEFAULT_FORECAST_MODE);
  const [isLocating, setIsLocating] = useState(false);
  const [searchedCity, setSearchedCity] = useState('');

  const queryParams =
    forecastMode.type === 'city'
      ? { mode: 'city' as const, city: forecastMode.city }
      : {
          mode: 'coords' as const,
          lat: forecastMode.lat,
          lon: forecastMode.lon,
        };

  const { data, isLoading, isFetching, error, isError, isSuccess } =
    useWeatherForecast(queryParams);

  const currentForecast = committedForecast?.list?.[0];
  const realForecastData = groupForecastIntoDays(committedForecast?.list);
  const displayForecastData = realForecastData.length > 0 ? realForecastData : [];

  const displayCity = committedForecast?.city?.name || committedLocationName.city;
  const displayCountry = committedForecast?.city?.country || committedLocationName.country;

  const currentCondition = capitalize(currentForecast?.weather?.[0]?.description) || '--';
  const currentTemp =
    currentForecast?.main?.temp !== undefined ? `${Math.round(currentForecast.main.temp)}°` : '--';
  const currentHigh =
    currentForecast?.main?.temp_max !== undefined
      ? `H: ${Math.round(currentForecast.main.temp_max)}°`
      : 'H: --';
  const currentLow =
    currentForecast?.main?.temp_min !== undefined
      ? `L: ${Math.round(currentForecast.main.temp_min)}°`
      : 'L: --';
  const currentHumidity =
    currentForecast?.main?.humidity !== undefined ? `${currentForecast.main.humidity}%` : '--';
  const currentWind =
    currentForecast?.wind?.speed !== undefined
      ? `${Math.round(currentForecast.wind.speed)} m/s`
      : '--';
  const currentFeelsLike =
    currentForecast?.main?.feels_like !== undefined
      ? `${Math.round(currentForecast.main.feels_like)}°`
      : '--';

  const currentIcon = mapWeatherMainToIcon(currentForecast?.weather?.[0]?.main);

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      setIsLocating(true);

      const existingPermission = await Location.getForegroundPermissionsAsync();
      let permissionStatus = existingPermission.status;

      if (permissionStatus !== 'granted') {
        const requestedPermission = await Location.requestForegroundPermissionsAsync();
        permissionStatus = requestedPermission.status;
      }

      if (permissionStatus !== 'granted') {
        Alert.alert(
          'Location permission needed',
          'Please allow location access to use your current position.',
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentPosition.coords;

      setRequestSource('location');
      setForecastMode({
        type: 'coords',
        lat: latitude,
        lon: longitude,
      });
    } catch (locationError) {
      Alert.alert('Location error', getApiErrorMessage(locationError));
    } finally {
      setIsLocating(false);
    }
  }, []);

  const handleSearchCity = useCallback(() => {
    const trimmedCity = searchedCity.trim();

    if (!trimmedCity) {
      Alert.alert('Invalid city', 'Please enter a valid city.');
      return;
    }

    setRequestSource('search');
    setForecastMode({
      type: 'city',
      city: trimmedCity,
    });
  }, [searchedCity]);

  const isUpdating = useMemo(
    () => isLoading || isFetching || isLocating,
    [isFetching, isLoading, isLocating],
  );

  useEffect(() => {
    if (isSuccess && data) {
      setCommittedForecast(data);
      setCommittedForecastMode(forecastMode);

      setCommittedLocationName({
        city: data.city?.name || DEFAULT_LOCATION.city,
        country: data.city?.country || DEFAULT_LOCATION.country,
      });

      if (requestSource === 'search') {
        setSearchedCity('');
      }

      setRequestSource(null);
      return;
    }

    if (isError && requestSource) {
      if (requestSource === 'search') {
        if (isApiError(error) && error.response?.status === 404) {
          Alert.alert('Invalid city', 'Please enter a valid city.');
        } else {
          Alert.alert('Search error', getApiErrorMessage(error));
        }
      } else if (requestSource === 'location') {
        Alert.alert('Location error', getApiErrorMessage(error));
      }

      setForecastMode(committedForecastMode);
      setRequestSource(null);
    }
  }, [committedForecastMode, data, error, forecastMode, isError, isSuccess, requestSource]);

  return {
    searchedCity,
    setSearchedCity,
    handleSearchCity,
    handleUseCurrentLocation,
    isFetching,
    isLocating,
    isLoading,
    isUpdating,
    displayCity,
    displayCountry,
    displayForecastData,
    currentCondition,
    currentTemp,
    currentHigh,
    currentLow,
    currentHumidity,
    currentWind,
    currentFeelsLike,
    committedForecastMode,
    currentIcon,
  };
};
