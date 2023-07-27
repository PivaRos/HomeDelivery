let addProductToOrderText = "";
let ViewOrderButtonText = "";
let StartDeliveryButtonText = "";
let BackButtonText = "";
let updateOrderText = "";
let removeAllText = "";
let removeText = "";

enum languageEnum {
  ENGLISH = "en",
  HEBREW = "he",
}

let language;

language = languageEnum.HEBREW; // ! change this in order to switch language

if (language === languageEnum.ENGLISH) {
  addProductToOrderText = "Add to Order";
  ViewOrderButtonText = "View order";
  StartDeliveryButtonText = "Start delivery";
  BackButtonText = "Back";
  updateOrderText = "Update Order";
  removeAllText = "Remove all";
  removeText = "Remove";
} else if (language === languageEnum.HEBREW) {
  addProductToOrderText = "הוסף להזמנה";
  ViewOrderButtonText = "צפה בהזמנה";
  StartDeliveryButtonText = "התחל משלוח";
  BackButtonText = "חזרה";
  updateOrderText = "עדכן הזמנה";
  removeAllText = "הסר הכל";
  removeText = "הסר";
}

export {
  addProductToOrderText,
  BackButtonText,
  StartDeliveryButtonText,
  ViewOrderButtonText,
  updateOrderText,
  removeAllText,
  removeText,
};
