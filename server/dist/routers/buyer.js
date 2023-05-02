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
const functions_1 = require("../functions");
const Router = (MongoObject) => {
    const buyerRouter = express_1.default.Router();
    buyerRouter.use([middleware_1.checkValidation, middleware_1.isBuyer]);
    // loggedin Account tring to get all sellers that are available in his range
    buyerRouter.get('/sellers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const projection = { authorizedUsers: 0 };
            const user = res.locals.account;
            const sellers = yield MongoObject.collections.Stores.find({}).project(projection).toArray();
            const returnSellers = [];
            sellers.forEach(seller => {
                const distance = (0, functions_1.getDistance)(seller.location, user.location);
                if (distance < seller.deliveryDistance) {
                    returnSellers.push(seller);
                }
            });
            res.status(200);
            return res.json({
                err: false,
                msg: 'ok',
                data: returnSellers
            });
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: 'unable to verify user',
                not: null // number of tries left
            });
        }
    }));
    function createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!res.locals.PaymentLog.accepted)
                    throw new Error();
                const user = res.locals.account;
                // check if user can order
                const store = yield MongoObject.collections.Stores.findOne({ _id: new mongodb_1.ObjectId(req.body.store) });
                if (!store)
                    throw new Error('no store found');
                const distance = (0, functions_1.getDistance)(store.location, user.location);
                if (distance > store.deliveryDistance)
                    throw new Error('out of service distance');
                // make order
                const Order = {
                    seller: new mongodb_1.ObjectId(req.body.store),
                    buyer: new mongodb_1.ObjectId(user._id),
                    products: req.body.products.map((product) => {
                        return {
                            productId: new mongodb_1.ObjectId(product.productId),
                            details: {}
                        };
                    }),
                    date: {
                        date: new Date(),
                        timestamp: new Date().getTime()
                    },
                    location: user.location,
                    totalPrice: res.locals.totalPrice,
                    status: 1,
                    city: req.body.city,
                    street: req.body.address,
                    zipcode: req.body.zipcode,
                    homenumber: user.phonenumber
                };
                const result = yield MongoObject.collections.Orders.insertOne(Order);
                return res.json({
                    err: false,
                    msg: 'ok',
                    data: {
                        order: result.insertedId
                    }
                });
            }
            catch (e) {
                res.status(500);
                console.log(e);
                return res.json({
                    err: true,
                    msg: 'server error',
                    not: null // number of tries left
                });
            }
        });
    }
    // first stage when buyer sends order to seller
    buyerRouter.post('/order', middleware_1.processPayment, createOrder);
    buyerRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return res.json(res.locals.account);
    }));
    buyerRouter.post('/new/get/sellers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const buyerLocation = req.body.location;
        try {
            const projection = { authorizedUsers: 0 };
            const sellers = yield MongoObject.collections.Stores.find({}).project(projection).toArray();
            const returnSellers = [];
            sellers.forEach(seller => {
                const distance = (0, functions_1.getDistance)(seller.location, buyerLocation);
                if (distance < seller.deliveryDistance) {
                    returnSellers.push(seller);
                }
            });
            res.status(200);
            return res.json({
                err: false,
                msg: 'ok',
                data: returnSellers
            });
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: 'unable to verify user',
                not: null // number of tries left
            });
        }
    }));
    return buyerRouter;
};
exports.default = Router;
