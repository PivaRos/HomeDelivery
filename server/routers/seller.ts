import express, { type Request, type Response } from 'express'
import type mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import { isSeller } from '../middleware'
import { type Account, type Order, type Store, OrderStatus, StorePermissions, IStorePermissions, changeStoreBody } from '../interfaces'

const Router = (MongoObject: {
  databases: {
    data: mongodb.Db
    log: mongodb.Db
  }
  collections: {
    Stores: mongodb.Collection<Store>
    Orders: mongodb.Collection<Order>
    Accounts: mongodb.Collection<Account>
    Applications: mongodb.Collection<mongodb.BSON.Document>
    Transactions: mongodb.Collection<mongodb.BSON.Document>
    ClosedApplications: mongodb.Collection<mongodb.BSON.Document>
  }
}) => {
  const SellerRouter = express.Router()
  SellerRouter.use(isSeller)


  

  SellerRouter.put('/store', async (req:Request, res:Response) => {
    try{
      const Keys = Object.keys(StorePermissions);
      const body = req.body as changeStoreBody;

      const Stores:Store[] = await MongoObject.collections.Stores.find(
        {
          authorizedUsers:{$all:[res.locals.account._id.toString()]}
        }).toArray();

        let Store:Store| undefined;
        Stores.map((store) => {
          if (store._id.toString() === body.store_id)
          {
            Store = store;
          }
        })
        if (!Store) throw new Error("no store found")
        await body.fieldsToChange.map(async (field, index) => {
        if (!Keys.includes(field)){
          // allow requester to know that this is not changable field
          return
        }
        if (!StorePermissions[field as keyof IStorePermissions].includes(2)) return
        if (field === "products")
        {
            //need to go over set Product
            // need to go over add Product
        }
        else{

          interface Iobj {
            [key: string]: any;
          }

          let obj:Iobj = {} 
          obj[field] = body.newValues[index];

          await MongoObject.collections.Stores.updateOne(
          {_id:new ObjectId(Store?._id)},
          {
            $set:obj
          }
          )
      }})
      return res.json({
        err:false,
        msg:"ok"
      })
      
    }catch(e:any){
      console.log(e.message);
       res.status(500)
       const json  = {
        err:true,
        msg:"unable to complete action"
       }
       res.json(json);
    }
     
  })

  SellerRouter.get('/account', async (req:Request, res:Response) => {
    return res.json(res.locals.account);
  })

  SellerRouter.get('/stores', async (req:Request, res:Response) => {
      try{
        const Stores:Store[] = await MongoObject.collections.Stores.find({authorizedUsers:{$all:[res.locals.account._id.toString()]}}).toArray();
        return res.json({Stores});
      }catch(e){
        console.log(e);
        return res.sendStatus(500);
      }
    })

  // get all orders no metter what status
  SellerRouter.get('/orders', async (req: Request, res: Response): Promise<void> => {
    try {
      const orders: Order[] = await MongoObject.collections.Orders.find({
        $and: [
          { seller: new ObjectId(res.locals.account._id) },
          { status: { $ne: 0 } }

        ]
      }).toArray()
      if (orders.length > 0) {
        res.json({
          err: false,
          msg: 'ok',
          data: orders
        })
      } else {
        res.json({
          err: false,
          msg: 'not found',
          data: null
        })
      }
    } catch {
      res.status(500)
      res.json({
        err: true,
        msg: 'unable to verify request'
      })
    }
  })

  // accept new order *
  SellerRouter.post('/order/accept', async (req: Request, res: Response) => {
    try {
      const order_id: string = req.body.Orderid
      const store: Store = await MongoObject.collections.Stores.findOne({ authorizedUsers: { $elemMatch: res.locals.account._id } }) as Store
      const order = await MongoObject.collections.Orders.findOne({
        $and: [
          { _id: new ObjectId(order_id) },
          { store_id: store._id }
        ]
      }) as Order
      if (order === null) throw new Error('null order')
      if (order.status !== OrderStatus.pending) throw new Error('status not pending')
      await MongoObject.collections.Orders.updateOne({ _id: new ObjectId(order_id) }, { $set: { status: OrderStatus.accepted } })
      return res.sendStatus(200)
    } catch {
      res.sendStatus(500)
    }
  })

  return SellerRouter
}

export default Router
