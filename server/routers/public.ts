import { Console } from 'console';
import express, { NextFunction, Request, Response } from 'express';
import mongodb, { Double, ObjectId, Timestamp } from 'mongodb';
import { Account, Order, Seller } from '../interfaces';

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
    const PublicRouter = express.Router();

    // checks authorization headers
    const checkHeaders = (req:Request, res:Response, next:NextFunction) => {
        if (req.headers.authorization)
        {
            // more checks should be done!!
            next();
        }
        else
        {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    }

    // loggedin Account tring to get all sellers that are available in his range
    PublicRouter.get("/sellers", checkHeaders, async (req: Request, res: Response) => {
        try {
            const projection = { authorizedUsers: 0 };
            const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            let sellers   = await MongoObject.collections.Sellers.find({}).project(projection).toArray();
            if (user && user.type === 1) // check that user with this session was found and that the account is only buyer
            {
                let returnSellers:Seller[] = [];
                sellers.forEach(seller => {  //checks foreach seller the distance
                    const dy = seller.location.coordinates[0] - (+user.location.coordinates[0]);
                    const dx = (seller.location.coordinates[1] - (+user.location.coordinates[1]));
                    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                    if (distance < seller.deliveryDistance)
                    {
                        returnSellers.push(<Seller>seller);
                    }
                });
                res.status(200);
                return res.json({
                    err:false,
                    msg:"ok",
                    data:returnSellers
                });
            }
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }

    });

    //recives sessionid and returns all open orders that are waiting delivery and within the range
    PublicRouter.get("/delivery", checkHeaders, async (req:Request, res:Response) => {
        try{
            const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            if (user && user.type === 2) // only delivery accounts
            {
                let returnOrders:Order[] = [];
                const Orders = await MongoObject.collections.Orders.find({});
                Orders.forEach(Order => {
                    if (Order.status === 2)
                    {
                        const dy = (+Order.location.coordinates[0]) - (+user.location.coordinates[0]);
                        const dx = (+Order.location.coordinates[1]) - (+user.location.coordinates[1]);
                        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                        if (user.deliveryDistance && (distance < user.deliveryDistance))
                        {
                            returnOrders.push(<Order>Order);
                        }
                    }
                });
                res.status(200);
                return res.json({
                    err:false,
                    msg:"ok",
                    data:returnOrders
                });
            }
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }
    }); 

    //first stage when buyer sends order to seller
    PublicRouter.post("/order/1", checkHeaders, async (req:Request, res:Response) => {
        const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
        if (user && user.type === 1) //only buyer account found
        {
            var Order: Order = {
                seller:new ObjectId(req.body.seller),
                buyer:user._id,
                products:[

                ],
                date:{
                    date:new Date(),
                    timestamp:new Date().getTime()
                },
                location:{
                    type:"point",
                    coordinates:[32.34234,32.3421]
                },
                totalPrice:23, //set by products
                status:1,
                city:"",
                street:"",
                homeNumber:""
            }
            MongoObject.collections.Orders.insertOne(Order);
        }
    });

    return PublicRouter;
}




export default Router;
