import express, { NextFunction, Request, Response } from 'express';
import mongodb from 'mongodb';
import { checkValidation, processPayment, isSeller, isBuyer } from '../middleware';
import { Account, LocationObject, Order, PaymentLog, productOrder, Store } from '../interfaces';
import { getDistance, isOpen, timeToSecondsFromStartOfDay } from '../functions';

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
                let OpenReturnSellers:Store[] = [];
                let ClosedReturnSellers:Store[] = [];
                sellers.forEach(seller => {  //checks foreach seller the distance
                    const distance = getDistance(seller.location, buyerLocation);
                    if (distance < seller.deliveryDistance)
                    {
                        //check open hours
                        if (isOpen(seller.openHoursObject, seller.openHoursObject.hasCloseNextDay))
                        {

                            OpenReturnSellers.push(<Store>seller);
                        }
                        else
                        {
                            ClosedReturnSellers.push(<Store>seller);
                        }
                        
                    }
                });
                res.status(200);
                return res.json({
                    err:false,
                    msg:"ok",
                    data:{
                        Open:OpenReturnSellers,
                        Closed:ClosedReturnSellers
                    }
                });
            }
        catch (e) {

            res.status(500);
            return res.json({
                err: true,
                msg: "something went wrong",
                not: null // number of tries left
            });
        }
    })


    return PublicbuyerRouter;
}




export default Router;
