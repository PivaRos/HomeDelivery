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
    const buyerRouter = express.Router();
    buyerRouter.use([checkValidation, isBuyer]);



    // loggedin Account tring to get all sellers that are available in his range
    buyerRouter.get("/sellers", async (req: Request, res: Response) => {
        try {
            const projection = { authorizedUsers: 0 };
            const user = res.locals.account;
            let sellers = await MongoObject.collections.Stores.find({}).project(projection).toArray();
                let returnSellers:Store[] = [];
                sellers.forEach(seller => {  //checks foreach seller the distance
                    const distance = getDistance(seller.location, user.location);
                    if (distance < seller.deliveryDistance)
                    {
                        returnSellers.push(<Store>seller);
                    }
                });
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
    });

    async function createOrder(req:Request, res:Response) {
        try {
            
        if (!res.locals.PaymentLog.accepted) throw new Error();
        const user = res.locals.account;
        //check if user can order
        const store: Store = <Store> await MongoObject.collections.Stores.findOne({_id:new ObjectId(req.body.store)});
        if (!store) throw new Error("no store found");
        const distance = getDistance(store.location, user.location);
        if (distance > store.deliveryDistance) throw new Error("out of service distance");
        //make order
        const Order: Order = {
            seller: new ObjectId(req.body.store),
            buyer: new ObjectId(user._id),
            products:req.body.products.map((product:productOrder) => {
                return {
                    productId:new ObjectId(product.productId),
                    details:{}
                }
            }),
            date:{
                date:new Date(),
                timestamp:new Date().getTime()
            },
            location:user.location,
            totalPrice:res.locals.totalPrice,
            status:1,
            city:req.body.city,
            street:req.body.address,
            zipcode:req.body.zipcode,
            homenumber:user.phonenumber
            }
            const result = await MongoObject.collections.Orders.insertOne(Order);
            return res.json({
                err:false,
                msg:"ok",
                data:{
                    order:result.insertedId
                }
            });
            
        }
        catch(e){
            res.status(500);
            console.log(e);
            return res.json({
                err: true,
                msg: "server error",
                not: null // number of tries left
            });
        }
}

    //first stage when buyer sends order to seller
    buyerRouter.post("/order", processPayment, createOrder);


    return buyerRouter;
}




export default Router;
