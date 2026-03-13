import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

const AnimatedWeatherIcon = ({ icon = 'weather-partly-cloudy' }: Props) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(withTiming(-6, { duration: 1800 }), withTiming(0, { duration: 1800 })),
      -1,
      false,
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons name={icon} size={84} color="#FFFFFF" />
    </Animated.View>
  );
};

export default AnimatedWeatherIcon;
