import { queryClient } from '@/service/query/query.client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Weather Forecast',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: 'Day Details',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
