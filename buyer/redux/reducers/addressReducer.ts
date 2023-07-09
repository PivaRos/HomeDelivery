import { LocationGeocodedAddress } from "expo-location";

export const addressReducer = (state:LocationGeocodedAddress | null = null, action:any) => {
    switch (action.type){
        case 'setAddress':
            return action.payload;
        default: 
            return state;
    }
}