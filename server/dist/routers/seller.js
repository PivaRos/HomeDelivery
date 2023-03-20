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
const mongodb_1 = require("mongodb");
const middleware_1 = require("../middleware");
const interfaces_1 = require("../interfaces");
const Router = (MongoObject) => {
    const SellerRouter = express_1.default.Router();
    SellerRouter.use(middleware_1.isSeller);
    // get all orders no metter what status
    SellerRouter.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const Orders = yield MongoObject.collections.Orders.find({ $and: [
                    { seller: new mongodb_1.ObjectId(res.locals.account._id) },
                    { status: { $ne: 0 } }
                ] }).toArray();
            if (Orders.length) {
                return res.json({
                    err: false,
                    msg: "ok",
                    data: Orders
                });
            }
            else {
                return res.json({
                    err: false,
                    msg: "not found",
                    data: null
                });
            }
        }
        catch (_a) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify request"
            });
        }
    }));
    //accept new order *
    SellerRouter.post('/order/accept', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const order_id = req.body.Orderid;
            const store = yield MongoObject.collections.Stores.findOne({ authorizedUsers: { $elemMatch: res.locals.account._id } });
            const order = yield MongoObject.collections.Orders.findOne({ $and: [
                    { _id: new mongodb_1.ObjectId(order_id) },
                    { store_id: store._id }
                ] });
            if (order === null)
                throw new Error("null order");
            if (order.status !== interfaces_1.order_status.pending)
                throw new Error("status not pending");
            yield MongoObject.collections.Orders.updateOne({ _id: new mongodb_1.ObjectId(order_id) }, { $set: { status: interfaces_1.order_status.accepted } });
            return res.sendStatus(200);
        }
        catch (_b) {
            res.sendStatus(500);
        }
    }));
    return SellerRouter;
};
exports.default = Router;
