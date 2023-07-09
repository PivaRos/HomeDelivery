export const SessionIDAction = (payload:string) => {
    return {
        type:'setSessionID',
        payload:payload
    };
}