
export const currentLocationReducer = (state = null, action:any) => {
    switch (action.type){
        case 'setCurrentLocation':
            return action.payload;
        default : return state;
    }
}   