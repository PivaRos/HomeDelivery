import { UserAddress } from "../../interfaces";

export const UserAddressesAction = (payload: UserAddress[]) => {
  return {
    type: "setUserAddresses",
    payload: payload,
  };
};
