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
    const AuthorizationRouter = express_1.default.Router();
    const InputValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        next();
    });
    AuthorizationRouter.post("/account", InputValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            var user = yield MongoObject.collections.Accounts.findOne({ $and: [
                    { username: req.body.username },
                    { password: req.body.password }
                ] });
            var sessionid = makeid(14);
            if (user) {
                var updatevar = yield MongoObject.collections.Accounts.updateOne({ _id: user._id }, { $set: { sessionid: sessionid } });
                if (updatevar.acknowledged) {
                    res.status(200);
                    return res.json({
                        err: false,
                        accountType: user.type,
                        sessionid: sessionid
                    });
                }
                throw new Error("unable to update sessionid");
            }
            else {
                res.status(500);
                return res.json({
                    err: true,
                    msg: "no user found",
                    not: null // number of tries left
                });
            }
        }
        catch (exeption) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    }));
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    return AuthorizationRouter;
};
exports.default = Router;
