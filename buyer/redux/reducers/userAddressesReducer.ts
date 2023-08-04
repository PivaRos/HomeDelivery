import { UserAddress } from "../../interfaces";

export const userAddressesReducer = (
  state: UserAddress[] = [],
  action: any
) => {
  switch (action.type) {
    case "setUserAddresses":
      return action.payload;
  }
};
