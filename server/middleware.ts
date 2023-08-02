import { type Request, type Response, type NextFunction } from 'express'
import { Accounts } from '.';
import HttpsRequest from 'request';

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  try{
  // make api call to privider of services

  const CreditCard_Number = res.locals.CreditCard_Number; // string
  const CreditCard_ExpirationMonth = res.locals.CreditCard_ExpirationMonth; //int
  const CreditCard_ExpirationYear = res.locals.CreditCard_ExpirationYear; // int
  const CreditCard_CVV = res.locals.CreditCard_CVV; // string 
  const CreditCard_CitizenID = res.locals.CreditCard_CitizenID // string

  const UnitPrice = res.locals.UnitPrice;
  const ProviderUri = "https://api.sumit.co.il/billing/payments/charge/"
  const ProviderSecret = process.env.SumitProvierSecretKey;
  const CompanyID = process.env.CompanyID;
    const data = {
      "Customer": {
        "ExternalIdentifier": null,
        "NoVAT": null,
        "SearchMode": 0,
        "Name": "general",
        "Phone": null,
        "EmailAddress": null,
        "City": null,
        "Address": null,
        "ZipCode": null,
        "CompanyNumber": null,
        "ID": null,
        "Folder": null
      },
      "PaymentMethod": {
        "ID": null,
        "CustomerID": null,
        "CreditCard_Number": CreditCard_Number,
        "CreditCard_LastDigits": null,
        "CreditCard_ExpirationMonth": CreditCard_ExpirationMonth,
        "CreditCard_ExpirationYear": CreditCard_ExpirationYear,
        "CreditCard_CVV": CreditCard_CVV,
        "CreditCard_Track2": null,
        "CreditCard_CitizenID": CreditCard_CitizenID,
        "CreditCard_CardMask": null,
        "CreditCard_Token": null,
        "DirectDebit_Bank": null,
        "DirectDebit_Branch": null,
        "DirectDebit_Account": null,
        "DirectDebit_ExpirationDate": null,
        "DirectDebit_MaximumAmount": null,
        "Type": 1
      },
      "SingleUseToken": null,
      "CreditCardAuthNumber": null,
      "Items": [
        {
          "Item": {
            "ID": null,
            "Name": "My Product",
            "Description": null,
            "Price": null,
            "Currency": null,
            "Cost": null,
            "ExternalIdentifier": null,
            "SKU": null,
            "SearchMode": null
          },
          "Quantity": 1,
          "UnitPrice": UnitPrice,
          "Total": UnitPrice,
          "Currency": null,
          "Description": null
        }
      ],
      "Payments_Credit": null,
      "Payments_Count": null,
      "Payments_FirstAmount": null,
      "Payments_NonFirstAmount": null,
      "UpdateCustomerByEmail": null,
      "UpdateCustomerByEmail_AttachDocument": null,
      "UpdateCustomerByEmail_Language": null,
      "SendDocumentByEmail": true,
      "SendDocumentByEmail_Language": null,
      "DocumentLanguage": null,
      "DocumentDescription": null,
      "VATIncluded": true,
      "VATRate": null,
      "AuthoriseOnly": null,
      "DraftDocument": null,
      "DocumentType": null,
      "SupportCredit": null,
      "MerchantNumber": null,
      "SendCopyToOrganization": null,
      "CardTokenNotNeeded": null,
      "AutoCapture": null,
      "AuthorizeAmount": null,
      "PreventStandingOrder": null,
      "Credentials": {
        "CompanyID": 196125877,
        "APIKey": "Ej5UA8CTYHWbTWZDLv2yPcgueVxWQJ6ymTQwkzGNMruFHNofEB"
      },
      "ResponseLanguage": null
    }
  HttpsRequest({
    uri:ProviderUri,
    body:JSON.stringify(data),
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },

  }, (Response:Response) => {
    console.log(Response)
    res.locals.Response = Response;
    next();
  })
  // get responce of 200
  res.locals.PaymentLog = {
    accepted: true,
    timestamp: new Date().getTime(),
    priceCharged: 0 // the price
  }
  // and then call next()
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
