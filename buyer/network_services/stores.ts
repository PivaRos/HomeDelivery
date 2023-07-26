import { ObjectId } from "mongodb";
import { uri } from "../envVars";
import { dataObject, dateObject, store_category } from "../interfaces";
import * as Location from "expo-location";

let url = uri;

export const storeActions = {
  GetStores: async (
    location: Location.LocationObject,
    store_category: store_category
  ) => {
    try {
      const response = await fetch(url + "publicbuyer/get/stores", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          location: location,
          store_category: store_category,
        }),
      });

      let data: dataObject = await response.json();
      if (data) {
        return data.data;
      }
    } catch (e) {}
  },

  GetProducts: async (store_id: ObjectId) => {
    try {
      const response = await fetch(url + "publicbuyer/get/products", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          store_id: store_id,
        }),
      });
      let data: dataObject = await response.json();
      if (data) {
        return data.data;
      }
    } catch (e) {}
  },
};
