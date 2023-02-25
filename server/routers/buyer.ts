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
    const buyerRouter = express.Router();

    buyerRouter.use(isBuyer);



    // loggedin Account tring to get all sellers that are available in his range
    buyerRouter.get("/sellers", checkValidation, async (req: Request, res: Response) => {
        try {
            const projection = { authorizedUsers: 0 };
            const user = res.locals.account;
            let sellers = await MongoObject.collections.Sellers.find({}).project(projection).toArray();
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
    buyerRouter.post("/order/1", checkValidation, processPayment, async (req:Request, res:Response) => {
        try{
            if (<PaymentLog>res.locals.PaymentLog.accepted) // check if payment has been made
            {
                const user = res.locals.account;
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
        catch (e) {
            res.status(500);
            return res.json({
                err: true,
                msg: "server error",
                not: null // number of tries left
            });
        }
    });


    return buyerRouter;
}




export default Router;
