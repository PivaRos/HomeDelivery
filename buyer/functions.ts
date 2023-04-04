
import * as Location from 'expo-location';
import { LocationObject, LocationType, StorageData } from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';


export const registerForPushNotificationsAsync = async () => {
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
  
 export const CheckLocation = async () => {
    try{
      
      let  result  = await Location.requestForegroundPermissionsAsync();
      if (result.status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const thereturn = {
       thelocation: <LocationObject>{
          type:LocationType.point,
          coordinates:[location.coords.latitude, location.coords.longitude]
        },
        fullcoords:<Location.LocationObjectCoords>location.coords
      }
      return(thereturn);
    }
    catch{
      return;
    }
  }
  
    
  export const toDateTime = (secs:number) => {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}


export const getDistance = (Location1:LocationObject, Location2:LocationObject ) => {
  if (Location1.coordinates && Location2.coordinates)
  {
  const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
  const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
  const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574; //im km
  return distance;
  }
  else{
      return 0;
  }
}