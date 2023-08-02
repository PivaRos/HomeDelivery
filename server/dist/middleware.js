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
exports.isSupport = exports.isAdmin = exports.isDelivery = exports.isSeller = exports.isBuyer = exports.InputValidator = exports.checkValidation = exports.processPayment = void 0;
const _1 = require(".");
const request_1 = __importDefault(require("request"));
const processPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // make api call to privider of services
        const CreditCard_Number = res.locals.CreditCard_Number; // string
        const CreditCard_ExpirationMonth = res.locals.CreditCard_ExpirationMonth; //int
        const CreditCard_ExpirationYear = res.locals.CreditCard_ExpirationYear; // int
        const CreditCard_CVV = res.locals.CreditCard_CVV; // string 
        const CreditCard_CitizenID = res.locals.CreditCard_CitizenID; // string
        const UnitPrice = res.locals.UnitPrice;
        const ProviderUri = "https://api.sumit.co.il/billing/payments/charge/";
        const ProviderSecret = process.env.SumitProvierSecretKey;
        const CompanyID = process.env.CompanyID;
        const data = {
            "Customer": {
                "ExternalIdentifier": null,
                "NoVAT": null,
                "SearchMode": 0,
                "Name": "general",
                "Phone": null,
                "EmailAddress": null,
                "City": null,
                "Address": null,
                "ZipCode": null,
                "CompanyNumber": null,
                "ID": null,
                "Folder": null
            },
            "PaymentMethod": {
                "ID": null,
                "CustomerID": null,
                "CreditCard_Number": CreditCard_Number,
                "CreditCard_LastDigits": null,
                "CreditCard_ExpirationMonth": CreditCard_ExpirationMonth,
                "CreditCard_ExpirationYear": CreditCard_ExpirationYear,
                "CreditCard_CVV": CreditCard_CVV,
                "CreditCard_Track2": null,
                "CreditCard_CitizenID": CreditCard_CitizenID,
                "CreditCard_CardMask": null,
                "CreditCard_Token": null,
                "DirectDebit_Bank": null,
                "DirectDebit_Branch": null,
                "DirectDebit_Account": null,
                "DirectDebit_ExpirationDate": null,
                "DirectDebit_MaximumAmount": null,
                "Type": 1
            },
            "SingleUseToken": null,
            "CreditCardAuthNumber": null,
            "Items": [
                {
                    "Item": {
                        "ID": null,
                        "Name": "My Product",
                        "Description": null,
                        "Price": null,
                        "Currency": null,
                        "Cost": null,
                        "ExternalIdentifier": null,
                        "SKU": null,
                        "SearchMode": null
                    },
                    "Quantity": 1,
                    "UnitPrice": UnitPrice,
                    "Total": UnitPrice,
                    "Currency": null,
                    "Description": null
                }
            ],
            "Payments_Credit": null,
            "Payments_Count": null,
            "Payments_FirstAmount": null,
            "Payments_NonFirstAmount": null,
            "UpdateCustomerByEmail": null,
            "UpdateCustomerByEmail_AttachDocument": null,
            "UpdateCustomerByEmail_Language": null,
            "SendDocumentByEmail": true,
            "SendDocumentByEmail_Language": null,
            "DocumentLanguage": null,
            "DocumentDescription": null,
            "VATIncluded": true,
            "VATRate": null,
            "AuthoriseOnly": null,
            "DraftDocument": null,
            "DocumentType": null,
            "SupportCredit": null,
            "MerchantNumber": null,
            "SendCopyToOrganization": null,
            "CardTokenNotNeeded": null,
            "AutoCapture": null,
            "AuthorizeAmount": null,
            "PreventStandingOrder": null,
            "Credentials": {
                "CompanyID": 196125877,
                "APIKey": "Ej5UA8CTYHWbTWZDLv2yPcgueVxWQJ6ymTQwkzGNMruFHNofEB"
            },
            "ResponseLanguage": null
        };
        (0, request_1.default)({
            uri: ProviderUri,
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }, (Response) => {
            console.log(Response);
            res.locals.Response = Response;
            next();
        });
        // get responce of 200
        res.locals.PaymentLog = {
            accepted: true,
            timestamp: new Date().getTime(),
            priceCharged: 0 // the price
        };
        // and then call next()
    }
    catch (e) {
        console.log(e);
        res.locals.err = e;
        next();
    }
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
            msg: 'unable to verify user',
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
    res.locals.account = yield _1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 1) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isBuyer = isBuyer;
const isSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield _1.Accounts.findOne({ sessionid: req.headers.authorization });
    if ((res.locals.account != null) && res.locals.account.type === 2) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isSeller = isSeller;
const isDelivery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield _1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 3) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isDelivery = isDelivery;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield _1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 5) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isAdmin = isAdmin;
const isSupport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.account = yield _1.Accounts.findOne({ sessionid: req.headers.authorization });
    if (res.locals.account && res.locals.account.type === 4) {
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.isSupport = isSupport;
