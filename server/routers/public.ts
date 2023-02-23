import { Console } from 'console';
import express, { NextFunction, Request, Response } from 'express';
import mongodb, { Double, ObjectId, Timestamp } from 'mongodb';
import { Account, LocationObject, Order, PaymentLog, productOrder, Seller } from '../interfaces';

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
    const checkValidation = (req:Request, res:Response, next:NextFunction) => {
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
    PublicRouter.get("/sellers", checkValidation, async (req: Request, res: Response) => {
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
    PublicRouter.get("/delivery", checkValidation, async (req:Request, res:Response) => {
        try{
            const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            if (user && user.type === 2) // only delivery accounts
            {
                let returnOrders:Order[] = [];
                const Orders = await MongoObject.collections.Orders.find({}).toArray();
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

    const processPayment = async (req:Request, res:Response, next:NextFunction) => {
        const cardNumber  = req.body.cardNumber;
        const cardExpireDate = req.body.cardExpireDate;
        const cardCVV = req.body.cardCVV;

        // make api call to privider of services
        //get responce of 200
        //and then call next()
        next();
    }

    //first stage when buyer sends order to seller
    PublicRouter.post("/order/1", checkValidation, processPayment, async (req:Request, res:Response) => {
        try{
            if (<PaymentLog>res.locals.PaymentLog.accepted) // check if payment has been made
            {
            const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.headers.authorization });
            if (user && user.type === 1) //only buyer account found
            {
                //check if user can order
                const Seller:Seller = <Seller> await MongoObject.collections.Sellers.findOne({_id:new ObjectId(req.body.seller)});
                const distance = getDistance(Seller.location, user.location);
                if (distance < Seller.deliveryDistance) // user can order
                {
                    //make order
                    var theDate = new Date();
                    var Order: Order = {
                    seller:new ObjectId(req.body.seller),
                    buyer:user._id,
                    products:req.body.products.map((product:productOrder) => {
                        return {
                            productId:new ObjectId(product.productId),
                            details:{}
                        }
                    }),
                    date:{
                        date:theDate,
                        timestamp:theDate.getTime()
                    },
                    location:user.location,
                    totalPrice:res.locals.totalPrice,
                    status:1,
                    city:req.body.city,
                    street:req.body.address,
                    homeNumber:user.phoneNumber
                    }
                    MongoObject.collections.Orders.insertOne(Order);

                }
                throw new Error("out of service distance");
                

                }   
            }
        }
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "server error",
                not: null // number of tries left
            });
        }
    });

    //returns distance (km)
   const getDistance = (Location1:LocationObject, Location2:LocationObject ) => {
    const dy = (+Location1.coordinates[0]) - (+Location2.coordinates[0]);
    const dx = (+Location1.coordinates[1]) - (+Location2.coordinates[1]);
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
    return distance;
   }


    return PublicRouter;
}




export default Router;
