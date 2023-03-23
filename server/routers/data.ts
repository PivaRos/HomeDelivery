import express, { NextFunction, Request, Response } from 'express';
import mongodb, {GridFSBucket} from 'mongodb';
import { ObjectId } from 'bson';
import dotenv from "dotenv";
import { Account, Order, Store } from '../interfaces';
import multer from 'multer'
import GridFsStorage from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';

const Router = (MongoObject: {
    client:mongodb.MongoClient,
    databases: {
        data: mongodb.Db;
        log: mongodb.Db;
        uploads: mongodb.Db;
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
    const DataRouter = express.Router();
    dotenv.config();



    const conn = mongoose.createConnection(process.env.data || "", {

    });

    //init gfs
    let gfs:Grid.Grid, gridfsBucket: mongodb.GridFSBucket;
    gridfsBucket = new GridFSBucket(MongoObject.databases.uploads, {
      bucketName: 'uploads'
    });

    gfs = Grid(MongoObject.databases.uploads, MongoObject.client);
    gfs.collection('uploads');
    console.log("connected");
  


    const storage = new GridFsStorage({
        url: process.env.data,
        file: (req:Request, file:Express.Multer.File) => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf:Buffer) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
              };
              resolve(fileInfo);
            });
          });
        },
        db:conn.db
      });

      const upload =  multer({ storage });

    //upload image/s
      DataRouter.post('/upload', upload.single("thename"), async (req:Request, res:Response) => {
       res.status(200);
       return res.json({
        filename:req.file?.filename
       })
      });

    //delete image/s
      DataRouter.delete('/file/:filename', async (req:Request, res:Response) => {
        try{
        const filesCollection = await MongoObject.databases.uploads.collection("uploads.files");
        const file = await filesCollection.findOne({filename:req.params.filename});
        if (file){
            await gridfsBucket.delete(file._id);
        }
        res.sendStatus(200);
        }catch(e){
            console.log(e);
            res.sendStatus(500);
        }
    });


    //get iamge/s
      DataRouter.get('/file/:filename', async (req:Request, res:Response) => {
        try{
        const file = await gfs.files.findOne({filename:req.params.filename});
        if (!file || file.length === 0) {
            return res.status(404).json({
              err: 'No file exists'
            });
        }
        const readStream = gridfsBucket.openDownloadStream(new ObjectId(file._id));
        return readStream.pipe(res);
        }catch(e){
            console.log(e);
           return res.send(e);
        }

    });






    return DataRouter;
}





export default Router;
