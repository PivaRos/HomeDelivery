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
    SellerRouter.put('/store', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const Keys = Object.keys(interfaces_1.StorePermissions);
            const body = req.body;
            let data = { successfulChanges: new Array() };
            data;
            const Stores = yield MongoObject.collections.Stores.find({
                authorizedUsers: { $all: [res.locals.account._id.toString()] }
            }).toArray();
            let Store;
            Stores.map((store) => {
                if (store._id.toString() === body.store_id) {
                    Store = store;
                }
            });
            if (!Store)
                throw new Error("no store found");
            yield body.fieldsToChange.map((field, index) => __awaiter(void 0, void 0, void 0, function* () {
                if (!Keys.includes(field))
                    return; //need to add -> allow requester to know that this is not changable field
                if (!interfaces_1.StorePermissions[field].includes(2))
                    return;
                if (field === "products") {
                    if (body.setProducts) {
                        body.setProducts.map((setObject) => __awaiter(void 0, void 0, void 0, function* () {
                            if (Store) {
                                Store.products[setObject.index] = setObject.product;
                                yield MongoObject.collections.Stores.updateOne({ _id: Store === null || Store === void 0 ? void 0 : Store._id }, {
                                    $set: {
                                        products: Store === null || Store === void 0 ? void 0 : Store.products
                                    }
                                });
                            }
                        }));
                    }
                    if (body.addProducts) {
                        body.addProducts.map((products) => {
                            Store === null || Store === void 0 ? void 0 : Store.products.push(products);
                        });
                        yield MongoObject.collections.Stores.updateOne({ _id: Store === null || Store === void 0 ? void 0 : Store._id }, {
                            $set: {
                                products: Store === null || Store === void 0 ? void 0 : Store.products
                            }
                        });
                    }
                }
                else {
                    let obj = {};
                    obj[field] = body.newValues[index];
                    yield MongoObject.collections.Stores.updateOne({ _id: new mongodb_1.ObjectId(Store === null || Store === void 0 ? void 0 : Store._id) }, {
                        $set: obj
                    });
                }
                data.successfulChanges.push(field);
            }));
            return res.json({
                err: false,
                data: data,
                msg: "ok"
            });
        }
        catch (e) {
            console.log(e.message);
            res.status(500);
            const json = {
                err: true,
                msg: "unable to complete action"
            };
            res.json(json);
        }
    }));
    SellerRouter.get('/account', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.json(res.locals.account);
    }));
    SellerRouter.get('/stores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const Stores = yield MongoObject.collections.Stores.find({ authorizedUsers: { $all: [res.locals.account._id.toString()] } }).toArray();
            return res.json({ Stores });
        }
        catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    }));
    // get all orders no metter what status
    SellerRouter.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orders = yield MongoObject.collections.Orders.find({
                $and: [
                    { seller: new mongodb_1.ObjectId(res.locals.account._id) },
                    { status: { $ne: 0 } }
                ]
            }).toArray();
            if (orders.length > 0) {
                res.json({
                    err: false,
                    msg: 'ok',
                    data: orders
                });
            }
            else {
                res.json({
                    err: false,
                    msg: 'not found',
                    data: null
                });
            }
        }
        catch (_a) {
            res.status(500);
            res.json({
                err: true,
                msg: 'unable to verify request'
            });
        }
    }));
    // accept new order *
    SellerRouter.post('/order/accept', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const order_id = req.body.Orderid;
            const store = yield MongoObject.collections.Stores.findOne({ authorizedUsers: { $elemMatch: res.locals.account._id } });
            const order = yield MongoObject.collections.Orders.findOne({
                $and: [
                    { _id: new mongodb_1.ObjectId(order_id) },
                    { store_id: store._id }
                ]
            });
            if (order === null)
                throw new Error('null order');
            if (order.status !== interfaces_1.OrderStatus.pending)
                throw new Error('status not pending');
            yield MongoObject.collections.Orders.updateOne({ _id: new mongodb_1.ObjectId(order_id) }, { $set: { status: interfaces_1.OrderStatus.accepted } });
            return res.sendStatus(200);
        }
        catch (_b) {
            res.sendStatus(500);
        }
    }));
    return SellerRouter;
};
exports.default = Router;
