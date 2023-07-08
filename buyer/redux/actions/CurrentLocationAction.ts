import { LocationObject } from "expo-location";

export const CurrentLocationAction = (payload:LocationObject) => {
    return {
        type:"setCurrentLocation",
        payload:payload
    };
}