export const hideAddressHandlerReducer = (state:boolean = false, action:any) => {
    switch (action.type){
        case 'hideAddressHandler' :
            return true;
        case 'showAddresHandler' :
            return false
        default: 
            return state
    }
}