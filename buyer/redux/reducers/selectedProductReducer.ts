import { Product } from "../../interfaces";

export const selectedProductReducer = (state:Product | null = null, action:any) => {
    switch (action.type){
        case 'setSelectedProduct':
            return action.payload;
        default: 
        return state;
    } 
}