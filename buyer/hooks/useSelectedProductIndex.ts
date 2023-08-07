import { useEffect, useState } from "react";
import { Order, Product } from "../interfaces";

export const useSelectedProductIndex = (
  savedOrder: Order,
  selectedProduct: Product
) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

  const load = () => {
    //if the Product is in selectedProducts list then we update the selectedProductIndex
    let found = false;
    let tempindex = -1;
    savedOrder.selecedProdcuts.map((p, index) => {
      let pClone = { ...p } as Product;
      let currentProductClone = { ...selectedProduct } as Product;
      if (JSON.stringify(pClone) === JSON.stringify(currentProductClone)) {
        tempindex = index;
        found = true;
      }
    });
    if (found) {
      setSelectedProductIndex(tempindex);
    }
  };

  useEffect(() => {
    load();
  }, [selectedProduct, savedOrder.selecedProdcuts]);

  return selectedProductIndex;
};
