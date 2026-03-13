import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ForecastCardProps } from './Forecast.types';

const ForecastCard = ({ item, index, onPress }: ForecastCardProps) => {
  return (
    <Animated.View entering={FadeInDown.delay(250 + index * 100).duration(500)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.dayCard, pressed && styles.dayCardPressed]}
      >
        <View style={styles.dayLeft}>
          <View style={styles.dayIconWrapper}>
            <MaterialCommunityIcons name={item.icon} size={28} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.dayTitle}>{item.day}</Text>
            <Text style={styles.dayDate}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.dayRight}>
          <Text style={styles.dayCondition}>{item.condition}</Text>
          <Text style={styles.dayTemp}>
            {item.max}° / <Text style={styles.dayTempMin}>{item.min}°</Text>
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dayCard: {
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
  dayCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dayIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  dayDate: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
  },

  dayRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dayCondition: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
  },
  dayTemp: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  dayTempMin: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '500',
  },
});

export default React.memo(ForecastCard);
