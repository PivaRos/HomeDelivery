import * as React from "react";
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
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { availableStores, Order, Pages, Store } from "../interfaces";
import HomeMadeStores from "./screens/homeMadeStoresScreen";
import Navicon from "../components/navicon";
import FoodStores from "./screens/foodStoresScreen";
import Account from "./screens/accountScreen";
import OrdersScreen from "./screens/ordersScreen";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { SavedOrderAction } from "../redux/actions/SavedOrderAction";
import {
  StartRefreshingAction,
  StopRefreshingAction,
} from "../redux/actions/RefreshingActions";

interface Props {
  fromDestination: Location.LocationGeocodedAddress;
  toDestination: Location.LocationGeocodedAddress;
  fromLocation: Location.LocationGeocodedLocation | undefined;
  toLocation: Location.LocationGeocodedLocation | undefined;
  setFromDestination: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedAddress>
  >;
  setToDestination: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedAddress>
  >;
  setFromLocation: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedLocation | undefined>
  >;
  setToLocation: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedLocation | undefined>
  >;
}

const Tabs = (props: Props) => {
  const refreshing = useSelector((state: any) => state.refreshing) as boolean;
  const Dispatch = useDispatch();
  const Tab = createBottomTabNavigator();

  React.useEffect(() => {
    Dispatch(SavedOrderAction(null));
  }, []);

  const onRefresh = React.useCallback(async () => {
    Dispatch(StartRefreshingAction());
    setTimeout(() => {
      Dispatch(StopRefreshingAction());
    }, 1500);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          colors={["#2874ed"]}
          title="Refresh"
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <Tab.Navigator
        initialRouteName={Pages.Orders}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            let rn = route.name;

            if (rn === Pages.Stores) {
              return (
                <Ionicons
                  size={30}
                  name="fast-food-outline"
                  color={focused ? "lightgreen" : "grey"}
                />
              );
            } else if (rn === Pages.Home) {
              return (
                <AntDesign
                  name="rocket1"
                  size={28}
                  color={focused ? "lightgreen" : "grey"}
                />
              );
            } else if (rn === Pages.Orders) {
              return (
                <MaterialIcons
                  name="delivery-dining"
                  size={35}
                  color={focused ? "lightgreen" : "grey"}
                />
              );
            } else if (rn === Pages.Account) {
              return (
                <MaterialCommunityIcons
                  name="account"
                  size={30}
                  color={focused ? "lightgreen" : "grey"}
                />
              );
            }
          },
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: { marginTop: 2 },
        })}
      >
        <Tab.Screen
          options={{ title: "Food", tabBarActiveTintColor: "black" }}
          name="Stores"
          children={() => <FoodStores />}
        />
        <Tab.Screen
          options={{ title: "HomeMade", tabBarActiveTintColor: "black" }}
          name="Home"
          children={() => <HomeMadeStores />}
        />
        <Tab.Screen
          options={{ title: "MyOrders", tabBarActiveTintColor: "black" }}
          name="Orders"
          children={() => (
            <OrdersScreen
              fromLocation={props.fromLocation}
              toLocation={props.toLocation}
              fromDestination={props.fromDestination}
              toDestination={props.toDestination}
              setFromDestination={props.setFromDestination}
              setToDestination={props.setToDestination}
              setFromLocation={props.setFromLocation}
              setToLocation={props.setToLocation}
            />
          )}
        />
        <Tab.Screen
          options={{ title: "Account", tabBarActiveTintColor: "black" }}
          name="Account"
          children={() => <Account />}
        />
      </Tab.Navigator>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default Tabs;
