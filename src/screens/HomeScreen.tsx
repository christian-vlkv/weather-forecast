import ForecastCard from '@/components/forecast/ForecastCard';
import AnimatedWeatherIcon from '@/components/ui/AnimatedWeatherIcon';
import { useHomeWeather } from '@/hooks/useHomeWeather';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const {
    searchedCity,
    setSearchedCity,
    handleSearchCity,
    handleUseCurrentLocation,
    isFetching,
    isLocating,
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
  } = useHomeWeather();

  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#4C6EF5', '#6C63FF', '#8E9BFF']} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.city} numberOfLines={1}>
              {displayCity}
            </Text>
            <Text style={styles.dateText}>{displayCountry}</Text>
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
              onSubmitEditing={handleSearchCity}
              returnKeyType="search"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.searchActionButton,
              pressed && { opacity: 0.9 },
              isFetching && { opacity: 0.5 },
            ]}
            onPress={handleSearchCity}
            disabled={isFetching}
          >
            <Ionicons name="navigate" size={20} color="#4C6EF5" />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(550)} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Today</Text>
              <Text style={styles.heroCondition}>{currentCondition}</Text>
            </View>

            <AnimatedWeatherIcon />
          </View>

          <View style={styles.heroTempRow}>
            <Text style={styles.heroTemp}>{currentTemp}</Text>
            <View style={styles.heroMinMax}>
              <Text style={styles.heroMinMaxText}>{currentHigh}</Text>
              <Text style={styles.heroMinMaxText}>{currentLow}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Ionicons name="water-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>{currentHumidity}</Text>
              <Text style={styles.metricLabel}>Humidity</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>{currentWind}</Text>
              <Text style={styles.metricLabel}>Wind</Text>
            </View>

            <View style={styles.metricCard}>
              <Ionicons name="thermometer-outline" size={18} color="#FFFFFF" />
              <Text style={styles.metricValue}>{currentFeelsLike}</Text>
              <Text style={styles.metricLabel}>Feels like</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(240).duration(500)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next 5 Days</Text>
          <Text style={styles.sectionSubtitle}>Tap a day to view hourly details</Text>
        </Animated.View>

        <View style={styles.listWrapper}>
          {displayForecastData.length > 0 ? (
            displayForecastData.map((item, index) => (
              <ForecastCard key={`${item.day}-${item.date}`} item={item} index={index} />
            ))
          ) : (
            <Text style={styles.emptyText}>{isUpdating ? 'Loading...' : 'N/A'}</Text>
          )}
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
  emptyText: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.9,
    paddingVertical: 16,
  },
});
