import { availableStores } from "../../interfaces";

export const homeMadeStoresReducer = (state:availableStores[] | null = null, action:any) => {
    switch (action.type){
        case 'setHomeMadeStores':
            return action.payload;
        default : 
            return state;
    }
}