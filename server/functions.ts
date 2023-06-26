import { type LocationObject, type OpenHoursObject } from './interfaces';
import moment from 'moment';
import * as Location from 'expo-location';


// returns distance (km)
export const getDistance = (Location1: Location.LocationObject, Location2: Location.LocationObject): number => {
  const longAndLatToKm = 110.574;
    const dy = (+Location1.coords.latitude) - (+Location2.coords.latitude);
    const dx = (+Location1.coords.longitude) - (+Location2.coords.longitude);
    // im km
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * longAndLatToKm;
}

export const getSeconds = (addDay:boolean) => {
  if (addDay) return (+moment() - +moment().startOf('day')) / 1000 + 86400; // returns the current seconed from the start of the day plus one day
  return (+moment() - +moment().startOf('day')) / 1000;
}

export const isOpen = (openHoursObject:OpenHoursObject, hasCloseNextDay:boolean) => {
  const time = getSeconds(hasCloseNextDay) ;
  if (time < openHoursObject.closedFrom && time > openHoursObject.openFrom) return true;
  return false;
}

export const timeToSecondsFromStartOfDay = (time:string, isNextDay:Boolean):number => {
  try{
  var timeAndDate = moment("2023031" + 'T' + time);
  var asd = ((+timeAndDate - +timeAndDate.startOf('day')) / 1000);
  if (isNextDay)
  {
      asd += 86400;
  }
  return asd;
  }catch{
    return -1;
  }
}