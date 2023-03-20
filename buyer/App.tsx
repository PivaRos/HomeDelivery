import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import {useEffect, useState} from 'react'
import { Pages } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import Home from './navigation/screens/homeScreen';
import Navicon from './components/navicon';
import Tabs from './navigation/tabs';
import * as Location from 'expo-location';
import { LocationObject } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [thelocation, setLocation] = useState<LocationObject | null | undefined>();
  const [activePage, setActivePage] = useState<Pages>(); // 1 is stores page - default
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionid, setSessionid] = useState<null | undefined | string>();

interface StorageData {
  sessionid:string;
}

  const SaveData = async (data:StorageData) => {
    try{
      await AsyncStorage.setItem("@sessionid", data.sessionid);
      UpdateData();
    }catch{

    }
  }

  const UpdateData = async () => {
    try{
      await setSessionid(await AsyncStorage.getItem("@sessionid"));
    }catch{

    }
  }

  
  useEffect(() => {
    (async () => {
     await SaveData({sessionid:"asdasdasd1"});
      console.log(sessionid);
     await SaveData({sessionid:"1122"});
      console.log(sessionid);


      try{

        let  result  = await Location.requestForegroundPermissionsAsync();
        if (result.status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          type:"point",
          coordinates:[location.coords.latitude, location.coords.longitude]
        });
      }
      catch{
        return;
      }
    })();
  }, []);

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
