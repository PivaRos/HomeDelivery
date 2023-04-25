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

export const getSeconds = (addDay: boolean) => {
  if (addDay) return (moment().get('seconds') - moment().startOf('day').add(1, 'day').get('seconds'));
  return (moment().get('seconds') - moment().startOf('day').get('seconds'));
};

export const isOpen = (openHoursObject: OpenHoursObject, hasCloseNextDay: boolean) => {
  const time = getSeconds(hasCloseNextDay);
  return time < openHoursObject.closedFrom && time > openHoursObject.openFrom;
};

export const timeToSecondsFromStartOfDay = (time: string, isNextDay: boolean) => {
  try {
    const timeAndDate = moment(`2023031T${time}`);
    let asd = ((+timeAndDate - +timeAndDate.startOf('day')) / 1000);
    if (isNextDay) {
      asd += 86400
    }
    return asd
  } catch {

  }
}
