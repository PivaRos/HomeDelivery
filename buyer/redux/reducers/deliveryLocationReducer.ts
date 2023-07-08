
export const deliveryLocationReducer = (state = null, action:any) => {
    switch (action.type){
        case 'setDeliveryLocation':
            return action.payload;
        default : return state;
    }
}   