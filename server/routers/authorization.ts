import express, { type Request, type Response } from 'express'
import type mongodb from 'mongodb'
import { type Account, type Order, type Store } from '../interfaces'
import { check, validationResult } from 'express-validator'
import { v4 as uuid } from 'uuid';

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
  const AuthorizationRouter = express.Router()

  AuthorizationRouter.post('/account', check('username').exists().isLength({ min: 4 }), check('password').exists().isLength({ min: 7 }), async (req: Request, res: Response) => {
    try {
      validationResult(req).throw()
      const user = await MongoObject.collections.Accounts.findOne({
        $and: [
          { username: req.body.username },
          { password: req.body.password }
        ]
      })
      const sessionid = uuid();
      if (user != null) {
        const updatevar = await MongoObject.collections.Accounts.updateOne({ _id: user._id }, { $set: { sessionid } })
        if (updatevar.acknowledged) {
          res.status(200)
          return res.json({
            err: false,
            accountType: user.type,
            sessionid
          })
        }
        throw new Error('unable to update sessionid')
      } else {
        res.status(500)
        return res.json({
          err: true,
          msg: 'no user found',
          not: null // number of tries left
        })
      }
    } catch (exeption) {
      res.status(500)
      return res.json({
        err: true,
        msg: 'unable to verify user',
        not: null // number of tries left
      })
    }
  })

  return AuthorizationRouter
}

export default Router
