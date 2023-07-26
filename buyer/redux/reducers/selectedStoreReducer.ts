import { Store } from "../../interfaces";

export const selectedStoreReducer = (state:Store | null = null, action:any) => {
    switch (action.type){
        case 'setSelectedStore':
            return action.payload;
        default : return state
    }
}