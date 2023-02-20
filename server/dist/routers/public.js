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
const Router = (MongoObject) => {
    const PublicRouter = express_1.default.Router();
    // loggedin user tring to get all sellers that are available in his range
    PublicRouter.post("/sellers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            var returnSellers = [];
            const projection = { authorizedUsers: 0 };
            console.log(req.body.sessionid);
            const user = yield MongoObject.collections.Accounts.findOne({ sessionid: req.body.sessionid });
            const sellers = yield MongoObject.collections.Sellers.find({}).project(projection).toArray();
            if (user) {
                sellers.forEach(seller => {
                    var dy = seller.location.coordinates[0] - user.location.coordinates[0];
                    var dx = seller.location.coordinates[1] - user.location.coordinates[1];
                    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                    console.log(Math.round(distance * 1000) + "m");
                    if (distance < seller.deliveryDistance) {
                        returnSellers.push(seller);
                    }
                });
                return res.json({ returnSellers });
            }
        }
        catch (e) {
            console.log(e);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    }));
    return PublicRouter;
};
exports.default = Router;
