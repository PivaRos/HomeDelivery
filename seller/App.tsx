import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer, useScrollToTop } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewLogin } from './navigation/viewLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { ViewApp } from './navigation/viewApp';
import * as SplashScreen from 'expo-splash-screen';
import { Account } from './interfaces';
import { uri } from "./envVars";



// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const Stack = createNativeStackNavigator();

  const [sessionid, setSessionid ] = useState("");
  const [User, setUser] = useState<Account>();


  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await setSessionid(await AsyncStorage.getItem("sessionid") || "")
        await new Promise(resolve => setTimeout(resolve, 400));


      } catch (e) {

      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  onLayoutRootView();

  useEffect(() => {
    AsyncStorage.getItem("sessionid").then((result) => {
      if (result && result != "")
      {
        setSessionid(result);
        checkAccount();

      }
    })
  }, [])

  useEffect(() => {
    AsyncStorage.setItem("sessionid", sessionid);

    //check if Account Exists
    checkAccount();

  }, [sessionid])

  const checkAccount = async () => {
    if (sessionid === "") return;
    try{
    const result = await fetch(uri+"/seller/account", {
      method:'GET',
      headers:{
        "authorization":sessionid,
        'Content-Type': 'application/json'
      }
    })
    if (result.status !== 200) throw new Error("");
    const json = await result.json()
    if (json)
    {
      setUser(json as Account);
    }
    }catch(e){
      setSessionid("");
    }
  }

  return (
    <SafeAreaView  style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>

          {sessionid === "" && <Stack.Screen  name='ViewLogin' children={() => <ViewLogin setSessionid={setSessionid}/>}/>}
          {sessionid !== "" && <Stack.Screen name='ViewApp' children={() => <ViewApp sessionid={sessionid} user={User} setSessionid={setSessionid} />}/>}
        </Stack.Navigator>
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
