import express, { NextFunction, Request, Response } from 'express';
import mongodb, { ObjectId,  } from 'mongodb';
import { checkValidation, processPayment, isSeller, isBuyer } from '../middleware';
import { Account, LocationObject, Order, PaymentLog, productOrder, Seller } from '../interfaces';
import { getDistance } from '../functions';

const Router = (MongoObject: {
    databases: {
        data: mongodb.Db;
        log: mongodb.Db;
    };
    collections: {
        Sellers: mongodb.Collection<Seller>;
        Orders: mongodb.Collection<Order>;
        Accounts: mongodb.Collection<Account>;
        Applications: mongodb.Collection<mongodb.BSON.Document>;
        Transactions: mongodb.Collection<mongodb.BSON.Document>;
        ClosedApplications: mongodb.Collection<mongodb.BSON.Document>;
    }
}) => {
    const SellerRouter = express.Router();
    SellerRouter.use(isSeller);


    // get all orders no metter what status
    SellerRouter.get('/orders', async (req:Request, res:Response) => {
        try{
       const Orders = await MongoObject.collections.Orders.find({$and:[
        {seller:new ObjectId(res.locals.account._id)},
        {status :{ $ne: 0 }}
        
        ]}).toArray();
       if (Orders.length)
       {
        return res.json({
            err:false, 
            msg:"ok",
            data:Orders
        });
       }
       else
       {
        return res.json({
            err:false,
            msg:"not found",
            data:null
        })
       }
    }
    catch{
        res.status(500);
        return res.json({
            err:true,
            msg:"unable to verify request"
        })
    }
    });

    //accept new order
    SellerRouter.post('/order/accept', async (req:Request, res:Response) => {
        try{
            const Orders = await MongoObject.collections.Orders.find({$and:[
                {status:1},
                {seller:new ObjectId(res.locals.account._id)}
            ]}).toArray();
            if (Orders.length)
            {

            }
        }
        catch{

        }
    });



    return SellerRouter;
}





export default Router;
