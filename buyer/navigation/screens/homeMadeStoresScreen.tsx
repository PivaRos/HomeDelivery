import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import {
  availableStores,
  Order,
  Pages,
  Store,
  store_category,
} from "../../interfaces";
import StoresGrid from "../../components/store/stores_grid";
import { useEffect, useState } from "react";
import { storeActions } from "../../network_services/stores";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { HomeMadeStoresAction } from "../../redux/actions/HomeMadeStoresAction";

interface Props {}
const HomeMadeStores = (props: Props) => {
  const Dispatch = useDispatch();

  const refreshing = useSelector((state: any) => state.refreshing);
  const homeMadeStores = useSelector((state: any) => state.homeMadeStores);
  const deliveryLocation = useSelector((state: any) => state.deliveryLocation);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const Stores = await storeActions.GetStores(
      deliveryLocation,
      store_category.homeMade
    );
    Dispatch(HomeMadeStoresAction(Stores));
  };

  useEffect(() => {
    load();
    if (homeMadeStores) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshing) {
      setLoading(true);
      Dispatch(HomeMadeStoresAction(null));
      load();
    } else {
      setLoading(false);
    }
  }, [refreshing]);

  const getContent = () => {
    return (
      <View style={style.view}>
        <Text style={style.title}>Creativity Place .</Text>
        <ScrollView>
          <StoresGrid
            title="New On HomeDelivery"
            displayStores={homeMadeStores?.Open}
          />
          <StoresGrid
            title="Closed Stores"
            displayStores={homeMadeStores?.Closed}
          />
        </ScrollView>
      </View>
    );
  };

  return getContent();
};

const style = StyleSheet.create({
  view: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    fontFamily: "AmericanTypewriter",
    fontWeight: "bold",
  },
});

export default HomeMadeStores;
