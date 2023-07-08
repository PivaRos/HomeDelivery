import { configureStore } from "@reduxjs/toolkit";
import { deliveryLocationReducer } from "./reducers/deliveryLocationReducer";

 export const Store = configureStore({
    reducer:{
      deliveryLocation:deliveryLocationReducer
    }
})