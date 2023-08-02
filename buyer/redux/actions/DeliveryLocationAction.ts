import { LocationObject } from "expo-location";

export const DeliveryLocationAction = (payload:LocationObject | null) => {
    return {
        type: "setDeliveryLocation",
        payload:payload
    };
}