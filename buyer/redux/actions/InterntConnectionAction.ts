export const InternetConnectionAction = (payload: boolean) => {
  return {
    type: "setInternetConnection",
    payload: payload,
  };
};
