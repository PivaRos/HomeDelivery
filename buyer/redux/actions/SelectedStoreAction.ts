import { Store } from "../../interfaces";

export const SelectedStoreAction = (payload:Store | null) => {
    return {
        type:'setSelectedStore',
        payload:payload
    };
}