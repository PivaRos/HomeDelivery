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
let addressesGridText = "";
let noSavedAddressesText = "";
let addAddressText = "";
let emailText = "";
let passwordText = "";

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
    passwordText = "סיסמה";
    emailText = "אימייל";
    addressesGridText = "הכתובות שלי";
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
    noSavedAddressesText = "אין כתובות שמורות";
    addAddressText = "הוסף כתובת";
    break;

  case languageEnum.ENGLISH:
    totalText = "Total";
    textDirection = directionEnum.LTR;
    addressesGridText = "My Addresses";
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
    noSavedAddressesText = "No Saved Addresses";
    addAddressText = "Add Address";
    emailText = "email";
    passwordText = "password";
    break;
}

export {
  passwordText,
  emailText,
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
  addressesGridText,
  noSavedAddressesText,
  addAddressText,
};
