import * as Location from "expo-location";
import {
  Order,
  PriceObject,
  Product,
  StorageData,
  Store,
  availableStores,
  govAddress,
  optionProduct,
} from "./interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { ObjectId } from "mongodb";
import getSymbolFromCurrency from "currency-symbol-map";
import { LocationObject } from "expo-location";

export const registerForPushNotificationsAsync = async () => {
  let token;
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    return token;
  } catch (e) {
    return token;
  }
};

export const GetOptionProduct = (Store: Store, OptionProdcutId: ObjectId) => {
  for (let i = 0; i < Store.optionProducts.length; i++) {
    if (Store.optionProducts[i]._id === OptionProdcutId) {
      return Store.optionProducts[i];
    }
  }
  return <optionProduct>{};
};

export const CheckLocation = async () => {
  try {
    let result = await Location.requestForegroundPermissionsAsync();
    if (result.status !== "granted") {
      return null;
    }
    let location = await Location.getCurrentPositionAsync();
    return location;
  } catch {
    return null;
  }
};

export const toDateTime = (secs: number) => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
};

export const getDistance = (
  Location1: LocationObject,
  Location2: LocationObject
) => {
  try {
    const dy = +Location1.coords.latitude - +Location2.coords.latitude;
    const dx = +Location1.coords.longitude - +Location2.coords.longitude;
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574; //im km
    return distance;
  } catch {
    return -1;
  }
};

export const DeliveryFee = (distanceKm: number) => {
  // in ILS;
  let price = 8000;
  if (distanceKm > 1) {
    price += ((distanceKm - 1) / 0.5) * 2000;
  }
  return price;
};

export const PriceString = (price: number, currency: string): string => {
  //price string
  let symbol = "";
  const thesymb = getSymbolFromCurrency(currency);
  if (thesymb) {
    symbol = thesymb;
  }
  const sherit = price % 1000;
  if (!sherit)
    return symbol + (price / 1000).toString() + "." + sherit.toString();
  return symbol + Math.round(price / 1000).toString();
};

export const getTotalUnits = (ArrayToSum: number[]) => {
  let TotalUnits = 0;
  ArrayToSum.forEach((units) => {
    if (units) {
      TotalUnits += units;
    }
  });
  return TotalUnits;
};

export const setOrderSelectedProductByIndex = (
  order: Order,
  product: Product,
  index: number
): Order => {
  let newOrder: Order = JSON.parse(JSON.stringify(order));
  newOrder.selecedProdcuts = order.selecedProdcuts.map((p, theIndex) => {
    if (index !== theIndex) {
      return p;
    } else {
      return product;
    }
  });
  return newOrder;
};

export const getPricePerUnit = (Product: Product) => {
  let pricePerUnit = +Product.price.price;
  if (Product.options) {
    for (let i = 0; i < Product.options?.length; i++) {
      if (Product.options[i].additionalAllowed) {
        let option = Product.options[i];
        let maxPicks = +Product.options[i].maxPicks;
        let OptionTotalPicks = +getTotalUnits(
          option.selectedOptionProducts?.map((v) => {
            return v.units;
          }) || []
        );
        if (OptionTotalPicks - maxPicks > 0) {
          pricePerUnit +=
            (OptionTotalPicks - maxPicks) * option.additionalPricePerUnit.price;
        }
      }
    }
  }
  return pricePerUnit;
};

export const AdpterToGeocodedAddress = (
  GovAddress: govAddress,
  query: string
) => {
  const number = query.match(/\d+/);
  let streetnm = null;
  if (number) {
    streetnm = number[0];
  }
  return {
    city: GovAddress.שם_ישוב,
    country: "Israel",
    isoCountryCode: "IL",
    street: GovAddress.שם_רחוב,
    streetNumber: streetnm ? streetnm : "",
  } as Location.LocationGeocodedAddress;
}; // converts Gov return data to own Type

// returns true if availableStores object has Stores inside
export const hasStores = (stores: availableStores) => {
  if (stores === null) return true;
  if (stores.Closed.length === 0 && stores.Open.length === 0) {
    return false;
  }
  return true;
};
