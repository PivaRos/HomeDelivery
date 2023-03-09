import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import React from 'react';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar/>

      <Text>Open up App.tsx to start woSn your app!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
