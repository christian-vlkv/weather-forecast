import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ForecastCardItem = {
  date: string;
  day: string;
  condition: string;
  min: number;
  max: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  sourceDate: string;
};

export type ForecastCardProps = {
  item: ForecastCardItem;
  index: number;
  onPress?: () => void;
};
