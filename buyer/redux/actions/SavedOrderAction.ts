import { Order } from "../../interfaces";

export const SavedOrderAction = (payload:Order | null) => {
    return {
        type:'setSavedOrder',
        payload:payload
    };
}