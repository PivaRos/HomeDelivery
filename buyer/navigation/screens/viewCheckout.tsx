import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import {
  Order,
  RootStackParamList,
  Store,
  currencyEnum,
  savedAddress,
} from "../../interfaces";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import {
  getDistance,
  getPricePerUnit,
  subtotalCalculator,
} from "../../functions";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CheckoutTab } from "../../components/checkoutTab";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  BackButtonText,
  DeliveryFeeText,
  ServiceFeeText,
  SubTotalText,
  addressText,
  billingText,
  directionEnum,
  paymentText,
  textDirection,
  totalText,
} from "../../languageConfig";
import { BillingTab } from "../../components/billingTab";
import { CheckoutBotton } from "../../components/checkoutButton";
import { useDeliveryFeeAmount } from "../../hooks/useDeliveryFeeAmount";
import { CreditCardsGrid } from "../../components/creditCard/creditCardsGrid";
import { AddressesGrid } from "../../components/checkoutAddress/addressesGrid";
import BottomSheet from "@gorhom/bottom-sheet";

interface CheckoutPops {
  savedAddresses: savedAddress[] | undefined;
}

export const ViewCheckout = ({ savedAddresses }: CheckoutPops) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const deliveryLocation = useSelector(
    (state: any) => state.deliveryLocation
  ) as Location.LocationObject;
  const selectedStore = useSelector(
    (state: any) => state.selectedStore
  ) as Store;
  const savedOrder = useSelector((state: any) => state.savedOrder) as Order;
  let MapRef = useRef<MapView | null>(null).current;

  const addressDrawerRef = useRef<BottomSheet>(null);
  const creditCardDrawerRef = useRef<BottomSheet>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    addressDrawerRef.current?.forceClose();
    creditCardDrawerRef.current?.forceClose();
  }, [addressDrawerRef.current, creditCardDrawerRef.current]);

  useEffect(() => {
    if (!drawerOpen) {
      if (addressDrawerRef.current) {
        addressDrawerRef.current.close();
      }
      if (creditCardDrawerRef.current) {
        creditCardDrawerRef.current.close();
      }
    }
  }, [drawerOpen]);

  const deliveryFeeAmount = useDeliveryFeeAmount(savedOrder);

  const ServiceFeeAmount = 5000;

  const subtotal = subtotalCalculator(savedOrder);

  const BackPress = () => {
    navigation.navigate("ViewOrder", { id: 4 });
  };

  useEffect(() => {
    if (!MapRef) return;
    MapRef.fitToSuppliedMarkers(["deliveryLocation", "selectedStore"], {
      animated: true,
    });
  }, [deliveryLocation, selectedStore]);

  return (
    <View>
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
            fontSize: 16,
            position: "absolute",
          }}
        >
          {selectedStore?.name}
        </Text>
      </View>
      <ScrollView style={{ backgroundColor: "white" }}>
        {deliveryLocation && selectedStore?.location && (
          <MapView
            ref={(ref) => (MapRef = ref)}
            camera={{
              heading: 0,
              altitude:
                getDistance(selectedStore.location, deliveryLocation) *
                1000 *
                3,
              pitch: 1,
              center: {
                latitude:
                  (deliveryLocation.coords.latitude +
                    selectedStore.location.coords.latitude) /
                  2,
                longitude:
                  (deliveryLocation.coords.longitude +
                    selectedStore.location.coords.longitude) /
                  2,
              },
            }}
            style={{
              height: 250,
              width: "100%",
              shadowColor: "#000",
              shadowOffset: { width: 1, height: 3 },
              shadowOpacity: 0.2,
              backgroundColor: "white",
            }}
          >
            {selectedStore?.location !== undefined && (
              <Marker
                coordinate={selectedStore.location.coords}
                title={selectedStore?.name}
                identifier="selectedStore"
              >
                <View
                  style={{
                    backgroundColor: "white",
                    height: 20,
                    width: 20,
                    borderRadius: 50,
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  {/* this is Store Marker */}
                  <Text style={{ fontWeight: "bold" }}>
                    {(selectedStore.avgDelivery &&
                      savedOrder.distance &&
                      selectedStore.avgDelivery * savedOrder.distance) ||
                      "0"}
                  </Text>
                </View>
              </Marker>
            )}
            <Marker
              coordinate={{
                latitude: deliveryLocation.coords.latitude,
                longitude: deliveryLocation.coords.longitude,
              }}
              title={selectedStore?.name}
              identifier="deliveryLocation"
            >
              <View
                style={{
                  backgroundColor: "lightgreen",
                  height: 20,
                  width: 20,
                  borderRadius: 100,
                  borderColor: "white",
                  borderWidth: 2.3,
                }}
              ></View>
            </Marker>
          </MapView>
        )}
        <CheckoutTab
          ok={savedOrder.distance <= selectedStore.deliveryDistance}
          IconImage={MaterialCommunityIcons}
          title={addressText}
          subTitle={
            savedOrder.address.street +
            " " +
            savedOrder.address.streetNumber +
            " " +
            savedOrder.address.city
          }
          IconImageSize={28}
          IconName="map-marker-distance"
          IconColor="green"
          onPress={() => {
            addressDrawerRef.current?.expand();
          }}
        />
        <CheckoutTab
          ok={false}
          IconImage={AntDesign}
          IconName="creditcard"
          IconImageSize={28}
          title={paymentText}
          subTitle={"כרטיס אשראי"}
          IconColor="green"
          onPress={() => {
            creditCardDrawerRef.current?.expand();
          }}
        />

        <View
          style={[
            { backgroundColor: "white", marginTop: 15, width: "100%" },
            textDirection === directionEnum.RTL
              ? {
                  direction: "rtl",
                }
              : {},
          ]}
        >
          <Text
            style={[
              {
                padding: 20,
                fontWeight: "bold",
                fontSize: 20,
              },
              textDirection === directionEnum.RTL
                ? {
                    textAlign: "left",
                  }
                : {},
            ]}
          >
            {billingText}.
          </Text>
          <BillingTab
            amount={subtotal}
            currency={savedOrder.totalPrice.currency}
            description={SubTotalText}
          />
          <BillingTab
            amount={ServiceFeeAmount}
            currency={currencyEnum.ILS}
            description={ServiceFeeText}
          />
          <BillingTab
            amount={deliveryFeeAmount}
            currency={currencyEnum.ILS}
            description={DeliveryFeeText}
            additionalText={
              savedOrder.distance > 1
                ? "(" + " " + Math.round(savedOrder.distance) + " km" + ")"
                : "(" +
                  " " +
                  Math.round(savedOrder.distance * 1000) +
                  " m" +
                  ")"
            }
          />
          <BillingTab
            amount={deliveryFeeAmount + subtotal + ServiceFeeAmount}
            currency={currencyEnum.ILS}
            description={totalText}
          />
          <View style={{ height: 150 }}>
            <CheckoutBotton
              mainText="this is pay button"
              onPress={() => {
                console.log("clicked");
              }}
            />
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        enablePanDownToClose
        snapPoints={["50%"]}
        ref={addressDrawerRef}
      >
        <AddressesGrid />
      </BottomSheet>
      <BottomSheet
        footerComponent={() => (
          <Pressable
            style={{ backgroundColor: "lightgreen", height: 140, width: "95%" }}
          ></Pressable>
        )}
        enablePanDownToClose
        snapPoints={["50%"]}
        ref={creditCardDrawerRef}
      >
        <View style={{ height: 500, width: "100%", backgroundColor: "grey" }}>
          <Text>creditcard</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    height: "100%",
  },
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
