
import {combineReducers} from 'redux'
import { deliveryLocationReducer } from './reducers/deliveryLocationReducer'
import { currentLocationReducer } from './reducers/currentLocationReducer'
import { loadingReducer } from './reducers/loadingReducer'
import { homeMadeStoresReducer } from './reducers/homeMadeStoresReducer'
import { foodStoresReducer } from './reducers/foodStoresReducer'
import { selectedStoreReducer } from './reducers/selectedStoreReducer'
import { refreshingReducer } from './reducers/refreshingReducer'
import { sessionIDReducer } from './reducers/sessionIDReducer'
import { selectedProductReducer } from './reducers/selectedProductReducer'
import { savedOrderReducer } from './reducers/savedOrderReducer'
import { addressReducer } from './reducers/addressReducer'
import { savedAddressesReducer } from './reducers/savedAddressesReducer'

export const rootReducer = combineReducers({
    deliveryLocation:deliveryLocationReducer,
    currentLocation:currentLocationReducer,
    loading:loadingReducer,
    homeMadeStores:homeMadeStoresReducer,
    foodStores:foodStoresReducer,
    selectedStore:selectedStoreReducer,
    refreshing:refreshingReducer,
    sessionID:sessionIDReducer,
    selectedProduct:selectedProductReducer,
    savedOrder:savedOrderReducer,
    address:addressReducer,
    savedAddresses:savedAddressesReducer
})