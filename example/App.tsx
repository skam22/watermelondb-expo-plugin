import { StyleSheet, Text, View } from 'react-native';

import * as WatermelondbExpoPlugin from 'watermelondb-expo-plugin';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{WatermelondbExpoPlugin.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
