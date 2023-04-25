import express, { NextFunction, type Request, type Response, request } from 'express'
import type mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import { checkValidation, processPayment, isSeller, isBuyer } from '../middleware'
import { type Account, LocationObject, type Order, PaymentLog, productOrder, type Store, store_category } from '../interfaces'
import { getDistance, isOpen, timeToSecondsFromStartOfDay } from '../functions'

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
  const PublicbuyerRouter = express.Router()

  PublicbuyerRouter.post('/get/stores', async (req: Request, res: Response) => {
    const buyerLocation = req.body.location
    try {
      const projection = { authorizedUsers: 0 }
      const sellers = await MongoObject.collections.Stores.find({ category: req.body.store_category }).project(projection).toArray()
      const OpenReturnSellers: Store[] = []
      const ClosedReturnSellers: Store[] = []
      sellers.forEach(seller => { // checks foreach seller the distance
        const distance = getDistance(seller.location, buyerLocation)
        if (distance < seller.deliveryDistance) {
          // check open hours
          if (isOpen(seller.openHoursObject, seller.openHoursObject.hasCloseNextDay)) {
            OpenReturnSellers.push(seller as Store)
          } else {
            ClosedReturnSellers.push(seller as Store)
          }
        }
      })
      res.status(200)
      return res.json({
        err: false,
        msg: 'ok',
        data: {
          Open: OpenReturnSellers,
          Closed: ClosedReturnSellers
        }
      })
    } catch (e) {
      res.status(500)
      return res.json({
        err: true,
        msg: 'something went wrong',
        not: null // number of tries left
      })
    }
  })

  PublicbuyerRouter.post('/get/products', async (req: Request, res: Response) => {
    if (req.body.store_id) {
      const products = await MongoObject.collections.Stores.findOne({ _id: new ObjectId(req.body.store_id) }, { projection: { products: 1 } })
      return res.json({
        err: false,
        msg: 'ok',
        data: products?.products
      })
    }
  })

  return PublicbuyerRouter
}

export default Router
