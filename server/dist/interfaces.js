"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_status = exports.account_type = void 0;
var account_type;
(function (account_type) {
    account_type[account_type["Seller"] = 2] = "Seller";
    account_type[account_type["Buyer"] = 1] = "Buyer";
    account_type[account_type["Delivery"] = 3] = "Delivery";
    account_type[account_type["Support"] = 4] = "Support";
    account_type[account_type["Admin"] = 5] = "Admin";
})(account_type = exports.account_type || (exports.account_type = {}));
var order_status;
(function (order_status) {
    order_status[order_status["pending"] = 1] = "pending";
    order_status[order_status["cancelled"] = 0] = "cancelled";
    order_status[order_status["accepted"] = 2] = "accepted";
    order_status[order_status["onDelivery"] = 3] = "onDelivery";
    order_status[order_status["done"] = 4] = "done";
})(order_status = exports.order_status || (exports.order_status = {}));
