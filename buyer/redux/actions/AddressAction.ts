import { LocationGeocodedAddress } from "expo-location";

export const AddressAction = (payload:LocationGeocodedAddress) => {
    return {
        type:'setAddress',
        payload:payload
    };
}