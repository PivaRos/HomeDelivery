import { savedAddress } from "../../interfaces";

export const AddSavedAddress = (payload:savedAddress) => {
    return {
        type:'addSavedAddress',
        payload:payload  
    };
}

export const RemoveSavedAddress = (payload:savedAddress) => {
    return {
        type:'removeSavedAddress',
        payload:payload
    };
}