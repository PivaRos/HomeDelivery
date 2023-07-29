import { useEffect, useState } from "react";
import { DeliveryFee } from "../functions";
import { Order } from "../interfaces";

export const useDeliveryFeeAmount = (savedOrder: Order) => {
  const [deliveryFeeAmount, setDeliveryFeeAmount] = useState<number>(
    DeliveryFee(savedOrder.distance)
  );

  useEffect(() => {
    setDeliveryFeeAmount(DeliveryFee(savedOrder.distance));
  }, [savedOrder.distance]);

  return deliveryFeeAmount;
};
