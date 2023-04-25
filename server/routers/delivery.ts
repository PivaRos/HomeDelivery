import express, { type Request, type Response } from 'express'
import type mongodb from 'mongodb'
import { checkValidation, isDelivery } from '../middleware'
import { type Account, type Order, type Store } from '../interfaces'
import { getDistance } from '../functions'

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
  const DeliveryRouter = express.Router() // all http requests that are made with delivery
  DeliveryRouter.use(isDelivery)

  // recives sessionid and returns all open orders that are waiting delivery and within the range
  DeliveryRouter.get('/waiting', checkValidation, async (req: Request, res: Response) => {
    try {
      const user = res.locals.account
      const returnOrders: Order[] = []
      const Orders = await MongoObject.collections.Orders.find({}).toArray()
      Orders.forEach(Order => {
        if (Order.status === 2) {
          const distance = getDistance(Order.location, user.location)
          if (distance < user.deliveryDistance) {
            returnOrders.push(Order as Order)
          }
        }
      })
      res.status(200)
      return res.json({
        err: false,
        msg: 'ok',
        data: returnOrders
      })
    } catch (e) {
      res.status(500)
      return res.json({
        err: true,
        msg: 'unable to verify user',
        not: null // number of tries left
      })
    }
  })

  return DeliveryRouter
}

export default Router
