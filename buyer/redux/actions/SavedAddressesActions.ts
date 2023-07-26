import { savedAddress } from "../../interfaces";

export const AddSavedAddressAction = (payload:savedAddress) => {
    return {
        type:'addSavedAddress',
        payload:payload  
    };
}

export const RemoveSavedAddressAction = (payload:savedAddress) => {
    return {
        type:'removeSavedAddress',
        payload:payload
    };
}

export const setSavedAddressesAction = (payload:savedAddress[]) => {
    return {
        type:"setSavedAddresses",
        payload:payload
    }
} 