import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();

//database init
import mongodb, {MongoClient} from 'mongodb';
const mongostring = process.env.MongoCluster || "";
const client = new MongoClient(mongostring);
const data = client.db("data");
const log = client.db("log");

// data collections
const Accounts = data.collection("Accounts");
const Orders = data.collection("Orders");
const Applications = data.collection("Applications");

// log collections
const Transactions = log.collection("Transactions");
const ClosedApplications = log.collection("ClosedApplications");

// MongoDB Object
// should be passed to every router!
const MongoObject = {
  databases:{
    data:data,
    log:log
  }, 
  collections:{
    Orders:Orders,
    Accounts:Accounts,
    Applications:Applications,
    Transactions:Transactions,
    ClosedApplications:ClosedApplications
  }
}

//routing
import AuthorizationRouter from "./routers/authorization";
import publicRouter from "./routers/public";
app.use('/public', publicRouter());
app.use('/public', AuthorizationRouter(Accounts));



// running
app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:8000`);
});