import { StyleSheet, Text, View } from 'react-native';

export default function DayDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
});
