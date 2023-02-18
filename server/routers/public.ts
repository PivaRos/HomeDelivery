import express, {Request, Response } from 'express';


const Router = () => {
    const PublicRouter = express.Router()

    PublicRouter.get("/", (req:Request, res:Response) => {
            res.send("publicRouter");
    });

    return PublicRouter;
}




export default Router;
