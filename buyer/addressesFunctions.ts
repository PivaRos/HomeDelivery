import { savedAddress } from "././interfaces";

export const addAddress = (
  savedAddressArray: savedAddress[],
  addressToAdd: savedAddress
): savedAddress[] => {
  const tempAddresses = JSON.parse(
    JSON.stringify(savedAddressArray)
  ) as savedAddress[];
  const maxSavedAddresses = 4;

  if (tempAddresses.length < maxSavedAddresses) {
    tempAddresses.push(addressToAdd);
  } else {
    //check if the address exists allready if not add and delete the first;
    var FoundIndex = -1;
    tempAddresses.map((address, index) => {
      if (
        FoundIndex === -1 &&
        JSON.stringify(address) === JSON.stringify(addressToAdd)
      ) {
        FoundIndex = index;
      }
    });
    if (FoundIndex === -1) {
      //not found value in array;
      tempAddresses.splice(0, 1);
      tempAddresses.push(addressToAdd);
    } else {
      //if exist delete from the place it exist in and add again to array;
      tempAddresses.splice(FoundIndex, 1);
      tempAddresses.push(addressToAdd);
    }
  }
  return tempAddresses;
};
