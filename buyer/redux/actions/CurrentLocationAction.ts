import { LocationObject } from "expo-location";

export const CurrentLocationAction = (payload:LocationObject| null) => {
    return {
        type:"setCurrentLocation",
        payload:payload
    };
}