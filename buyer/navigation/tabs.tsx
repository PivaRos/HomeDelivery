import * as React from 'react';
import {View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pages } from '../interfaces';
import Home from '../navigation/screens/homeScreen';
import Navicon from '../components/navicon';
import Stores from './screens/storesScreen';
import Search from './screens/searchScreen';
import Account from './screens/accountScreen';


const Tabs = () => {

const Tab = createBottomTabNavigator();

    return (    <Tab.Navigator 
        initialRouteName={Pages.Home}
        screenOptions={({route}) => ({
          tabBarIcon:({focused, color, size}) => {
            let iconName = ""
            let rn = route.name
  
            if (rn === Pages.Stores){
              iconName = focused ? storessvg : stores_focusedsvg
            } else if (rn === Pages.Home){
              iconName = focused ? storessvg : stores_focusedsvg
            } else if (rn === Pages.Search){
              iconName = focused ? storessvg : stores_focusedsvg
            } else if (rn === Pages.Account){
              iconName = focused ? storessvg : stores_focusedsvg
            }
  
            if (iconName !== "")
            {
              return <Navicon svgicon={iconName}/> ;
            }
            return;
          },
          headerShown:false
        })}>
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='Stores' component={Stores} />
          <Tab.Screen name='Search' component={Search} />
          <Tab.Screen name='Account' component={Account} />
        </Tab.Navigator>);
}


const searchsvg = '<svg fill="#5C5F62"  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M196.165,53.195c-75.163,0-136.312,61.149-136.312,136.312s61.15,136.312,136.312,136.312s136.312-61.149,136.312-136.312S271.328,53.195,196.165,53.195z M196.165,299.221c-60.496,0-109.714-49.217-109.714-109.714c0-60.497,49.219-109.714,109.714-109.714s109.714,49.217,109.714,109.714C305.879,250.004,256.662,299.221,196.165,299.221z"/></g></g><g><g><path d="M493.676,443.893L349.931,300.149c23.122-32.11,35.74-70.953,35.74-110.643C385.672,85.012,300.66,0,196.165,0S6.659,85.012,6.659,189.506s85.012,189.507,189.507,189.507c33.349,0,65.797-8.715,94.494-25.293l146.593,146.594c7.535,7.535,17.554,11.686,28.212,11.686s20.675-4.151,28.212-11.686C509.23,484.759,509.23,459.449,493.676,443.893zM474.869,481.507c-2.512,2.512-5.851,3.895-9.404,3.895c-3.552,0-6.893-1.383-9.404-3.895L302.037,327.483c-2.571-2.571-5.975-3.895-9.407-3.895c-2.524,0-5.064,0.717-7.296,2.184c-26.543,17.431-57.375,26.644-89.169,26.644c-89.829,0-162.909-73.08-162.909-162.909s73.08-162.909,162.909-162.909s162.909,73.08,162.909,162.909c0,37.585-13.166,74.285-37.071,103.34c-4.35,5.286-3.975,13.011,0.864,17.852l152,152C480.052,467.886,480.052,476.322,474.869,481.507z"/></g></g></svg>';
const storessvg = '<svg fill="#ffff"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M1.791 2.253l-.597 3.583A1 1 0 002.18 7h.893a1.5 1.5 0 001.342-.83L5 5l.585 1.17A1.5 1.5 0 006.927 7h1.146a1.5 1.5 0 001.342-.83L10 5l.585 1.17a1.5 1.5 0 001.342.83h1.146a1.5 1.5 0 001.342-.83L15 5l.585 1.17a1.5 1.5 0 001.342.83h.893a1 1 0 00.986-1.164l-.597-3.583A1.5 1.5 0 0016.729 1H3.271a1.5 1.5 0 00-1.48 1.253z" fill="#5C5F62"/><path d="M18 9H2v8.5A1.5 1.5 0 003.5 19H7v-7h6v7h3.5a1.5 1.5 0 001.5-1.5V9z" fill="#5C5F62"/></svg>'
const stores_focusedsvg = '<svg fill="#ffff"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M1.791 2.253l-.597 3.583A1 1 0 002.18 7h.893a1.5 1.5 0 001.342-.83L5 5l.585 1.17A1.5 1.5 0 006.927 7h1.146a1.5 1.5 0 001.342-.83L10 5l.585 1.17a1.5 1.5 0 001.342.83h1.146a1.5 1.5 0 001.342-.83L15 5l.585 1.17a1.5 1.5 0 001.342.83h.893a1 1 0 00.986-1.164l-.597-3.583A1.5 1.5 0 0016.729 1H3.271a1.5 1.5 0 00-1.48 1.253z" fill="#5C5F62"/><path d="M18 9H2v8.5A1.5 1.5 0 003.5 19H7v-7h6v7h3.5a1.5 1.5 0 001.5-1.5V9z" fill="#5C5F62"/></svg>'

export default Tabs