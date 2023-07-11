import { type Request, type Response, type NextFunction } from 'express'
import { Accounts } from '.';
import HttpsRequest from 'request';

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  try{
  // make api call to privider of services

  const CreditCard_Number = res.locals.CreditCard_Number;
  const CreditCard_ExpirationMonth = res.locals.CreditCard_ExpirationMonth;
  const CreditCard_ExpirationYear = res.locals.CreditCard_ExpirationYear;
  const CreditCard_CVV = res.locals.CreditCard_CVV;
  const CreditCard_CitizenID = res.locals.CreditCard_CitizenID

  const UnitPrice = res.locals.UnitPrice;
  const ProviderUri = "https://api.sumit.co.il/billing/payments/charge/"
  const ProviderSecret = process.env.SumitProvierSecretKey;
  const CompanyID = process.env.CompanyID;
  const data = {
    Credentials:{
      APIKey:ProviderSecret,
      CompanyID:CompanyID
    },
    Customer:{
      Name:'לקוח כללי'
    },
    Items:{
      Quantity:1,
      UnitPrice:UnitPrice,
      Currency:"NIS",
    },
    PaymentMethod:{
      CreditCard_Number,
      CreditCard_ExpirationMonth,
      CreditCard_ExpirationYear,
      CreditCard_CVV,
      CreditCard_CitizenID,
      Type:'CreditCard'
    }
  };
  HttpsRequest({
    uri:ProviderUri,
    body:JSON.stringify(data),
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },

  })
  // get responce of 200
  res.locals.PaymentLog = {
    accepted: true,
    timestamp: new Date().getTime(),
    priceCharged: 0 // the price
  }
  // and then call next()
  next();
  }
  catch(e){
    console.log(e);
    res.locals.err = e;
    next();
  }
}

// checks authorization headers
export const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    // more checks should be done!!
    next();
  } else {
    res.status(500);
    return res.json({
      err: true,
      msg: 'unable to verify user',
      not: null // number of tries left
    });
  }
}

export const InputValidator = async (req: Request, res: Response, next: NextFunction) => {
  next();
}

export const isBuyer = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.account = await Accounts.findOne({ sessionid: req.headers.authorization })
  if (res.locals.account && res.locals.account.type === 1) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export const isSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.account = await Accounts.findOne({ sessionid: req.headers.authorization })
  if (((res.locals.account as { type: number } | null) != null) && res.locals.account.type === 2) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export const isDelivery = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.account = await Accounts.findOne({ sessionid: req.headers.authorization })
  if (res.locals.account && res.locals.account.type === 3) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.account = await Accounts.findOne({ sessionid: req.headers.authorization })
  if (res.locals.account && res.locals.account.type === 5) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export const isSupport = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.account = await Accounts.findOne({ sessionid: req.headers.authorization })
  if (res.locals.account && res.locals.account.type === 4) {
    next()
  } else {
    res.sendStatus(401)
  }
}
