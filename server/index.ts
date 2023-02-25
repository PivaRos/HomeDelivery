import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Account, Order, Seller } from './interfaces';

dotenv.config();
const app: Express = express();
app.use(express.json());

//database init
import mongodb, {MongoClient} from 'mongodb';
const mongostring = process.env.MongoCluster || "";
const client = new MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");

// data collections
export const Accounts = data.collection<Account>("Accounts");
const Orders = data.collection<Order>("Orders");
const Applications = data.collection("Applications");
const Sellers = data.collection<Seller>("Sellers");

// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");

// MongoDB Object
// should be passed to global router!
const MongoObject = {
  databases:{
    data:data,
    log:log
  }, 
  collections:{
    Sellers:Sellers,
    Orders:Orders,
    Accounts:Accounts,
    Applications:Applications,
    Transactions:Transactions,
    ClosedApplications:ClosedApplications
  }
}

//routing
import AuthorizationRouter from "./routers/authorization";
import DeliveryRouter from "./routers/delivery";
import BuyerRouter from "./routers/buyer";
app.use('/buyer', BuyerRouter(MongoObject));
app.use('/delivery', DeliveryRouter(MongoObject));
app.use('/authorization', AuthorizationRouter(MongoObject));



// running
app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});