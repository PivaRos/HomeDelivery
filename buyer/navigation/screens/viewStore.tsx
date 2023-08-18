import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  LocationObject,
  Order,
  Product,
  RootStackParamList,
  Store,
} from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  DeliveryFee,
  PriceString,
  getDistance,
  getPricePerUnit,
  toDateTime,
} from "../../functions";
import ProductsGrid from "../../components/product/products_grid";
import getSymbolFromCurrency from "currency-symbol-map";
import { SvgXml } from "react-native-svg";
import ShakeText from "../../components/ShakeText";
import * as Location from "expo-location";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { SavedOrderAction } from "../../redux/actions/SavedOrderAction";
import { BackButtonText, ViewOrderButtonText } from "../../languageConfig";
import {
  HideAddressHandlerAction,
  ShowAddressHandler,
} from "../../redux/actions/HideAddressHandlerActions";
import { useCloseOpen } from "../../hooks/useCloseOpen";

interface Props {
  Store: Store;
  Address: Location.LocationGeocodedAddress | undefined;
}

enum Extarpolate {
  clamp = "clamp",
  extend = "extend",
  identity = "identity",
}

const imageUri = uri + "data/file/";
export const ViewStore = (props: Props) => {
  const Dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [displayProducts, setDisplayProducts] = useState<Product[]>(
    props.Store.products
  );
  const [arrayOfProducts, setArrayOfProducts] = useState<string[]>([]);

  const savedOrder = useSelector((state: any) => state.savedOrder) as Order;
  const deliveryLocation = useSelector(
    (state: any) => state.deliveryLocation
  ) as LocationObject;

  const DistanceKm: number = getDistance(
    props.Store.location,
    deliveryLocation
  );
  const { OpenDateString, CloseDateString } = useCloseOpen(props.Store);

  let ShakeRef = useRef<ShakeText>();
  let shakeLayoutY = 0;

  let ScrollViewRef = useRef<ScrollView>();

  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const opacityChange = scrollOffsetY.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
  });

  const opacityOff = scrollOffsetY.interpolate({
    inputRange: [0, 20],
    outputRange: [1, 0],
  });

  const TransformText = scrollOffsetY.interpolate({
    inputRange: [50, 150],
    outputRange: [10, 78],
    extrapolateLeft: Extarpolate.clamp,
    extrapolateRight: Extarpolate.clamp,
  });
  const TransformTextY = scrollOffsetY.interpolate({
    inputRange: [0, 60, 150],
    outputRange: [210, 150, 20],
    extrapolateRight: Extarpolate.clamp,
    extrapolateLeft: Extarpolate.clamp,
  });

  const TransformTextScale = scrollOffsetY.interpolate({
    inputRange: [0, 60, 150],
    outputRange: [1, 0.95, 1.05],
    extrapolateRight: Extarpolate.clamp,
    extrapolateLeft: Extarpolate.clamp,
  });

  const ImageTranslate = scrollOffsetY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
    extrapolateLeft: Extarpolate.clamp,
  });

  const imageScale = scrollOffsetY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateRight: Extarpolate.clamp,
  });

  useEffect(() => {
    Dispatch(HideAddressHandlerAction());

    return () => {
      Dispatch(ShowAddressHandler());
    };
  }, []);

  useEffect(() => {
    if (
      (!savedOrder ||
        JSON.stringify(savedOrder.seller) !==
          JSON.stringify(props.Store._id)) &&
      props.Address
    ) {
      //Create new order

      let neworder: Order = {
        buyer: undefined,
        date: {
          date: new Date(),
          timestamp: Math.floor(Date.now() / 1000),
        },
        location: deliveryLocation,
        selecedProdcuts: [],
        seller: props.Store._id,
        status: 1,
        totalPrice: {
          price: 0,
          currency: "ILS",
        },
        address: props.Address,
        distance: DistanceKm,
      };

      Dispatch(SavedOrderAction(neworder));
    } else {
    }
    let newarrayOfProducts = JSON.parse(JSON.stringify(arrayOfProducts));
    props.Store.products.map((product) => {
      const index = newarrayOfProducts.indexOf(product.category);
      if (index === -1) {
        newarrayOfProducts.push(product.category);
      }
    });
    setArrayOfProducts(newarrayOfProducts);
  }, []);

  useEffect(() => {
    let newDisplayProducts: Product[] = JSON.parse(
      JSON.stringify(props.Store.products)
    );
    let selectedProductOrder: Product[] = JSON.parse(
      JSON.stringify(savedOrder?.selecedProdcuts || [])
    );
    setDisplayProducts(newDisplayProducts.concat(selectedProductOrder));
  }, [JSON.stringify(savedOrder?.selecedProdcuts)]);

  const BackPress = () => {
    navigation.navigate("tabs", { id: 1 });
  };

  const TotalPrice = () => {
    let price = 0;
    savedOrder?.selecedProdcuts.map((p) => {
      price += getPricePerUnit(p) * (p.units || 1);
    });
    return price;
  };

  const canViewOrder = () => {
    if (props.Store.minOrder) {
      if (props.Store.minOrder.price > TotalPrice()) {
        if (ShakeRef.current) {
          ScrollViewRef.current?.scrollTo({ animated: true, y: shakeLayoutY });
          ShakeRef.current.startShakeAnimation();
        }
      } else {
        navigation.navigate("ViewOrder", { id: 4 });
      }
    } else {
      navigation.navigate("ViewOrder", { id: 4 });
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <View>
        <Animated.Text
          style={[
            styles.StoreName,
            {
              transform: [
                { translateX: TransformText },
                { translateY: TransformTextY },
                { scale: TransformTextScale },
              ],
              zIndex: 3,
            },
          ]}
        >
          {props.Store?.name}
        </Animated.Text>
        <Animated.View
          style={{
            opacity: opacityChange,
            backgroundColor: "white",
            height: 60,
            width: "100%",
            position: "absolute",
            zIndex: 2,
          }}
        ></Animated.View>
        <Pressable style={styles.backButton} onPress={BackPress}>
          <Text style={styles.backButtonText}>{BackButtonText}</Text>
        </Pressable>
        <Animated.View
          style={[
            {
              transform: [{ translateY: ImageTranslate }],
              position: "absolute",
              top: 0,
            },
            styles.imageStyle,
          ]}
        >
          <Animated.Image
            style={[
              styles.imageStyle,
              {
                transform: [{ scale: imageScale }],
              },
            ]}
            source={{
              uri: imageUri + props.Store?.logo,
              cache: "force-cache",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              top: 160,
              left: 10,
            }}
          >
            <View
              onLayout={(e) => {
                shakeLayoutY = e.nativeEvent.layout.y;
              }}
              style={styles.imageText}
            >
              <ShakeText
                TextComponent={Text}
                duration={200}
                ref={(ref: ShakeText) => (ShakeRef.current = ref)}
                style={{ padding: 2 }}
              >
                {(props.Store.minOrder &&
                  "Min Order: " +
                    PriceString(
                      props.Store.minOrder?.price,
                      props.Store.minOrder?.currency
                    )) ||
                  "Min Order: 0" + getSymbolFromCurrency("ILS")}
              </ShakeText>
            </View>
            <View style={styles.imageText}>
              <Text style={{ padding: 2 }}>
                Delivery: {PriceString(DeliveryFee(DistanceKm), "ILS")}
              </Text>
            </View>
          </View>
        </Animated.View>
        <ScrollView
          ref={(ref: ScrollView) => {
            ScrollViewRef.current = ref;
          }}
          snapToOffsets={[0, 150]}
          snapToEnd={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollOffsetY.setValue(event.nativeEvent.contentOffset.y);
          }}
          stickyHeaderHiddenOnScroll={true}
          style={{ marginBottom: 60 }}
        >
          <View style={styles.Conteintor}>
            <Animated.View style={[styles.storeInfo, { opacity: opacityOff }]}>
              {DistanceKm > 1 && (
                <View style={styles.detailsView}>
                  <Text style={styles.detailsText}>
                    <Entypo color={"green"} size={20} name="back-in-time" />{" "}
                    {" " + OpenDateString + " - " + CloseDateString}
                  </Text>
                  <Text style={styles.detailsText}>
                    <MaterialCommunityIcons
                      color={"green"}
                      name="map-marker-distance"
                      size={20}
                    />{" "}
                    {" " +
                      Math.round(
                        getDistance(props.Store.location, deliveryLocation)
                      ) +
                      " km"}
                  </Text>
                </View>
              )}
              {DistanceKm < 1 && (
                <View style={styles.detailsView}>
                  <Text style={styles.detailsText}>
                    <Entypo color={"green"} size={20} name="back-in-time" />
                    {OpenDateString + " - " + CloseDateString}
                  </Text>
                  <Text style={styles.detailsText}>
                    <MaterialCommunityIcons
                      color={"green"}
                      name="map-marker-distance"
                      size={20}
                    />{" "}
                    {" " +
                      Math.round(
                        getDistance(props.Store.location, deliveryLocation)
                      ) *
                        1000 +
                      " m"}
                  </Text>
                </View>
              )}
            </Animated.View>
          </View>
          {arrayOfProducts.map((categoryname, index) => {
            if (!displayProducts) return;
            let localproducts = new Array<Product>();
            for (let i = 0; i < displayProducts?.length; i++) {
              if (displayProducts[i].category === categoryname) {
                localproducts.push(displayProducts[i]);
              }
            }
            return (
              <ProductsGrid
                key={index}
                title={categoryname}
                displayProducts={localproducts}
              />
            );
          })}
        </ScrollView>
      </View>
      {savedOrder && savedOrder.selecedProdcuts.length > 0 && (
        <Pressable onPress={canViewOrder} style={styles.ViewOrderButton}>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              top: 6,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {ViewOrderButtonText}
          </Text>
        </Pressable>
      )}
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
    position: "absolute",
    zIndex: 3,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "lightgreen",
    height: 40,
    width: 55,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    top: 10,
  },
  detailsView: {
    display: "flex",
    marginTop: 4,
  },
  detailsText: {
    fontSize: 16,
    marginRight: 5,
    padding: 4,
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
