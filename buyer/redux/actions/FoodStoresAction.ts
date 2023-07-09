import { availableStores } from "../../interfaces";

export const FoodStoresAction = (payload:availableStores | null) => {
    return {
        type:"setFoodStores",
        payload:payload
    };
}  