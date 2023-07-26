export const internetConnectionReducer = (
  state: boolean = true,
  action: any
) => {
  switch (action.type) {
    case "setInternetConnection":
      return action.payload;
    default:
      return state;
  }
};
