import { savedAddress } from "../../interfaces";

export const savedAddressesReducer = (
  state: savedAddress[] = [],
  action: any
) => {
  const maxSavedAddresses = 4;

  switch (action.type) {
    case "addSavedAddress":
      //add the address
      if (!state) return [action.payload];
      var FoundIndex = -1;
      state.map((address, index) => {
        if (
          FoundIndex === -1 &&
          JSON.stringify(address) === JSON.stringify(action.payload)
        ) {
          FoundIndex = index;
        }
      });
      if (FoundIndex !== -1) {
        //delete Prev Index;
        state.splice(FoundIndex, 1);
      }
      if (state.length < maxSavedAddresses) {
        state.push(action.payload);
        return state;
      }
      //need to remove first and then push new address
      FoundIndex === -1 ? state.splice(0, 1) : null;
      state.push(action.payload);
      return state;

    case "removeSavedAddress":
      //remove the address
      if (!state) return [];
      var FoundIndex = -1;
      state.map((address, index) => {
        if (
          FoundIndex === -1 &&
          JSON.stringify(address) === JSON.stringify(action.payload)
        ) {
          FoundIndex = index;
        }
      });
      if (FoundIndex !== -1) {
        state.splice(FoundIndex, 1);
        return state;
      }
      return state;

    default:
      return state;
    case "setSavedAddresses":
      return action.payload;
  }
};
