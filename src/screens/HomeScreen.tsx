import { ForecastCardProps } from '@/components/forecast/Forecast.types';
import ForecastCard from '@/components/forecast/ForecastCard';
import AnimatedWeatherIcon from '@/components/ui/AnimatedWeatherIcon';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const DEFAULT_LOCATION = {
  city: 'Sofia',
  country: 'Bulgaria',
};

const forecastData: ForecastCardProps['item'][] = [
  {
    date: 'Mon, 11 Mar',
    day: 'Monday',
    condition: 'Sunny',
    min: 12,
    max: 21,
    icon: 'weather-sunny',
  },
  {
    date: 'Tue, 12 Mar',
    day: 'Tuesday',
    condition: 'Cloudy',
    min: 11,
    max: 18,
    icon: 'weather-cloudy',
  },
  {
    date: 'Wed, 13 Mar',
    day: 'Wednesday',
    condition: 'Rainy',
    min: 9,
    max: 16,
    icon: 'weather-rainy',
  },
  {
    date: 'Thu, 14 Mar',
    day: 'Thursday',
    condition: 'Stormy',
    min: 8,
    max: 15,
    icon: 'weather-lightning-rainy',
  },
  {
    date: 'Fri, 15 Mar',
    day: 'Friday',
    condition: 'Partly Cloudy',
    min: 10,
    max: 19,
    icon: 'weather-partly-cloudy',
  },
];

export default function HomeScreen() {
  const [locationName, setLocationName] = useState(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [searchedCity, setSearchedCity] = useState('');

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

      const reverseGeocoded = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      const firstMatch = reverseGeocoded[0];

      if (!firstMatch) {
        Alert.alert('Location not found', 'We could not determine your current city.');
        return;
      }

      setLocationName({
        city: firstMatch.city || firstMatch.subregion || firstMatch.region || DEFAULT_LOCATION.city,
        country: firstMatch.country || DEFAULT_LOCATION.country,
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      Alert.alert('Location error', 'Something went wrong while retrieving your current location.');
    } finally {
      setIsLocating(false);
    }
  }, []);

  return (
    <LinearGradient colors={['#4C6EF5', '#6C63FF', '#8E9BFF']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Current Location</Text>
            <Text style={styles.city} numberOfLines={1}>
              {locationName.city}
            </Text>
            <Text style={styles.dateText}>Wednesday, March 11</Text>
          </View>

          <Pressable
            onPress={handleUseCurrentLocation}
            style={({ pressed }) => [
              styles.locationButton,
              pressed && styles.locationButtonPressed,
              isLocating && styles.locationButtonDisabled,
            ]}
            disabled={isLocating}
          >
            <Ionicons name="location" size={18} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.8)" />
            <TextInput
              placeholder="Search city"
              placeholderTextColor="rgba(255,255,255,0.75)"
              style={styles.searchInput}
              value={searchedCity}
              onChangeText={setSearchedCity}
            />
          </View>

          <Pressable style={styles.searchActionButton}>
            <Ionicons name="navigate" size={20} color="#4C6EF5" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(550)} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Today</Text>
              <Text style={styles.heroCondition}>Partly Cloudy</Text>
            </View>

            <AnimatedWeatherIcon />
          </View>

          <View style={styles.heroTempRow}>
            <Text style={styles.heroTemp}>18°</Text>
            <View style={styles.heroMinMax}>
              <Text style={styles.heroMinMaxText}>H: 21°</Text>
              <Text style={styles.heroMinMaxText}>L: 12°</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Ionicons name="water-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>62%</Text>
              <Text style={styles.metricLabel}>Humidity</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>14 km/h</Text>
              <Text style={styles.metricLabel}>Wind</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="thermometer-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>17°</Text>
              <Text style={styles.metricLabel}>Feels like</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(240).duration(500)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next 5 Days</Text>
          <Text style={styles.sectionSubtitle}>Tap a day to view hourly details</Text>
        </Animated.View>

        <View style={styles.listWrapper}>
          {forecastData.map((item, index) => (
            <ForecastCard key={`${item.day}-${item.date}`} item={item} index={index} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 72,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    marginBottom: 6,
  },
  city: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
  },
  locationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  searchInputWrapper: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchActionButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    marginBottom: 6,
  },
  heroCondition: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  heroTempRow: {
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroTemp: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  heroMinMax: {
    gap: 6,
    paddingBottom: 10,
  },
  heroMinMaxText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    textAlign: 'right',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
  },
  listWrapper: {
    gap: 12,
  },

  locationButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
});
