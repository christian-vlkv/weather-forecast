import AnimatedWeatherIcon from '@/components/ui/AnimatedWeatherIcon';
import { useDayDetailsWeather } from '@/hooks/useDayDetailsWeather';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function DayDetailsScreen() {
  const { isLoading, isFetching, daySummary, hourlyItems } = useDayDetailsWeather();
  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient colors={['#4C6EF5', '#6C63FF', '#8E9BFF']} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Text style={styles.locationLabel}>Day Details</Text>
          <Text style={styles.city}>{daySummary?.dayLabel || '--'}</Text>
          <Text style={styles.dateText}>{daySummary?.dateLabel || '--'}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>
                {daySummary?.city || '--'}, {daySummary?.country || '--'}
              </Text>
              <Text style={styles.heroCondition}>{daySummary?.condition || '--'}</Text>
            </View>

            <AnimatedWeatherIcon icon={daySummary?.icon} />
          </View>

          <View style={styles.heroTempRow}>
            <View style={styles.heroMinMax}>
              <Text style={styles.heroMinMaxText}>{daySummary?.max || 'H: --'}</Text>
              <Text style={styles.heroMinMaxText}>{daySummary?.min || 'L: --'}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(500)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <Text style={styles.sectionSubtitle}>Forecast for the selected day</Text>
        </Animated.View>

        <View style={styles.listWrapper}>
          {hourlyItems.length > 0 ? (
            hourlyItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(220 + index * 70).duration(400)}
              >
                <View style={styles.hourCard}>
                  <View style={styles.hourLeft}>
                    <View style={styles.hourIconWrapper}>
                      <MaterialCommunityIcons name={item.icon} size={24} color="#FFFFFF" />
                    </View>

                    <View>
                      <Text style={styles.hourTime}>{item.time}</Text>
                      <Text style={styles.hourCondition}>{item.condition}</Text>
                    </View>
                  </View>

                  <View style={styles.hourRight}>
                    <Text style={styles.hourTemp}>{item.temp}</Text>

                    <View style={styles.hourMetrics}>
                      <View style={styles.hourMetricRow}>
                        <Ionicons name="water-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.hourMetricText}>{item.humidity}</Text>
                      </View>

                      <View style={styles.hourMetricRow}>
                        <Ionicons name="speedometer-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.hourMetricText}>{item.wind}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {isLoading || isFetching ? 'Loading...' : 'No hourly data available.'}
            </Text>
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
    paddingTop: 72,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
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
  hourCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hourLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  hourIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourTime: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  hourCondition: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
  },
  hourRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  hourTemp: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  hourMetrics: {
    gap: 4,
  },
  hourMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
  },
  hourMetricText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.9,
    paddingVertical: 16,
  },
});
