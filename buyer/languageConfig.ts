let addProductToOrderText = "";
let ViewOrderButtonText = "";
let StartDeliveryButtonText = "";
let BackButtonText = "";
let updateOrderText = "";
let removeAllText = "";
let removeText = "";
let addressText = "";
let paymentText = "";
let billingText = "";
let ServiceFeeText = "";
let SubTotalText = "";
let DeliveryFeeText = "";
let totalText = "";
let myOrderText = "";

export enum languageEnum {
  ENGLISH = "en",
  HEBREW = "he",
}

export enum directionEnum {
  RTL = "rtl",
  LTR = "ltr",
}

let language = "";
let textDirection = "";

language = languageEnum.HEBREW; // ! change this in order to switch language

switch (language) {
  case languageEnum.HEBREW:
    textDirection = directionEnum.RTL;
    myOrderText = "ההזמנה שלי";
    totalText = "סה''כ";
    DeliveryFeeText = "משלוח";
    SubTotalText = "סכום ביניים";
    ServiceFeeText = "עמלת שירות";
    billingText = "חיוב";
    paymentText = "תשלום";
    addProductToOrderText = "הוסף להזמנה";
    ViewOrderButtonText = "צפה בהזמנה";
    StartDeliveryButtonText = "התחל משלוח";
    BackButtonText = "חזרה";
    updateOrderText = "עדכן הזמנה";
    removeAllText = "הסר הכל";
    removeText = "הסר";
    addressText = "כתובת";
    break;

  case languageEnum.ENGLISH:
    totalText = "Total";
    textDirection = directionEnum.LTR;
    myOrderText = "My order";
    DeliveryFeeText = "Delivery fee";
    SubTotalText = "Sub total";
    ServiceFeeText = "Service Fee";
    billingText = "Billing";
    paymentText = "Payment";
    addProductToOrderText = "Add to Order";
    ViewOrderButtonText = "View order";
    StartDeliveryButtonText = "Start delivery";
    BackButtonText = "Back";
    updateOrderText = "Update Order";
    removeAllText = "Remove all";
    removeText = "Remove";
    addressText = "Address";
    break;
}

export {
  addProductToOrderText,
  BackButtonText,
  StartDeliveryButtonText,
  ViewOrderButtonText,
  updateOrderText,
  removeAllText,
  removeText,
  addressText,
  language,
  textDirection,
  paymentText,
  billingText,
  ServiceFeeText,
  SubTotalText,
  DeliveryFeeText,
  totalText,
  myOrderText,
};
