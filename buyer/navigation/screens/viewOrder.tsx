import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Order, RootStackParamList } from "../../interfaces";
import ProductSumTab from "../../components/product/productSumTab";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BackButtonText,
  StartDeliveryButtonText,
  myOrderText,
} from "../../languageConfig";
import { HideAddressHandlerAction } from "../../redux/actions/HideAddressHandlerActions";

interface props {}

export const ViewOrder = (props: props) => {
  const Dispatch = useDispatch();

  const savedOrder = useSelector((state: any) => state.savedOrder) as Order;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const BackPress = () => {
    navigation.navigate("ViewStore", { id: 2 });
  };
  useEffect(() => {
    Dispatch(HideAddressHandlerAction());
  }, []);

  return (
    <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: 50,
          justifyContent: "center",
        }}
      >
        <Pressable style={styles.backButton} onPress={BackPress}>
          <Text style={styles.backButtonText}>{BackButtonText}</Text>
        </Pressable>
        <Text
          style={{
            textAlign: "center",
            width: "100%",
            position: "absolute",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {myOrderText}
        </Text>
      </View>
      <ScrollView>
        {savedOrder.selecedProdcuts.map((Product, index) => {
          return <ProductSumTab Product={Product} key={index} />;
        })}
      </ScrollView>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("ViewCheckout", { id: 5 })}
          style={{
            justifyContent: "center",
            width: "85%",
            backgroundColor: "lightgreen",
            height: 50,
            bottom: 0,
            borderRadius: 10,
            margin: Platform.OS === "android" ? 10 : 0,
          }}
        >
          <Text
            style={{
              padding: 10,
              justifyContent: "center",
              textAlign: "center",
              fontSize: 20,
            }}
          >
            {StartDeliveryButtonText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ViewOrderButton: {
    flexDirection: "row",
    height: 50,
    width: "90%",
    padding: 10,
    backgroundColor: "lightgreen",
    textAlign: "center",
    bottom: 8,
    borderRadius: 10,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  backButton: {
    zIndex: 3,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "lightgreen",
    height: 40,
    width: 55,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  detailsView: {
    display: "flex",
  },
  detailsText: {
    marginTop: 6,
    marginRight: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "black",
  },
  Conteintor: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  StoreName: {
    fontSize: 18,
  },
  ProductsView: {
    height: "auto",
    width: "100%",
    backgroundColor: "red",
  },
  storeInfo: {
    width: "100%",
    padding: 10,
    marginTop: 200,
  },
  imageStyle: {
    position: "absolute",
    top: 0,
    height: 200,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: "100%",
  },
  imageText: {
    padding: 5,
    backgroundColor: "lightgreen",
    borderRadius: 10,
    marginRight: 15,
  },
});
