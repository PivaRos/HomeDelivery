import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import {useEffect, useState} from 'react'
import { Pages } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import * as Location from 'expo-location';
import { LocationObject } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


export default function App() {
  const [thelocation, setLocation] = useState<LocationObject | null | undefined>();
  const [activePage, setActivePage] = useState<Pages>(); // 1 is stores page - default
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionid, setSessionid] = useState<null | undefined | string>();

interface StorageData {
  sessionid:string;
}

 

const registerForPushNotificationsAsync = async () => {
  let token;
  try{
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
  }
  if (finalStatus !== 'granted') {
      console.log("final is not granted");
      return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;
  }catch (e){
    console.log("his is error");
    console.log(e);
    return token;
  }
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
    registerForPushNotificationsAsync();
    (async () => {
    await UpdateData();

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
