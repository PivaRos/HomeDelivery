import { useEffect, useState } from "react";
import { Store, availableStores, store_category } from "../interfaces";
import { useSelector } from "react-redux";
import { storeActions } from "../network_services/stores";
import Location from "expo-location";

export const useStores = (
  deliveryLocation: Location.LocationObject,
  category: store_category
) => {
  const refreshing = useSelector((state: any) => state.refreshing);
  const [Stores, setStores] = useState<availableStores>();
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const Stores = await storeActions.GetStores(deliveryLocation, category);
    if (Stores) {
      setStores(Stores);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [deliveryLocation]);

  useEffect(() => {
    if (refreshing) {
      setStores(undefined);
      load();
    }
  }, [refreshing]);

  return { Stores, loading };
};
