import { LocationObject } from "./interfaces";


    //returns distance (km)
export const getDistance = (Location1:LocationObject, Location2:LocationObject ) => {
    const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
    const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
    return distance;
}

export const makeid = (length:number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}