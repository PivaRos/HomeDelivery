import { useEffect, useState } from "react";
import { PriceString } from "../functions";

export const useProductPrice = (price: number, currency: string) => {
  const [productPrice, setProductPrice] = useState("");

  const calculatePriceString = () => {
    //price string
    setProductPrice(PriceString(price, currency));
  };

  useEffect(() => {
    calculatePriceString();
  }, [price]);

  return productPrice;
};
