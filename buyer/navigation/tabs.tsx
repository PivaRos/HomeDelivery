import * as React from 'react';
import {View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { availableStores, Order, Pages, Store } from '../interfaces';
import HomeMadeStores from './screens/homeMadeStoresScreen';
import Navicon from '../components/navicon';
import FoodStores from './screens/foodStoresScreen';
import Account from './screens/accountScreen';
import OrdersScreen from './screens/ordersScreen';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface Props {
  deliveryLocation:Location.LocationObject;
  foodStores:availableStores | null | undefined;
  setFoodStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
  setHomeMadeStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
  homeMadeStores:availableStores | null | undefined;
  setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
  refreshing:boolean;
  setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
  savedOrder:Order | null | undefined,
  fromDestination:Location.LocationGeocodedAddress,
  toDestination:Location.LocationGeocodedAddress,
  fromLocation:Location.LocationGeocodedLocation | undefined,
  toLocation:Location.LocationGeocodedLocation| undefined,
  setFromDestination:React.Dispatch<React.SetStateAction<Location.LocationGeocodedAddress>>,
  setToDestination:React.Dispatch<React.SetStateAction<Location.LocationGeocodedAddress>>,
  setFromLocation:React.Dispatch<React.SetStateAction<Location.LocationGeocodedLocation | undefined>>,
  setToLocation:React.Dispatch<React.SetStateAction<Location.LocationGeocodedLocation | undefined>>

}

const Tabs = (props:Props) => {

const Tab = createBottomTabNavigator();

  React.useEffect(() => {
    props.setSavedOrder(undefined);
  }, [])


    return (
    <Tab.Navigator
        initialRouteName={Pages.Stores}
        screenOptions={({route}) => ({
          tabBarIcon:({focused, color, size}) => {
            let iconName = ""
            let rn = route.name
            
            if (rn === Pages.Stores){
              return (<Ionicons size={30} name='fast-food-outline' color={focused ? "lightgreen": "grey"}/>)
            } else if (rn === Pages.Home){
              return (<AntDesign name='rocket1' size={28} color={focused ? "lightgreen" : "grey"}/>);

            } else if (rn === Pages.Orders){
              return (<MaterialIcons name='delivery-dining' size={35} color={focused ? "lightgreen" : "grey"}/>);

            } else if (rn === Pages.Account){
              return (<MaterialCommunityIcons name='account' size={30} color={focused ? "lightgreen" : "grey"}/>);
            }
          },
          headerShown:false,
          tabBarShowLabel:true,
          tabBarLabelStyle:{marginTop:2}
        })}>
          <Tab.Screen options={{title:"Food", tabBarActiveTintColor:"black"}} name='Stores' children={() =>  <FoodStores setSavedOrder={props.setSavedOrder} refreshing={props.refreshing} savedOrder={props.savedOrder} setSelectedStore={props.setSelectedStore} setFoodStores={props.setFoodStores} foodStores={props.foodStores} deliveryLocation={props.deliveryLocation} />} />
          <Tab.Screen options={{title:"HomeMade", tabBarActiveTintColor:"black"}} name='Home' children={() => <HomeMadeStores savedOrder={props.savedOrder} setSavedOrder={props.setSavedOrder} refreshing={props.refreshing} setSelectedStore={props.setSelectedStore} setHomeMadeStores={props.setHomeMadeStores} homeMadeStores={props.homeMadeStores} deliveryLocation={props.deliveryLocation} />}  />
          <Tab.Screen options={{title:"MyOrders", tabBarActiveTintColor:"black"}} name='Orders' children={() => <OrdersScreen fromLocation={props.fromLocation} toLocation={props.toLocation} fromDestination={props.fromDestination} toDestination={props.toDestination} setFromDestination={props.setFromDestination} setToDestination={props.setToDestination} setFromLocation={props.setFromLocation} setToLocation={props.setToLocation}  />} />
          <Tab.Screen options={{title:"Account", tabBarActiveTintColor:"black"}} name='Account' children={() => <Account Stores={props.foodStores} deliveryLocation={props.deliveryLocation} />} />
        </Tab.Navigator>);

}

export default Tabs