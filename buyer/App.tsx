import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView, ActivityIndicator, Button, ScrollView, RefreshControl, Dimensions, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react'
import { availableStores, Order, Product, savedAddress, StorageData, Store } from './interfaces';
import { NavigationContainer } from '@react-navigation/native';
import { AddressHanddler } from './components/addressHanddler';
import Tabs from './navigation/tabs';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { userActions } from './network_services/user';
import { CheckLocation } from './functions';
import { storeActions } from './network_services/stores';
import Stores from './navigation/screens/foodStoresScreen';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewStore } from './navigation/screens/viewStore';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ViewProduct } from './navigation/screens/viewProduct';
import { ViewOrder } from './navigation/screens/viewOrder';
import { ViewCheckout } from './navigation/screens/viewCheckout';
import { ViewDeliveryLoading } from './navigation/screens/viewDeliveryLoading';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [deliveryLoction, setDeliveryLoction] = useState<Location.LocationObject>();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject>()
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionid, setSessionid] = useState<null | undefined | string>();
  const [loading, setLoading] = useState(false);
  const [homeMadeStores, setHomeMadeStores] = useState<availableStores | null | undefined>();
  const [foodStores, setFoodStores] = useState<availableStores | null | undefined>();
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [savedOrder, setSavedOrder] = useState<Order | null | undefined>();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [savedAddresses, setSavedAddresses] = useState<savedAddress[]>()
  const [hideAddressHanddler, setHideAddressHanddler] = useState(false);
  const [toggleOpenAddressList, setToggleOpenAddressList] = useState(false);
  const Stack = createNativeStackNavigator();



  const windowHeight = Dimensions.get('window').height;

  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  onLayoutRootView();

  useEffect(() => {
    if (selectedProduct && !selectedProduct?.units) {
      let p = selectedProduct;
      p.units = 0;
      setSelectedProduct(p);

    }
  }, [selectedProduct])

  useEffect(() => {
    try{
      if (address) AsyncStorage.setItem("address", JSON.stringify(address));
    }catch{

    }
    (async () => {
      try{
      const date = new Date();
      const location = (await Location.geocodeAsync(address?.street + " "+ address?.streetNumber+ " "+ address?.city))[0];
    setDeliveryLoction({
      coords:{
        accuracy:location.accuracy  || null,
        altitude:location.altitude || null,
        altitudeAccuracy: null,
        latitude:location.latitude,
        longitude:location.longitude,
        speed:null, 
        heading:null, 
      },
      timestamp:date.getDate()
    })
  }
  catch{

  }
    })()
  }, [address])

  useEffect(() => {

  }, [JSON.stringify(savedOrder)])


  const setAddressCurrent = async () => {
    try {
      if (currentLocation) {
        //const adresscheck =  await Location.geocodeAsync("ברודצקי 43 תל אביב");
        //console.log(adresscheck);
        const { latitude, longitude } = currentLocation.coords
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
        setAddress(response[0]);
      }
    }
    catch {
    }
  }

  const getContent = () => {
    if (loading) return <ActivityIndicator size="small" style={{ opacity: 1, marginTop: '100%' }} />;
    if (!deliveryLoction) return <SafeAreaView><Text style={{ fontWeight: "bold", textAlign: 'center' }}>Please Allow HomeDelivery To Use Location In Order To Continue Using The App</Text><Button onPress={PressLocation} title='Allow Access' /></SafeAreaView>
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl colors={['#2874ed']} title='Refresh' refreshing={refreshing} onRefresh={onRefresh} />}>
          {!refreshing && (!hideAddressHanddler && <AddressHanddler toggleOpenAddressList={toggleOpenAddressList} setToggleOpenAddressList={setToggleOpenAddressList} setLoading={setLoading} deliveryLoction={deliveryLoction} currentLocation={currentLocation} setAddress={setAddress} setDeliveryLoction={setDeliveryLoction} address={address} />)}
          {toggleOpenAddressList && <Pressable 
              onPress={() => setToggleOpenAddressList(false)}
              style={{
                backgroundColor:'black',
                  height:windowHeight-330,
                  width:'100%',
                  opacity:0.5,
                  bottom:0,
                  position:'absolute',
                  zIndex:100
                }}>
            </Pressable>}
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
              <Stack.Screen name='tabs' children={() => <Tabs savedOrder={savedOrder} setSavedOrder={setSavedOrder} homeMadeStores={homeMadeStores} setHomeMadeStores={setHomeMadeStores} refreshing={refreshing} setSelectedStore={setSelectedStore} foodStores={foodStores} setFoodStores={setFoodStores} deliveryLocation={deliveryLoction} />} />
              {selectedStore && <Stack.Screen name='ViewStore' children={() => <ViewStore Address={address} setHideAddressHanddler={setHideAddressHanddler} savedOrder={savedOrder} setSavedOrder={setSavedOrder} setSelectedProduct={setSelectedProduct} deliveryLocation={deliveryLoction} Store={selectedStore} />} />}
              {!selectedStore && <Stack.Screen name='ViewStore' children={() => <View><Text>asasd</Text></View>} />}
              {(selectedProduct && selectedStore && savedOrder) && <Stack.Screen name='ViewProduct' children={() => <ViewProduct deliveryLocation={deliveryLoction} setSavedOrder={setSavedOrder} Store={selectedStore} savedOrder={savedOrder} setSelectedProduct={setSelectedProduct} selectedProduct={selectedProduct} />} />}
              {savedOrder && <Stack.Screen name='ViewOrder' children={() => <ViewOrder setHideAddressHanddler={setHideAddressHanddler} Order={savedOrder} />} />}
              {savedOrder && <Stack.Screen name='ViewCheckout' children={() => <ViewCheckout savedAddresses={savedAddresses} deliveryLocation={deliveryLoction} setDeliveryLocation={setDeliveryLoction} selectedStore={selectedStore} setOrder={setSavedOrder} order={savedOrder} />} />}
              {!selectedProduct && <Stack.Screen name='ViewProduct' children={() => <View>
                <Text>asdasd</Text></View>} />}
              <Stack.Screen name='ViewDeliveryLoading' children={() => <ViewDeliveryLoading/>}/>
            </Stack.Navigator>
          </NavigationContainer>
        </ScrollView>
      </SafeAreaView>

    );
  }

  useEffect(() => {
    firstloadCheck();
  }, [refreshing])


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, []);

  const PressLocation = async () => {
    const result = await CheckLocation()
    if (result) {
      setCurrentLocation(result);
      setDeliveryLoction(result);
    }

  }

  const SaveData = async (data: StorageData) => {
    try {
      await AsyncStorage.setItem("@sessionid", data.sessionid);
      UpdateData();
    } catch {

    }
  }

  const UpdateData = async () => {
    try {
      const sessionid = await AsyncStorage.getItem("@sessionid");
      const address = await AsyncStorage.getItem("address")
      setSessionid(sessionid);
      if (address) setAddress(JSON.parse(address));
     address && console.log(JSON.parse(address));
    } catch {

    }
  }

  const firstloadCheck = async () => {
    try {
      setLoading(true);
      const result = await CheckLocation()
      if (result) {
        setCurrentLocation(result);
      }
      const savedAddresses = await AsyncStorage.getItem('savedAddresses');
      const address = await AsyncStorage.getItem("address");
      if (!address) setAddressCurrent();
      else setAddress(JSON.parse(address));
      if (savedAddresses) setSavedAddresses(JSON.parse(savedAddresses));
      await UpdateData();
      setLoading(false);
    } catch{}
  }


  useEffect(() => {
    firstloadCheck();
  }, []);

  useEffect(() => {

  }, [deliveryLoction])

  return (
    getContent()
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
