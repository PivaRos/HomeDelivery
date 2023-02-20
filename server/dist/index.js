"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//database init
const mongodb_1 = require("mongodb");
const mongostring = process.env.MongoCluster || "";
const client = new mongodb_1.MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");
// data collections
const Accounts = data.collection("Accounts");
const Orders = data.collection("Orders");
const Applications = data.collection("Applications");
const Sellers = data.collection("Sellers");
// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");
// MongoDB Object
// should be passed to global router!
const MongoObject = {
    databases: {
        data: data,
        log: log
    },
    collections: {
        Sellers: Sellers,
        Orders: Orders,
        Accounts: Accounts,
        Applications: Applications,
        Transactions: Transactions,
        ClosedApplications: ClosedApplications
    }
};
//routing
const authorization_1 = __importDefault(require("./routers/authorization"));
const public_1 = __importDefault(require("./routers/public"));
app.use('/public', (0, public_1.default)(MongoObject));
app.use('/authorization', (0, authorization_1.default)(MongoObject));
// running
app.listen(8000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});
