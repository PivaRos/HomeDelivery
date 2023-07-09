export const sessionIDReducer = (state: string | null = null, action:any) => {
    switch (action.type){
        case 'setSessionID':
            return action.payload
        default: return state
    }
}