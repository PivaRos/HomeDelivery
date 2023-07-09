import { Order } from "../../interfaces";

export const savedOrderReducer = (state: Order | null = null, action:any) => {
    switch(action.type){
        case 'setSavedOrder':
            return action.payload
        default: 
            return state
    }
}