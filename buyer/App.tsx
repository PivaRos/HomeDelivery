import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import {useState} from 'react'
import { Pages } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import Home from './navigation/screens/homeScreen';
import Navicon from './components/navicon';
import Tabs from './navigation/tabs';



export default function App() {

  const [activePage, setActivePage] = useState<Pages>(); // 1 is stores page - default

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
      <Tabs/>
      </NavigationContainer>

    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
