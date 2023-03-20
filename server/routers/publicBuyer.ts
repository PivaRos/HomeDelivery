import express, { NextFunction, Request, Response } from 'express';
import mongodb, { ObjectId,  } from 'mongodb';
import { checkValidation, processPayment, isSeller, isBuyer } from '../middleware';
import { Account, LocationObject, Order, PaymentLog, productOrder, Store } from '../interfaces';
import { getDistance } from '../functions';

const Router = (MongoObject: {
    databases: {
        data: mongodb.Db;
        log: mongodb.Db;
    };
    collections: {
        Stores: mongodb.Collection<Store>;
        Orders: mongodb.Collection<Order>;
        Accounts: mongodb.Collection<Account>;
        Applications: mongodb.Collection<mongodb.BSON.Document>;
        Transactions: mongodb.Collection<mongodb.BSON.Document>;
        ClosedApplications: mongodb.Collection<mongodb.BSON.Document>;
    }
}) => {
    const PublicbuyerRouter = express.Router();



  

    PublicbuyerRouter.post("/get/sellers", async (req:Request, res:Response) => {
        const buyerLocation = req.body.location;
        try {
            const projection = { authorizedUsers: 0 };
            let sellers = await MongoObject.collections.Stores.find({}).project(projection).toArray();
                let returnSellers:Store[] = [];
                sellers.forEach(seller => {  //checks foreach seller the distance
                    const distance = getDistance(seller.location, buyerLocation);
                    if (distance < seller.deliveryDistance)
                    {
                        returnSellers.push(<Store>seller);
                    }
                });
                console.log(returnSellers);
                res.status(200);
                return res.json({
                    err:false,
                    msg:"ok",
                    data:returnSellers
                });
            }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    })


    return PublicbuyerRouter;
}




export default Router;
