import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ForecastCardProps = {
  item: {
    date: string;
    day: string;
    condition: string;
    min: number;
    max: number;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  };
  index: number;
};
