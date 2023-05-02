import { type LocationObject, type OpenHoursObject } from './interfaces';
import moment from 'moment';

// returns distance (km)
export const getDistance = (Location1: LocationObject, Location2: LocationObject): number => {
  const longAndLatToKm = 110.574;
  if ((Location1.coordinates != null) && (Location2.coordinates != null)) {
    const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
    const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
    // im km
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * longAndLatToKm;
  } else {
    return 0;
  }
}

export const getSeconds = (addDay:boolean) => {
  if (addDay) return (+moment() - +moment().startOf('day')) / 1000 + 86400;
  return (+moment() - +moment().startOf('day')) / 1000;
}

export const isOpen = (openHoursObject:OpenHoursObject, hasCloseNextDay:boolean) => {
  const time = getSeconds(hasCloseNextDay) ;
  if (time < openHoursObject.closedFrom && time > openHoursObject.openFrom) return true;
  return false;
}

export const timeToSecondsFromStartOfDay = (time:string, isNextDay:Boolean) => {
  try{
  var timeAndDate = moment("2023031" + 'T' + time);
  var asd = ((+timeAndDate - +timeAndDate.startOf('day')) / 1000);
  if (isNextDay)
  {
      asd += 86400;
  }
  return asd;
  }catch{

  }
}