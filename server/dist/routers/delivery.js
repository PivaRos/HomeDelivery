"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const functions_1 = require("../functions");
const Router = (MongoObject) => {
    const DeliveryRouter = express_1.default.Router(); // all http requests that are made with seller
    DeliveryRouter.use(middleware_1.isDelivery);
    //recives sessionid and returns all open orders that are waiting delivery and within the range
    DeliveryRouter.get("/waiting", middleware_1.checkValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = res.locals.account;
            let returnOrders = [];
            const Orders = yield MongoObject.collections.Orders.find({}).toArray();
            Orders.forEach(Order => {
                if (Order.status === 2) {
                    const distance = (0, functions_1.getDistance)(Order.location, user.location);
                    if (distance < user.deliveryDistance) {
                        returnOrders.push(Order);
                    }
                }
            });
            res.status(200);
            return res.json({
                err: false,
                msg: "ok",
                data: returnOrders
            });
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    }));
    return DeliveryRouter;
};
exports.default = Router;
