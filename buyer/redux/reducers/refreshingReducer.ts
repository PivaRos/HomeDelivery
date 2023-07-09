 export const refreshingReducer = (state:boolean = false, action:any) => {
    switch (action.type){
        case 'startRefreshing' :
            return true
        case 'stopRefreshing' : 
            return false
        default : 
            return state
    }
 }