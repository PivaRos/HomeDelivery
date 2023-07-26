import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Button,
  ScrollView,
  RefreshControl,
  Dimensions,
  Pressable,
  Animated,
  useAnimatedValue,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  availableStores,
  Order,
  Product,
  savedAddress,
  StorageData,
  Store,
} from "./interfaces";
import { NavigationContainer } from "@react-navigation/native";
import { AddressHanddler } from "./components/addressHanddler";
import Tabs from "./navigation/tabs";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { userActions } from "./network_services/user";
import { CheckLocation } from "./functions";
import { storeActions } from "./network_services/stores";
import Stores from "./navigation/screens/foodStoresScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewStore } from "./navigation/screens/viewStore";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ViewProduct } from "./navigation/screens/viewProduct";
import { ViewOrder } from "./navigation/screens/viewOrder";
import { ViewCheckout } from "./navigation/screens/viewCheckout";
import { ViewDeliveryLoading } from "./navigation/screens/viewDeliveryLoading";
import { useDispatch, useSelector } from "react-redux";
import { DeliveryLocationAction } from "./redux/actions/DeliveryLocationAction";
import { CurrentLocationAction } from "./redux/actions/CurrentLocationAction";
import {
  StartRefreshingAction,
  StopRefreshingAction,
} from "./redux/actions/RefreshingActions";
import {
  StartLoadingAction,
  StopLoadingAction,
} from "./redux/actions/LoadingActions";
import { SelectedProductAction } from "./redux/actions/SelectedProductAction";
import { setSavedAddressesAction } from "./redux/actions/SavedAddressesActions";
import { AddressAction } from "./redux/actions/AddressAction";
import NetInfo from "@react-native-community/netinfo";
import { InternetConnectionAction } from "./redux/actions/InterntConnectionAction";
import { ToggleCloseAddressListAction } from "./redux/actions/ToggleAddressListActions";

SplashScreen.preventAutoHideAsync();

export default function Container() {
  const Dispatch = useDispatch();

  const internetConnection = useSelector(
    (state: any) => state.internetConnection
  ) as boolean;

  const refreshing = useSelector((state: any) => state.refreshing) as boolean;
  const loading = useSelector((state: any) => state.loading) as boolean;
  const selectedStore = useSelector(
    (state: any) => state.selectedStore
  ) as Store;
  const selectedProduct = useSelector(
    (state: any) => state.selectedProduct
  ) as Product;
  const savedOrder = useSelector((state: any) => state.savedOrder) as Order;
  const deliveryLocation = useSelector(
    (state: any) => state.deliveryLocation
  ) as Location.LocationObject;
  const currentLocation = useSelector(
    (state: any) => state.currentLocation
  ) as Location.LocationObject;
  const savedAddresses = useSelector((state: any) => state.savedAddresses);
  const address = useSelector((state: any) => state.address);
  const toggleOpenAddressList = useSelector(
    (state: any) => state.toggleOpenAddressList
  );

  const hasInternetValueY = useRef(new Animated.Value(-40)).current;
  const hasInternetValueYBack = useRef(new Animated.Value(-40)).current;

  const [sessionid, setSessionid] = useState<null | undefined | string>();

  const [hideAddressHanddler, setHideAddressHanddler] = useState(false);

  const Stack = createNativeStackNavigator();

  const [fromDestination, setFromDestination] =
    useState<Location.LocationGeocodedAddress>({
      city: null,
      country: null,
      district: null,
      isoCountryCode: null,
      name: null,
      postalCode: null,
      region: null,
      street: null,
      streetNumber: null,
      subregion: null,
      timezone: null,
    });
  const [toDestination, setToDestination] =
    useState<Location.LocationGeocodedAddress>({
      city: null,
      country: null,
      district: null,
      isoCountryCode: null,
      name: null,
      postalCode: null,
      region: null,
      street: null,
      streetNumber: null,
      subregion: null,
      timezone: null,
    });

  const [fromLocation, setFromLocation] =
    useState<Location.LocationGeocodedLocation>();
  const [toLocation, setToLocation] =
    useState<Location.LocationGeocodedLocation>();

  const windowHeight = Dimensions.get("window").height;

  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    try {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    } catch {}
  }, [fontsLoaded]);
  onLayoutRootView();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== null) {
        if (state.isConnected != internetConnection) {
          Dispatch(InternetConnectionAction(state.isConnected));
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedProduct && !selectedProduct?.units) {
      let p = selectedProduct;
      p.units = 0;
      Dispatch(SelectedProductAction(p));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (internetConnection) {
      Animated.timing(hasInternetValueYBack, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      Animated.timing(hasInternetValueYBack, {
        toValue: -40,
        duration: 250,
        useNativeDriver: true,
        delay: 350,
      }).start();
    } else {
      Animated.timing(hasInternetValueY, {
        toValue: 40,
        duration: 250,
        useNativeDriver: true,
      }).start();
      Animated.timing(hasInternetValueY, {
        toValue: -40,
        duration: 250,
        useNativeDriver: true,
        delay: 350,
      }).start();
    }
  }, [internetConnection]);

  useEffect(() => {
    try {
      if (address) AsyncStorage.setItem("address", JSON.stringify(address));
    } catch {}
    (async () => {
      try {
        const date = new Date();
        const location = (
          await Location.geocodeAsync(
            address?.street + " " + address?.streetNumber + " " + address?.city
          )
        )[0];
        Dispatch(
          DeliveryLocationAction({
            coords: {
              accuracy: location.accuracy || null,
              altitude: location.altitude || null,
              altitudeAccuracy: null,
              latitude: location.latitude,
              longitude: location.longitude,
              speed: null,
              heading: null,
            },
            timestamp: date.getDate(),
          })
        );
      } catch {}
    })();
  }, [address]);

  useEffect(() => {
    console.log("toggleOpenAddressList : " + toggleOpenAddressList);
  }, [toggleOpenAddressList]);

  const setAddressCurrent = async () => {
    try {
      if (currentLocation) {
        const { latitude, longitude } = currentLocation.coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        Dispatch(AddressAction(response[0]));
      }
    } catch {}
  };

  const getContent = () => {
    if (loading)
      return (
        <ActivityIndicator
          size="small"
          style={{ opacity: 1, marginTop: "100%" }}
        />
      );
    if (!deliveryLocation)
      return (
        <SafeAreaView>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Please Allow HomeDelivery To Use Location In Order To Continue Using
            The App
          </Text>
          <Button onPress={PressLocation} title="Allow Access" />
        </SafeAreaView>
      );
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={{
            top: 0,
            backgroundColor: "grey",
            width: "100%",
            height: 40,
            justifyContent: "center",
            opacity: 1,
            transform: [{ translateY: hasInternetValueY }],
            position: "absolute",
            zIndex: 100,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 14 }}>
            You Are Currently Offline {"):"}
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            top: 0,
            backgroundColor: "green",
            width: "100%",
            height: 40,
            justifyContent: "center",
            opacity: 1,
            transform: [{ translateY: hasInternetValueYBack }],
            position: "absolute",
            zIndex: 101,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 14 }}>
            Back To Online {"(:"}
          </Text>
        </Animated.View>

        {!refreshing &&
          !hideAddressHanddler && [
            <View key={1} style={{ height: 30 }}></View>,
            <AddressHanddler key={2} />,
          ]}
        {toggleOpenAddressList && (
          <Pressable
            onPress={() => Dispatch(ToggleCloseAddressListAction())}
            style={{
              backgroundColor: "black",
              height: windowHeight - 350,
              width: "100%",
              opacity: 0.5,
              bottom: 0,
              position: "absolute",
              zIndex: 150,
            }}
          ></Pressable>
        )}
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              fullScreenGestureEnabled: true,
            }}
          >
            <Stack.Screen
              name="tabs"
              children={() => (
                <Tabs
                  toLocation={toLocation}
                  fromDestination={fromDestination}
                  fromLocation={fromLocation}
                  setFromDestination={setFromDestination}
                  setFromLocation={setFromLocation}
                  setToDestination={setToDestination}
                  setToLocation={setToLocation}
                  toDestination={toDestination}
                />
              )}
            />
            {selectedStore && (
              <Stack.Screen
                name="ViewStore"
                children={() => (
                  <ViewStore
                    Address={address}
                    setHideAddressHanddler={setHideAddressHanddler}
                    Store={selectedStore}
                  />
                )}
              />
            )}
            {!selectedStore && (
              <Stack.Screen
                name="ViewStore"
                children={() => (
                  <View>
                    <Text>asasd</Text>
                  </View>
                )}
              />
            )}
            {selectedProduct && selectedStore && savedOrder && (
              <Stack.Screen
                name="ViewProduct"
                children={() => <ViewProduct />}
              />
            )}
            {savedOrder && (
              <Stack.Screen
                name="ViewOrder"
                children={() => (
                  <ViewOrder setHideAddressHanddler={setHideAddressHanddler} />
                )}
              />
            )}
            {savedOrder && (
              <Stack.Screen
                name="ViewCheckout"
                children={() => (
                  <ViewCheckout savedAddresses={savedAddresses} />
                )}
              />
            )}
            {!selectedProduct && (
              <Stack.Screen
                name="ViewProduct"
                children={() => (
                  <View>
                    <Text>asdasd</Text>
                  </View>
                )}
              />
            )}
            <Stack.Screen
              name="ViewDeliveryLoading"
              children={() => (
                <ViewDeliveryLoading
                  FromAddress={fromDestination}
                  FromLocation={fromLocation}
                  ToAddress={toDestination}
                  ToLocation={toLocation}
                />
              )}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
  };

  useEffect(() => {
    if (refreshing) {
      firstloadCheck();
    }
  }, [refreshing]);

  const PressLocation = async () => {
    const result = await CheckLocation();
    if (result) {
      Dispatch(DeliveryLocationAction(result));
      Dispatch(CurrentLocationAction(result));
    }
  };

  const SaveData = async (data: StorageData) => {
    try {
      await AsyncStorage.setItem("@sessionid", data.sessionid);
      UpdateData();
    } catch {}
  };

  const UpdateData = async () => {
    try {
      const sessionid = await AsyncStorage.getItem("@sessionid");
      const address = await AsyncStorage.getItem("address");
      setSessionid(sessionid);
      if (address) Dispatch(AddressAction(JSON.parse(address)));
    } catch {}
  };

  const firstloadCheck = async () => {
    try {
      Dispatch(StartLoadingAction());
      const result = await CheckLocation();
      if (result) {
        Dispatch(CurrentLocationAction(result));
      }
      const savedAddresses = await AsyncStorage.getItem("savedAddresses");
      const address = await AsyncStorage.getItem("address");
      if (!address) setAddressCurrent();
      else Dispatch(AddressAction(JSON.parse(address)));
      if (savedAddresses)
        Dispatch(setSavedAddressesAction(JSON.parse(savedAddresses)));
      await UpdateData();
      Dispatch(StopLoadingAction());
    } catch {}
  };

  useEffect(() => {
    firstloadCheck();
  }, []);

  useEffect(() => {}, [deliveryLocation]);

  return getContent();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
