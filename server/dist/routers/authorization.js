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
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const Router = (MongoObject) => {
    const AuthorizationRouter = express_1.default.Router();
    AuthorizationRouter.post('/account', (0, express_validator_1.check)('username').exists().isLength({ min: 4 }), (0, express_validator_1.check)('password').exists().isLength({ min: 7 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, express_validator_1.validationResult)(req).throw();
            const user = yield MongoObject.collections.Accounts.findOne({
                $and: [
                    { username: req.body.username },
                    { password: req.body.password }
                ]
            });
            const sessionid = (0, uuid_1.v4)();
            if (user != null) {
                const updatevar = yield MongoObject.collections.Accounts.updateOne({ _id: user._id }, { $set: { sessionid } });
                if (updatevar.acknowledged) {
                    res.status(200);
                    return res.json({
                        err: false,
                        accountType: user.type,
                        sessionid
                    });
                }
                throw new Error('unable to update sessionid');
            }
            else {
                res.status(500);
                return res.json({
                    err: true,
                    msg: 'no user found',
                    not: null // number of tries left
                });
            }
        }
        catch (exeption) {
            res.status(500);
            return res.json({
                err: true,
                msg: 'unable to verify user',
                not: null // number of tries left
            });
        }
    }));
    return AuthorizationRouter;
};
exports.default = Router;
