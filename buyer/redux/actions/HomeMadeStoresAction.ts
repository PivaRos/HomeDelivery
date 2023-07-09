import { availableStores } from "../../interfaces";

export const HomeMadeStoresAction = (payload:availableStores | null) => {
    return {
        type:"setHomeMadeStores",
        payload:payload
    };
}