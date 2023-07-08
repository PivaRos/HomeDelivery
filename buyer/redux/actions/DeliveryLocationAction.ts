import { LocationObject } from "expo-location";

export const DeliveryLocationAction = (payload:LocationObject) => {
    return {
        type: "setDeliveryLocation",
        payload:payload
    };
}