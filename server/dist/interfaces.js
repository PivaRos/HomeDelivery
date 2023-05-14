"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorePermissions = exports.LocationType = exports.OrderStatus = exports.StoreCategory = exports.AccountType = exports.Pages = void 0;
var Pages;
(function (Pages) {
    Pages["Stores"] = "Stores";
    Pages["Orders"] = "Orders";
    Pages["Account"] = "Account";
    Pages["Home"] = "Home";
})(Pages = exports.Pages || (exports.Pages = {}));
var AccountType;
(function (AccountType) {
    AccountType[AccountType["Seller"] = 2] = "Seller";
    AccountType[AccountType["Buyer"] = 1] = "Buyer";
    AccountType[AccountType["Delivery"] = 3] = "Delivery";
    AccountType[AccountType["Support"] = 4] = "Support";
    AccountType[AccountType["Admin"] = 5] = "Admin";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var StoreCategory;
(function (StoreCategory) {
    StoreCategory[StoreCategory["food"] = 1] = "food";
    StoreCategory[StoreCategory["homeMade"] = 2] = "homeMade";
})(StoreCategory = exports.StoreCategory || (exports.StoreCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["pending"] = 1] = "pending";
    OrderStatus[OrderStatus["cancelled"] = 0] = "cancelled";
    OrderStatus[OrderStatus["accepted"] = 2] = "accepted";
    OrderStatus[OrderStatus["onDelivery"] = 3] = "onDelivery";
    OrderStatus[OrderStatus["done"] = 4] = "done";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var LocationType;
(function (LocationType) {
    LocationType["point"] = "point";
    LocationType["address"] = "address";
})(LocationType = exports.LocationType || (exports.LocationType = {}));
exports.StorePermissions = {
    _id: [5],
    logo: [2, 4, 5],
    name: [5, 4],
    products: [2, 4, 5],
    authorizedUsers: [4, 5],
    location: [4, 5],
    deliveryDistance: [2, 4, 5],
    openHoursObject: [2, 4, 5],
    category: [4, 5],
    minOrder: [2, 4, 5],
    active: [2, 4, 5]
};
