import express, {Request, Response } from 'express';
import mongodb, { MongoClient } from 'mongodb';


const Router = (Accounts:mongodb.Collection<mongodb.BSON.Document>) => {
    const AuthorizationRouter = express.Router()

    AuthorizationRouter.get("/", (req:Request, res:Response) => {
            res.send("AuthorizationRouter");
    });

    return AuthorizationRouter;
}




export default Router;
