import * as React from 'react';
import {View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { availableStores, LocationObject, Pages, Store } from '../interfaces';
import Home from '../navigation/screens/homeScreen';
import Navicon from '../components/navicon';
import Stores from './screens/storesScreen';
import Account from './screens/accountScreen';
import OrdersScreen from './screens/ordersScreen';

interface Props {
  location:LocationObject;
  Stores:availableStores | null | undefined;
  setAvailableStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
  setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
  refreshing:boolean;
}

const Tabs = (props:Props) => {

const Tab = createBottomTabNavigator();

    return (
    <Tab.Navigator
        initialRouteName={Pages.Stores}
        screenOptions={({route}) => ({
          tabBarIcon:({focused, color, size}) => {
            let iconName = ""
            let rn = route.name
            
            if (rn === Pages.Stores){
              iconName = focused ? food_focusedsvg : foodsvg
            } else if (rn === Pages.Home){
              iconName = focused ? home_focusedsvg : homesvg
            } else if (rn === Pages.Orders){
              iconName = focused ? focused_orders : orders
            } else if (rn === Pages.Account){
              iconName = focused ? account_focusedsvg : accountsvg
            }
  
            if (iconName !== "")
            {
              return <Navicon svgicon={iconName}/> ;
            }
            return;
          },
          headerShown:false,
          tabBarShowLabel:true,
          tabBarLabelStyle:{marginTop:2}
        })}>
          <Tab.Screen options={{title:"Food", tabBarActiveTintColor:"black"}} name='Stores' children={() =>  <Stores refreshing={props.refreshing} setSelectedStore={props.setSelectedStore} setAvailableStores={props.setAvailableStores} Stores={props.Stores} location={props.location} />} />
          <Tab.Screen options={{title:"HomeMade", tabBarActiveTintColor:"black"}} name='Home' children={() => <Home Stores={props.Stores} location={props.location} />}  />
          <Tab.Screen options={{title:"MyOrders", tabBarActiveTintColor:"black"}} name='Orders' children={() => <OrdersScreen Stores={props.Stores} location={props.location} />} />
          <Tab.Screen options={{title:"Account", tabBarActiveTintColor:"black"}} name='Account' children={() => <Account Stores={props.Stores} location={props.location} />} />
        </Tab.Navigator>);

}


const color = "#abb5c2";
const orders = '<svg fill="'+color+'" class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" fill="'+color+'" ><path fill="'+color+'" d="M820 1024H204c-83.8 0-152-68.2-152-152V152C52 68.2 120.2 0 204 0h52c17.7 0 32 14.3 32 32s-14.3 32-32 32h-52c-48.5 0-88 39.5-88 88v720c0 48.5 39.5 88 88 88h616c48.5 0 88-39.5 88-88V152c0-48.5-39.5-88-88-88h-51.9c-17.7 0-32-14.3-32-32s14.3-32 32-32H820c83.8 0 152 68.2 152 152v720c0 83.8-68.2 152-152 152z" fill="'+color+'" /><path d="M608 64H416c-17.7 0-32-14.3-32-32s14.3-32 32-32h192c17.7 0 32 14.3 32 32s-14.3 32-32 32zM762.7 319.3H261.3c-15.6 0-28.3-12.7-28.3-28.3v-7.4c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.5-12.7 28.3-28.3 28.3zM762.7 514.7H261.3c-15.6 0-28.3-12.7-28.3-28.3V479c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.5-12.7 28.3-28.3 28.3zM762.7 703.9H261.3c-15.6 0-28.3-12.7-28.3-28.3v-7.4c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.6-12.7 28.3-28.3 28.3z" fill="'+color+'" /></svg>'
const accountsvg = '<svg fill="'+color+'" id="Layer_1" data-name="Layer 1" viewBox="0 0 122.88 122.88"><title>account</title><path d="M61.44,0A61.31,61.31,0,0,1,84.92,4.66h0A61.66,61.66,0,0,1,118.21,38l.1.24a61.39,61.39,0,0,1-.1,46.73h0A61.42,61.42,0,0,1,38,118.21h0A61.3,61.3,0,0,1,18,104.88l0,0A61.5,61.5,0,0,1,4.66,84.94l-.09-.24A61.48,61.48,0,0,1,4.66,38v0A61.37,61.37,0,0,1,18,18l0,0A61.5,61.5,0,0,1,37.94,4.66l.24-.09A61.35,61.35,0,0,1,61.44,0ZM48.78,79.89a16.44,16.44,0,0,1-1.34-1.62c-2.6-3.56-4.93-7.58-7.27-11.33-1.7-2.5-2.59-4.73-2.59-6.52s1-4.13,3-4.64a101,101,0,0,1-.18-11.73A16.86,16.86,0,0,1,41,41.11a17,17,0,0,1,7.58-9.64,19.26,19.26,0,0,1,4.11-2c2.59-1,1.34-4.91,4.19-5C63.54,24.33,74.52,30,78.8,34.68a16.91,16.91,0,0,1,4.38,11l-.27,10.57a3.31,3.31,0,0,1,2.41,2.41c.36,1.43,0,3.39-1.25,6.16h0c0,.09-.09.09-.09.18-2.75,4.53-5.62,9.78-8.78,14-1.59,2.12-2.9,1.75-1.54,3.78,6.45,8.87,19.18,7.64,27,13.55a52.66,52.66,0,0,0,9.36-54.72l-.09-.2A52.7,52.7,0,0,0,98.55,24.33h0a52.63,52.63,0,0,0-57-11.49l-.21.09a52.53,52.53,0,0,0-17,11.4h0a52.63,52.63,0,0,0-11.49,57l.09.21A52.66,52.66,0,0,0,22.19,96.3c7.85-5.91,20.58-4.68,27-13.55,1.12-1.68.83-1.52-.44-2.86Z"/></svg>'
const homesvg = '<svg fill="'+color+'" version="1.1" id="Capa_1"  viewBox="0 0 495.398 495.398"	 xml:space="preserve"><g>	<g>		<g>			<path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391				v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158				c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747				c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"/>			<path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401				c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79				c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"/>		</g>	</g></g></svg>';
const foodsvg = '<svg fill="'+color+'" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120.79 122.88" style="enable-background:new 0 0 120.79 122.88" xml:space="preserve"><style type="text/css"><![CDATA[ .st0{fill-rule:evenodd;clip-rule:evenodd;}]]></style><g><path class="st0" d="M103.87,44.5h-48H43.39l1.01,4.9c18.68,1.25,32.45,9.27,39.21,17.08c2.6,3,4.42,6.21,5.37,9.34 c1.39,4.58,1.05,9.04-1.13,12.96c-0.28,0.51-0.59,1-0.92,1.48c0.41,0.88,0.72,1.76,0.97,2.61c0.08,0.23,0.16,0.47,0.22,0.71l0.01,0 c0.32,1.13,0.48,2.23,0.48,3.32c0,0.38-0.02,0.26-0.04,0.59l0.01,0.27h0.03c0-0.18,0-0.29,0,0c0,0.28-0.01,0.57-0.03,0.86h15.23 l12.55-54.1H103.87L103.87,44.5L103.87,44.5z M3.19,108.88c23.89-0.04,47.77-0.07,71.66,0c1.42,0.01,2.59,1.17,2.59,2.59 c0,3.86-1.62,11.42-10.35,11.42c-18.71,0-37.42,0-56.13,0c-8.73,0-10.35-7.55-10.35-11.42C0.6,110.04,1.77,108.88,3.19,108.88 L3.19,108.88L3.19,108.88z M56.69,69.07c2.2,0,3.98,1.78,3.98,3.98c0,2.2-1.78,3.98-3.98,3.98c-2.2,0-3.98-1.78-3.98-3.98 C52.71,70.85,54.49,69.07,56.69,69.07L56.69,69.07L56.69,69.07z M21.98,69.35c2.2,0,3.98,1.78,3.98,3.98c0,2.2-1.78,3.98-3.98,3.98 c-2.2,0-3.98-1.78-3.98-3.98S19.78,69.35,21.98,69.35L21.98,69.35L21.98,69.35z M39.19,65.55c2.2,0,3.98,1.78,3.98,3.98 c0,2.2-1.78,3.98-3.98,3.98c-2.2,0-3.98-1.78-3.98-3.98C35.22,67.33,37,65.55,39.19,65.55L39.19,65.55L39.19,65.55z M71.47,86.14 H7.41c-4.07,0-7.41-3.33-7.41-7.4l0,0c0-10.54,21.01-18.2,38.64-18.38C73.35,60.01,88.92,86.14,71.47,86.14L71.47,86.14 L71.47,86.14z M77.27,96.29c0.11,0.19,0.17,0.38,0.17,0.6c0,0.13-0.01,0.28-0.01,0.43c0.01,0.15,0.01,0.29,0.01,0.43 c0,0.21-0.06,0.41-0.17,0.6c-0.59,2.57-2.95,5.93-10.18,5.93c-18.71,0-37.42,0-56.13,0c-7.24,0-9.59-3.36-10.18-5.93 c-0.11-0.19-0.17-0.38-0.17-0.6c0-0.13,0.01-0.28,0.01-0.43c-0.01-0.15-0.01-0.29-0.01-0.43c0-0.21,0.06-0.41,0.17-0.6 c0.59-2.57,2.94-5.93,10.18-5.93h29.07l10.72,11.07l10.65-11.07h5.7C74.33,90.37,76.68,93.73,77.27,96.29L77.27,96.29L77.27,96.29z M88.57,97.75c0.02,0.87,0.03,0.32,0.03,0H88.57L88.57,97.75z M43.48,22.3h31.41l3.42-15.2c0.99-3.67,3.87-5.72,8.95-7.1 c4.31,0,8.62,0,12.92,0c1.97,0.39,3.11,1.76,3.41,4.12c0,1.33,0,2.65,0,3.98c-0.65,2.17-1.96,3.05-3.98,3.41H88.83l-2.29,10.79 h29.72c2.5,0,4.53,2.04,4.53,4.53v5.15c0,2.5-2.04,4.53-4.53,4.53H43.48c-2.5,0-4.53-2.04-4.53-4.53v-5.15 C38.95,24.34,40.99,22.3,43.48,22.3L43.48,22.3L43.48,22.3z M86.38,121.89h5.41h3.12c3.64-0.78,6.17-2.5,7.24-6.11l0.82-8.58H87.92 c0.45,1.35,0.69,2.78,0.69,4.27C88.61,114.23,88.1,118.1,86.38,121.89L86.38,121.89z"/></g></svg>'
const searchsvg = '<svg fill="'+color+'"  version="1.1" id="Layer_1"   viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M196.165,53.195c-75.163,0-136.312,61.149-136.312,136.312s61.15,136.312,136.312,136.312s136.312-61.149,136.312-136.312S271.328,53.195,196.165,53.195z M196.165,299.221c-60.496,0-109.714-49.217-109.714-109.714c0-60.497,49.219-109.714,109.714-109.714s109.714,49.217,109.714,109.714C305.879,250.004,256.662,299.221,196.165,299.221z"/></g></g><g><g><path d="M493.676,443.893L349.931,300.149c23.122-32.11,35.74-70.953,35.74-110.643C385.672,85.012,300.66,0,196.165,0S6.659,85.012,6.659,189.506s85.012,189.507,189.507,189.507c33.349,0,65.797-8.715,94.494-25.293l146.593,146.594c7.535,7.535,17.554,11.686,28.212,11.686s20.675-4.151,28.212-11.686C509.23,484.759,509.23,459.449,493.676,443.893zM474.869,481.507c-2.512,2.512-5.851,3.895-9.404,3.895c-3.552,0-6.893-1.383-9.404-3.895L302.037,327.483c-2.571-2.571-5.975-3.895-9.407-3.895c-2.524,0-5.064,0.717-7.296,2.184c-26.543,17.431-57.375,26.644-89.169,26.644c-89.829,0-162.909-73.08-162.909-162.909s73.08-162.909,162.909-162.909s162.909,73.08,162.909,162.909c0,37.585-13.166,74.285-37.071,103.34c-4.35,5.286-3.975,13.011,0.864,17.852l152,152C480.052,467.886,480.052,476.322,474.869,481.507z"/></g></g></svg>';
const storessvg = '<svg fill="'+color+'" viewBox="0 0 20 20"><path d="M1.791 2.253l-.597 3.583A1 1 0 002.18 7h.893a1.5 1.5 0 001.342-.83L5 5l.585 1.17A1.5 1.5 0 006.927 7h1.146a1.5 1.5 0 001.342-.83L10 5l.585 1.17a1.5 1.5 0 001.342.83h1.146a1.5 1.5 0 001.342-.83L15 5l.585 1.17a1.5 1.5 0 001.342.83h.893a1 1 0 00.986-1.164l-.597-3.583A1.5 1.5 0 0016.729 1H3.271a1.5 1.5 0 00-1.48 1.253z" /><path d="M18 9H2v8.5A1.5 1.5 0 003.5 19H7v-7h6v7h3.5a1.5 1.5 0 001.5-1.5V9z" /></svg>'

const focused_color = "#85d488";
const food_focusedsvg = '<svg fill="'+focused_color+'" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120.79 122.88" style="enable-background:new 0 0 120.79 122.88" xml:space="preserve"><style type="text/css"><![CDATA[ .st0{fill-rule:evenodd;clip-rule:evenodd;}]]></style><g><path class="st0" d="M103.87,44.5h-48H43.39l1.01,4.9c18.68,1.25,32.45,9.27,39.21,17.08c2.6,3,4.42,6.21,5.37,9.34 c1.39,4.58,1.05,9.04-1.13,12.96c-0.28,0.51-0.59,1-0.92,1.48c0.41,0.88,0.72,1.76,0.97,2.61c0.08,0.23,0.16,0.47,0.22,0.71l0.01,0 c0.32,1.13,0.48,2.23,0.48,3.32c0,0.38-0.02,0.26-0.04,0.59l0.01,0.27h0.03c0-0.18,0-0.29,0,0c0,0.28-0.01,0.57-0.03,0.86h15.23 l12.55-54.1H103.87L103.87,44.5L103.87,44.5z M3.19,108.88c23.89-0.04,47.77-0.07,71.66,0c1.42,0.01,2.59,1.17,2.59,2.59 c0,3.86-1.62,11.42-10.35,11.42c-18.71,0-37.42,0-56.13,0c-8.73,0-10.35-7.55-10.35-11.42C0.6,110.04,1.77,108.88,3.19,108.88 L3.19,108.88L3.19,108.88z M56.69,69.07c2.2,0,3.98,1.78,3.98,3.98c0,2.2-1.78,3.98-3.98,3.98c-2.2,0-3.98-1.78-3.98-3.98 C52.71,70.85,54.49,69.07,56.69,69.07L56.69,69.07L56.69,69.07z M21.98,69.35c2.2,0,3.98,1.78,3.98,3.98c0,2.2-1.78,3.98-3.98,3.98 c-2.2,0-3.98-1.78-3.98-3.98S19.78,69.35,21.98,69.35L21.98,69.35L21.98,69.35z M39.19,65.55c2.2,0,3.98,1.78,3.98,3.98 c0,2.2-1.78,3.98-3.98,3.98c-2.2,0-3.98-1.78-3.98-3.98C35.22,67.33,37,65.55,39.19,65.55L39.19,65.55L39.19,65.55z M71.47,86.14 H7.41c-4.07,0-7.41-3.33-7.41-7.4l0,0c0-10.54,21.01-18.2,38.64-18.38C73.35,60.01,88.92,86.14,71.47,86.14L71.47,86.14 L71.47,86.14z M77.27,96.29c0.11,0.19,0.17,0.38,0.17,0.6c0,0.13-0.01,0.28-0.01,0.43c0.01,0.15,0.01,0.29,0.01,0.43 c0,0.21-0.06,0.41-0.17,0.6c-0.59,2.57-2.95,5.93-10.18,5.93c-18.71,0-37.42,0-56.13,0c-7.24,0-9.59-3.36-10.18-5.93 c-0.11-0.19-0.17-0.38-0.17-0.6c0-0.13,0.01-0.28,0.01-0.43c-0.01-0.15-0.01-0.29-0.01-0.43c0-0.21,0.06-0.41,0.17-0.6 c0.59-2.57,2.94-5.93,10.18-5.93h29.07l10.72,11.07l10.65-11.07h5.7C74.33,90.37,76.68,93.73,77.27,96.29L77.27,96.29L77.27,96.29z M88.57,97.75c0.02,0.87,0.03,0.32,0.03,0H88.57L88.57,97.75z M43.48,22.3h31.41l3.42-15.2c0.99-3.67,3.87-5.72,8.95-7.1 c4.31,0,8.62,0,12.92,0c1.97,0.39,3.11,1.76,3.41,4.12c0,1.33,0,2.65,0,3.98c-0.65,2.17-1.96,3.05-3.98,3.41H88.83l-2.29,10.79 h29.72c2.5,0,4.53,2.04,4.53,4.53v5.15c0,2.5-2.04,4.53-4.53,4.53H43.48c-2.5,0-4.53-2.04-4.53-4.53v-5.15 C38.95,24.34,40.99,22.3,43.48,22.3L43.48,22.3L43.48,22.3z M86.38,121.89h5.41h3.12c3.64-0.78,6.17-2.5,7.24-6.11l0.82-8.58H87.92 c0.45,1.35,0.69,2.78,0.69,4.27C88.61,114.23,88.1,118.1,86.38,121.89L86.38,121.89z"/></g></svg>'
const focused_orders = '<svg fill="'+focused_color+'" class="svg-icon" style="width: 1em; height: 1em;vertical-align: middle;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" ><path d="M820 1024H204c-83.8 0-152-68.2-152-152V152C52 68.2 120.2 0 204 0h52c17.7 0 32 14.3 32 32s-14.3 32-32 32h-52c-48.5 0-88 39.5-88 88v720c0 48.5 39.5 88 88 88h616c48.5 0 88-39.5 88-88V152c0-48.5-39.5-88-88-88h-51.9c-17.7 0-32-14.3-32-32s14.3-32 32-32H820c83.8 0 152 68.2 152 152v720c0 83.8-68.2 152-152 152z"  /><path d="M608 64H416c-17.7 0-32-14.3-32-32s14.3-32 32-32h192c17.7 0 32 14.3 32 32s-14.3 32-32 32zM762.7 319.3H261.3c-15.6 0-28.3-12.7-28.3-28.3v-7.4c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.5-12.7 28.3-28.3 28.3zM762.7 514.7H261.3c-15.6 0-28.3-12.7-28.3-28.3V479c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.5-12.7 28.3-28.3 28.3zM762.7 703.9H261.3c-15.6 0-28.3-12.7-28.3-28.3v-7.4c0-15.6 12.7-28.3 28.3-28.3h501.4c15.6 0 28.3 12.7 28.3 28.3v7.4c0 15.6-12.7 28.3-28.3 28.3z" fill="'+focused_color+'" /></svg>'
const account_focusedsvg = '<svg fill="'+focused_color+'" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><title>account</title><path d="M61.44,0A61.31,61.31,0,0,1,84.92,4.66h0A61.66,61.66,0,0,1,118.21,38l.1.24a61.39,61.39,0,0,1-.1,46.73h0A61.42,61.42,0,0,1,38,118.21h0A61.3,61.3,0,0,1,18,104.88l0,0A61.5,61.5,0,0,1,4.66,84.94l-.09-.24A61.48,61.48,0,0,1,4.66,38v0A61.37,61.37,0,0,1,18,18l0,0A61.5,61.5,0,0,1,37.94,4.66l.24-.09A61.35,61.35,0,0,1,61.44,0ZM48.78,79.89a16.44,16.44,0,0,1-1.34-1.62c-2.6-3.56-4.93-7.58-7.27-11.33-1.7-2.5-2.59-4.73-2.59-6.52s1-4.13,3-4.64a101,101,0,0,1-.18-11.73A16.86,16.86,0,0,1,41,41.11a17,17,0,0,1,7.58-9.64,19.26,19.26,0,0,1,4.11-2c2.59-1,1.34-4.91,4.19-5C63.54,24.33,74.52,30,78.8,34.68a16.91,16.91,0,0,1,4.38,11l-.27,10.57a3.31,3.31,0,0,1,2.41,2.41c.36,1.43,0,3.39-1.25,6.16h0c0,.09-.09.09-.09.18-2.75,4.53-5.62,9.78-8.78,14-1.59,2.12-2.9,1.75-1.54,3.78,6.45,8.87,19.18,7.64,27,13.55a52.66,52.66,0,0,0,9.36-54.72l-.09-.2A52.7,52.7,0,0,0,98.55,24.33h0a52.63,52.63,0,0,0-57-11.49l-.21.09a52.53,52.53,0,0,0-17,11.4h0a52.63,52.63,0,0,0-11.49,57l.09.21A52.66,52.66,0,0,0,22.19,96.3c7.85-5.91,20.58-4.68,27-13.55,1.12-1.68.83-1.52-.44-2.86Z"/></svg>'
const home_focusedsvg = '<svg fill="'+focused_color+'" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.398 495.398"	 xml:space="preserve"><g>	<g>		<g>			<path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391				v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158				c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747				c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"/>			<path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401				c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79				c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"/>		</g>	</g></g></svg>';
const search_focusedsvg = '<svg fill="'+focused_color+'"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M196.165,53.195c-75.163,0-136.312,61.149-136.312,136.312s61.15,136.312,136.312,136.312s136.312-61.149,136.312-136.312S271.328,53.195,196.165,53.195z M196.165,299.221c-60.496,0-109.714-49.217-109.714-109.714c0-60.497,49.219-109.714,109.714-109.714s109.714,49.217,109.714,109.714C305.879,250.004,256.662,299.221,196.165,299.221z"/></g></g><g><g><path d="M493.676,443.893L349.931,300.149c23.122-32.11,35.74-70.953,35.74-110.643C385.672,85.012,300.66,0,196.165,0S6.659,85.012,6.659,189.506s85.012,189.507,189.507,189.507c33.349,0,65.797-8.715,94.494-25.293l146.593,146.594c7.535,7.535,17.554,11.686,28.212,11.686s20.675-4.151,28.212-11.686C509.23,484.759,509.23,459.449,493.676,443.893zM474.869,481.507c-2.512,2.512-5.851,3.895-9.404,3.895c-3.552,0-6.893-1.383-9.404-3.895L302.037,327.483c-2.571-2.571-5.975-3.895-9.407-3.895c-2.524,0-5.064,0.717-7.296,2.184c-26.543,17.431-57.375,26.644-89.169,26.644c-89.829,0-162.909-73.08-162.909-162.909s73.08-162.909,162.909-162.909s162.909,73.08,162.909,162.909c0,37.585-13.166,74.285-37.071,103.34c-4.35,5.286-3.975,13.011,0.864,17.852l152,152C480.052,467.886,480.052,476.322,474.869,481.507z"/></g></g></svg>';
const stores_focusedsvg = '<svg fill="'+focused_color+'"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M1.791 2.253l-.597 3.583A1 1 0 002.18 7h.893a1.5 1.5 0 001.342-.83L5 5l.585 1.17A1.5 1.5 0 006.927 7h1.146a1.5 1.5 0 001.342-.83L10 5l.585 1.17a1.5 1.5 0 001.342.83h1.146a1.5 1.5 0 001.342-.83L15 5l.585 1.17a1.5 1.5 0 001.342.83h.893a1 1 0 00.986-1.164l-.597-3.583A1.5 1.5 0 0016.729 1H3.271a1.5 1.5 0 00-1.48 1.253z" /><path d="M18 9H2v8.5A1.5 1.5 0 003.5 19H7v-7h6v7h3.5a1.5 1.5 0 001.5-1.5V9z"/></svg>'

export default Tabs