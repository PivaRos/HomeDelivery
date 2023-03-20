import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, ActivityIndicator, Button} from 'react-native';
import {useEffect, useState} from 'react'
import { StorageData, Store } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';
import * as Location from 'expo-location';
import { LocationObject } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { userActions } from './hooks/user';
import { CheckLocation } from './functions';
import { storeActions } from './hooks/stores';

export default function App() {
  const [thelocation, setLocation] = useState<LocationObject | null | undefined>();
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionid, setSessionid] = useState<null | undefined | string>();
  const [loading, setLoading] = useState(false);
  const [availableStores, setAvailableStores] = useState<Store[] | [{}]>([{}]);


const getContent = () => {
  console.log("the location is: " +thelocation?.coordinates);
  if (loading) return <ActivityIndicator size="small" style={{opacity:1, marginTop:'100%'}}/>;
  if (!thelocation) return <SafeAreaView><Text style={{fontWeight:"bold", textAlign:'center'}}>Please Allow HomeDelivery To Use Location In Order To Continue Using The App</Text><Button onPress={CheckForLocation} title='Allow Access'/></SafeAreaView>
  return (
  <SafeAreaView style={styles.container}>
    <NavigationContainer>
    <Tabs/>
    </NavigationContainer>
  </SafeAreaView>

  );
}






const CheckForLocation = async () => {
  
  const response =  await Location.requestForegroundPermissionsAsync();
  if (response.granted)
  {
    setLocation(await CheckLocation());
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
      console.log(sessionid);
    }catch{

    }
  }

  
  useEffect(() => {
    try{
    setLoading(true);
    (async () => {
    //registerForPushNotificationsAsync();
    UpdateData();
    setLocation(await CheckLocation());
    if (thelocation)
    {
      setAvailableStores(await storeActions.GetStores(thelocation));
      


    }
    setLoading(false);

   })()
   
    
    //userActions.GetUserData("asdasdasd");

    }catch{


    }


    if (sessionid)
    {
      
    }


  }, []);

  return (
    getContent()
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
