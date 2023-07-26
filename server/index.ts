import express, { type Express, Request, Response } from "express";
import dotenv from "dotenv";
import { type Account, type Order, type Store } from "./interfaces";
import { SocketServer } from "./routers/socket";
// database init
import mongodb, { MongoClient } from "mongodb";

// routing
import AuthorizationRouter from "./routers/authorization";
import DeliveryRouter from "./routers/delivery";
import BuyerRouter from "./routers/buyer";
import PublicBuyerRouter from "./routers/publicBuyer";
import SellerRouter from "./routers/seller";
import DataRouter from "./routers/data";

dotenv.config();
const app: Express = express();
app.use(express.json());
const mongostring =
  process.env.MongoCluster || process.env.LocalMongoCluster || "";
const client = new MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");
const uploads = client.db("uploads");

// data collections
export const Accounts = data.collection<Account>("Accounts");
const Orders = data.collection<Order>("Orders");
const Applications = data.collection("Applications");
export const Stores = data.collection<Store>("Stores");

// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");

// MongoDB Object
// should be passed to global router!
const MongoObject = {
  client: client,
  databases: {
    data: data,
    log: log,
    uploads: uploads,
  },
  collections: {
    Stores: Stores,
    Orders: Orders,
    Accounts: Accounts,
    Applications: Applications,
    Transactions: Transactions,
    ClosedApplications: ClosedApplications,
  },
};
SocketServer(MongoObject);

app.use("/data", DataRouter(MongoObject));
app.use("/buyer", BuyerRouter(MongoObject));
app.use("/publicbuyer", PublicBuyerRouter(MongoObject));
app.use("/delivery", DeliveryRouter(MongoObject));
app.use("/authorization", AuthorizationRouter(MongoObject));
app.use("/seller", SellerRouter(MongoObject));

// running
app.listen(process.env.ExpressPORT ? +process.env.ExpressPORT : 8000, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${
      process.env.ExpressPORT ? +process.env.ExpressPORT : 8000
    }`
  );
});
