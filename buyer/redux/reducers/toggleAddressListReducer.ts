export const toggleAddressListReducer = (
  state: boolean = false,
  action: any
) => {
  switch (action.type) {
    case "openAddressList":
      return true;
    case "closeAddressList":
      return false;
    default:
      return state;
  }
};
