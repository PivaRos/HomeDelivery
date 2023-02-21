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
    const checkHeaders = (req, res, next) => {
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
    PublicRouter.get("/sellers", checkHeaders, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    PublicRouter.get("/delivery", checkHeaders, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            if (user && user.type === 2) // only delivery accounts
             {
                let returnOrders = [];
                const Orders = yield MongoObject.collections.Orders.find({});
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
    //first stage when buyer sends order to seller
    PublicRouter.post("/order/1", checkHeaders, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
        if (user && user.type === 1) //only buyer account found
         {
            var Order = {
                seller: new mongodb_1.ObjectId(req.body.seller),
                buyer: user._id,
                products: [],
                date: {
                    date: new Date(),
                    timestamp: new Date().getTime()
                },
                location: {
                    type: "point",
                    coordinates: [32.34234, 32.3421]
                },
                totalPrice: 23,
                status: 1,
                city: "",
                street: "",
                homeNumber: ""
            };
            MongoObject.collections.Orders.insertOne(Order);
        }
    }));
    return PublicRouter;
};
exports.default = Router;
