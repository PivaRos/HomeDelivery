import { useEffect, useState } from "react";
import { PriceString, getTotalUnits } from "../functions";
import { Product } from "./../interfaces";

export const useProductPrice = (Product: Product) => {
  const [productPrice, setProductPrice] = useState("");
  const [price, setPrice] = useState(Product.price.price);

  const calculatePriceString = () => {
    //price string
    setProductPrice(PriceString(price, Product.price.currency));
  };

  useEffect(() => {
    calculatePriceString();
  }, [price]);

  useEffect(() => {
    //calculates price
    let pricePerUnit = +Product.price.price;
    if (Product.options) {
      for (let i = 0; i < Product.options?.length; i++) {
        if (Product.options[i].additionalAllowed) {
          let option = Product.options[i];
          let maxPicks = +Product.options[i].maxPicks;
          let OptionTotalPicks = +getTotalUnits(
            option.selectedOptionProducts?.map((v) => {
              return v.units;
            }) || []
          );
          if (OptionTotalPicks - maxPicks > 0) {
            pricePerUnit +=
              (OptionTotalPicks - maxPicks) *
              option.additionalPricePerUnit.price;
          }
        }
      }
    }
    setPrice(+pricePerUnit * (Product.units || 1));
  }, [Product.units, JSON.stringify(Product)]);

  return { productPrice, price, setPrice };
};
