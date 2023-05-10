import express, { type Request, type Response } from 'express'
import type mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import { isSeller } from '../middleware'
import { type Account, type Order, type Store, OrderStatus, StoreChangeAble } from '../interfaces'

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



  SellerRouter.get('/account', async (req:Request, res:Response) => {
    return res.json(res.locals.account);
  })

  SellerRouter.get('/stores', async (req:Request, res:Response) => {
      try{
      const Stores:Store[] = await MongoObject.collections.Stores.find({authorizedUsers:{$all:[res.locals.account._id.toString()]}}).toArray();
      return res.json({Stores});
      }catch{
        return res.sendStatus(500);
      }
    })


    // not done ..
  SellerRouter.put("/store", async (req:Request, res:Response) => {
    res.locals.ChangeFields = [];
   const availableToChange = Object.keys(StoreChangeAble);

    const NewValues = req.body.newvalues;
    const Store_id = req.body.store_id;
    const Stores:Store[] = await MongoObject.collections.Stores.find({authorizedUsers:{$all:[res.locals.account._id.toString()]}}).toArray();

    Stores.map(store => {
      if (store._id.toString() === Store_id)
      {
        res.locals.store = store;
      }
    })

  })

  // get all orders no metter what status
  SellerRouter.get('/orders', async (req: Request, res: Response): Promise<void> => {
    try {
      const orders: number = await MongoObject.collections.Orders.countDocuments({
        $and: [
          { seller: new ObjectId(res.locals.account._id) },
          { status: { $ne: 0 } }

        ]
      })
      if (orders > 0) {
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
      const Stores:Store[] = await MongoObject.collections.Stores.find({authorizedUsers:{$all:[res.locals.account._id.toString()]}}).toArray();
      Stores.map((v) =>{
        if (v._id.toString() === req.body.order_id)
        {
          res.locals.store = v;
        }
      })
       const order = await MongoObject.collections.Orders.findOne({
        $and: [
          { _id: new ObjectId(order_id) },
          { store_id:  res.locals.store._id }
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
