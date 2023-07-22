import { configureStore, createStore } from "@reduxjs/toolkit";
import { deliveryLocationReducer } from "./reducers/deliveryLocationReducer";
import { currentLocationReducer } from "./reducers/currentLocationReducer";
import { loadingReducer } from "./reducers/loadingReducer";
import { homeMadeStoresReducer } from "./reducers/homeMadeStoresReducer";
import { foodStoresReducer } from "./reducers/foodStoresReducer";
import { selectedStoreReducer } from "./reducers/selectedStoreReducer";
import { refreshingReducer } from "./reducers/refreshingReducer";
import { sessionIDReducer } from "./reducers/sessionIDReducer";
import { selectedProductReducer } from "./reducers/selectedProductReducer";
import { savedOrderReducer } from "./reducers/savedOrderReducer";
import { addressReducer } from "./reducers/addressReducer";
import { savedAddressesReducer } from "./reducers/savedAddressesReducer";
import { createStoreHook } from "react-redux";
import { rootReducer } from "./rootReducer";

 export const Store = createStore(rootReducer)