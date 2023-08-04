import { useState } from "react";

export const useSelectedProductIndex = () => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  return selectedProductIndex;
};
