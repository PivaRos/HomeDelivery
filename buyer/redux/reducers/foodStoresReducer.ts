import { availableStores } from "../../interfaces";

export const foodStoresReducer = (state:availableStores | null = null, action:any) => {
    switch(action.type){
        case 'setFoodStores' :
            return action.payload;
        default : 
            return state;
    }
}