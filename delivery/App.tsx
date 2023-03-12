import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
