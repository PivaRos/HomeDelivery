import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, ActivityIndicator, Button, ScrollView, RefreshControl} from 'react-native';
import {useCallback, useEffect, useState} from 'react'
import { availableStores, StorageData, Store } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import { AddressHanddler } from './components/addressHanddler';
import Tabs from './navigation/tabs';
import * as Location from 'expo-location';
import { LocationObject } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { userActions } from './hooks/user';
import { CheckLocation } from './functions';
import { storeActions } from './hooks/stores';
import Stores from './navigation/screens/storesScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewStore } from './navigation/screens/viewStore';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [thelocation, setLocation] = useState<LocationObject | null | undefined>();
  const [fullCoords, setFullCoords] = useState<Location.LocationObjectCoords>()
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionid, setSessionid] = useState<null | undefined | string>();
  const [loading, setLoading] = useState(false);
  const [availableStores, setAvailableStores] = useState<availableStores | null | undefined>();
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [refreshing, setRefreshing] = useState(false);



  const Stack = createNativeStackNavigator();

  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  onLayoutRootView();


const getContent = () => {
  if (loading) return <ActivityIndicator size="small" style={{opacity:1, marginTop:'100%'}}/>;
  if (!thelocation) return <SafeAreaView><Text style={{fontWeight:"bold", textAlign:'center'}}>Please Allow HomeDelivery To Use Location In Order To Continue Using The App</Text><Button onPress={PressLocation} title='Allow Access'/></SafeAreaView>
  return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl colors={['#2874ed']} title='Refresh'  refreshing={refreshing} onRefresh={onRefresh}/>}>
    <View style={{height:30, backgroundColor:'lightgreen'}}>
      <AddressHanddler fullcoords={fullCoords} />
    </View>
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false, fullScreenGestureEnabled:true}}>
      <Stack.Screen name='tabs' children={() => <Tabs refreshing={refreshing} setSelectedStore={setSelectedStore} Stores={availableStores} setAvailableStores={setAvailableStores} location={thelocation}/>} />
      <Stack.Screen name='ViewStore' children={() => <ViewStore Store={selectedStore}/>}  />
    </Stack.Navigator>
    </NavigationContainer>
    </ScrollView>
  </SafeAreaView>

  );
}


const onRefresh = useCallback( async () => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false)
  }, 1500)
}, []);

const PressLocation = async () => {
  const result = await CheckLocation()
  if (result)
  {
    setLocation(result.thelocation);
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
      const sessionid = await AsyncStorage.getItem("@sessionid");
        setSessionid(sessionid);

    }catch{

    }
  }

  const firstloadCheck = async () => {
    try{
      setLoading(true);
      const result = await CheckLocation()
      if (result)
      {
        setLocation(result.thelocation);
        setFullCoords(result.fullcoords);
      }

      await UpdateData();
      setLoading(false);
    }catch(e){
      console.log(e)
    }
  }

  
  useEffect(() => {
    firstloadCheck();
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
