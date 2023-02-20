import { Console } from 'console';
import express, { Request, Response } from 'express';
import mongodb from 'mongodb';
import { Sellers } from './interfaces'

const Router = (MongoObject: {
    databases: {
        data: mongodb.Db;
        log: mongodb.Db;
    },
    collections: {
        Sellers: mongodb.Collection<mongodb.BSON.Document>;
        Orders: mongodb.Collection<mongodb.BSON.Document>;
        Accounts: mongodb.Collection<mongodb.BSON.Document>;
        Applications: mongodb.Collection<mongodb.BSON.Document>;
        Transactions: mongodb.Collection<mongodb.BSON.Document>;
        ClosedApplications: mongodb.Collection<mongodb.BSON.Document>;
    }
}) => {
    const PublicRouter = express.Router();

    // loggedin user tring to get all sellers that are available in his range
    PublicRouter.post("/sellers", async (req: Request, res: Response) => {
        try {
            var returnSellers: Sellers[] = [];
            const projection = { authorizedUsers: 0 };
            console.log(req.body.sessionid);
            const user = await MongoObject.collections.Accounts.findOne({ sessionid: req.body.sessionid });
            const sellers: Sellers = await MongoObject.collections.Sellers.find({}).project(projection).toArray();
            if (user) {
                sellers.forEach(seller => {
                    var dy = seller.location.coordinates[0] - user.location.coordinates[0];
                    var dx = seller.location.coordinates[1] - user.location.coordinates[1];

                    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * 110.574;
                    console.log(Math.round(distance * 1000) + "m");
                    if (distance < seller.deliveryDistance) {
                        returnSellers.push(seller);
                    }
                });
                return res.json({ returnSellers })
            }
        }
        catch (e) {
            console.log(e);
            return res.json({
                err: true,
                msg: "unable to verify user",
                not: null // number of tries left
            });
        }

    });

    return PublicRouter;
}




export default Router;
