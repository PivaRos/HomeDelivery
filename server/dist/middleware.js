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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupport = exports.isAdmin = exports.isDelivery = exports.isSeller = exports.isBuyer = exports.InputValidator = exports.checkValidation = exports.processPayment = void 0;
const index_1 = require("./index");
const processPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cardNumber = req.body.cardNumber;
    const cardExpireDate = req.body.cardExpireDate;
    const cardCVV = req.body.cardCVV;
    const cardHolderId = req.body.cardHolderId;
    // make api call to privider of services
    //get responce of 200
    res.locals.PaymentLog = {
        accepted: true,
        timestamp: new Date().getTime(),
        priceCharged: 0 // the price
    };
    //and then call next()
    next();
});
exports.processPayment = processPayment;
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
exports.checkValidation = checkValidation;
const InputValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next();
});
exports.InputValidator = InputValidator;
const isBuyer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield index_1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 1) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isBuyer = isBuyer;
const isSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield index_1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 3) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isSeller = isSeller;
const isDelivery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield index_1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 2) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isDelivery = isDelivery;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield index_1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 5) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isAdmin = isAdmin;
const isSupport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield index_1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 4) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isSupport = isSupport;
