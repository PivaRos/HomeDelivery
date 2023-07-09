export const loadingReducer = (state = false, action:any) => {
    switch (action.type){
        case "startLoading" :
            return true
        case "stopLoading" :
            return false
        default: return state

    }
}