import { format } from 'date-fns';

export const formatDayLabel = (dateString: string) => {
  return format(new Date(dateString), 'EEEE');
};

export const formatDateLabel = (dateString: string) => {
  return format(new Date(dateString), 'EEE, dd MMM');
};

export const capitalize = (value?: string) => {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};
