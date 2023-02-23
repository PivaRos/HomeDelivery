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
const Router = (MongoObject) => {
    const PublicRouter = express_1.default.Router();
    // checks authorization headers
    const checkValidation = (req, res, next) => {
        if (req.headers.authorization) {
            // more checks should be done!!
            next();
        }
        else {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    };
    // loggedin Account tring to get all sellers that are available in his range
    PublicRouter.get("/sellers", checkValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const projection = { authorizedUsers: 0 };
            const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            let sellers = yield MongoObject.collections.Sellers.find({}).project(projection).toArray();
            if (user && user.type === 1) // check that user with this session was found and that the account is only buyer
             {
                let returnSellers = [];
                sellers.forEach(seller => {
                    const dy = seller.location.coordinates[0] - (+user.location.coordinates[0]);
                    const dx = (seller.location.coordinates[1] - (+user.location.coordinates[1]));
                    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                    if (distance < seller.deliveryDistance) {
                        returnSellers.push(seller);
                    }
                });
                res.status(200);
                return res.json({
                    err: false,
                    msg: "ok",
                    data: returnSellers
                });
            }
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
    //recives sessionid and returns all open orders that are waiting delivery and within the range
    PublicRouter.get("/delivery", checkValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            if (user && user.type === 2) // only delivery accounts
             {
                let returnOrders = [];
                const Orders = yield MongoObject.collections.Orders.find({}).toArray();
                Orders.forEach(Order => {
                    if (Order.status === 2) {
                        const dy = (+Order.location.coordinates[0]) - (+user.location.coordinates[0]);
                        const dx = (+Order.location.coordinates[1]) - (+user.location.coordinates[1]);
                        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                        if (user.deliveryDistance && (distance < user.deliveryDistance)) {
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
    const processPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const cardNumber = req.body.cardNumber;
        const cardExpireDate = req.body.cardExpireDate;
        const cardCVV = req.body.cardCVV;
        // make api call to privider of services
        //get responce of 200
        //and then call next()
        next();
    });
    //first stage when buyer sends order to seller
    PublicRouter.post("/order/1", checkValidation, processPayment, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (res.locals.PaymentLog.accepted) // check if payment has been made
             {
                const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
                if (user && user.type === 1) //only buyer account found
                 {
                    //check if user can order
                    const Seller = yield MongoObject.collections.Sellers.findOne({ _id: new mongodb_1.ObjectId(req.body.seller) });
                    const distance = getDistance(Seller.location, user.location);
                    if (distance < Seller.deliveryDistance) // user can order
                     {
                        //make order
                        var theDate = new Date();
                        var Order = {
                            seller: new mongodb_1.ObjectId(req.body.seller),
                            buyer: user._id,
                            products: req.body.products.map((product) => {
                                return {
                                    productId: new mongodb_1.ObjectId(product.productId),
                                    details: {}
                                };
                            }),
                            date: {
                                date: theDate,
                                timestamp: theDate.getTime()
                            },
                            location: user.location,
                            totalPrice: res.locals.totalPrice,
                            status: 1,
                            city: req.body.city,
                            street: req.body.address,
                            homeNumber: user.phoneNumber
                        };
                        MongoObject.collections.Orders.insertOne(Order);
                    }
                    throw new Error("out of service distance");
                }
            }
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "server error",
                not: null // number of tries left
            });
        }
    }));
    //returns distance (km)
    const getDistance = (Location1, Location2) => {
        const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
        const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
        return distance;
    };
    return PublicRouter;
};
exports.default = Router;
