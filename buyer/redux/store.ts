import { configureStore } from "@reduxjs/toolkit";
import { deliveryLocationReducer } from "./reducers/deliveryLocationReducer";
import { currentLocationReducer } from "./reducers/currentLocationReducer";
import { loadingReducer } from "./reducers/loadingReducer";

 export const Store = configureStore({
    reducer:{
      deliveryLocation:deliveryLocationReducer,
      currentLocation:currentLocationReducer,
      loading:loadingReducer
    }
})