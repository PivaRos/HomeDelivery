"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorePermissions = exports.store_category = exports.LocationType = exports.OrderStatus = exports.StoreCategory = exports.AccountType = exports.Pages = void 0;
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
var store_category;
(function (store_category) {
    store_category[store_category["food"] = 1] = "food";
    store_category[store_category["homeMade"] = 2] = "homeMade";
})(store_category = exports.store_category || (exports.store_category = {}));
exports.StorePermissions = {
    _id: [AccountType.Admin],
    logo: [AccountType.Seller, AccountType.Support, AccountType.Admin],
    name: [AccountType.Admin, AccountType.Support],
    products: [AccountType.Seller, AccountType.Support, AccountType.Admin],
    authorizedUsers: [AccountType.Support, AccountType.Admin],
    location: [AccountType.Support, AccountType.Admin, AccountType.Seller],
    deliveryDistance: [AccountType.Seller, AccountType.Support, AccountType.Admin],
    openHoursObject: [AccountType.Seller, AccountType.Support, AccountType.Admin],
    category: [AccountType.Support, AccountType.Admin],
    minOrder: [AccountType.Seller, AccountType.Support, AccountType.Admin],
    active: [AccountType.Seller, AccountType.Support, AccountType.Admin]
};
