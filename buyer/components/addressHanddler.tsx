import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { LocationGeocodedAddress } from "expo-location";
import { GovAddressUri } from "../envVars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savedAddress } from "../interfaces";
import { addAddress } from "../addressesFunctions";
import { AdpterToGeocodedAddress } from "../functions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  StartLoadingAction,
  StopLoadingAction,
} from "../redux/actions/LoadingActions";
import {
  AddSavedAddressAction,
  setSavedAddressesAction,
} from "../redux/actions/SavedAddressesActions";
import { AddressAction } from "../redux/actions/AddressAction";
import { InternetConnectionAction } from "../redux/actions/InterntConnectionAction";
import {
  ToggleCloseAddressListAction,
  ToggleOpenAddressListAction,
} from "../redux/actions/ToggleAddressListActions";

interface Props {}

export const AddressHanddler = ({}: Props) => {
  const Dispatch = useDispatch();

  const toggleOpenAddressList = useSelector(
    (state: any) => state.toggleOpenAddressList
  ) as boolean;
  const currentLocation = useSelector(
    (state: any) => state.currentLocation
  ) as Location.LocationObject;
  const deliveryLocation = useSelector(
    (state: any) => state.deliveryLocation
  ) as Location.LocationObject;
  const savedAddresses = useSelector(
    (state: any) => state.savedAddresses
  ) as savedAddress[];
  const address = useSelector((state: any) => state.address);

  const [usingCurrent, setUsingCurrent] = useState(
    currentLocation === deliveryLocation
  );
  const [listOpened, setListOpened] = useState(toggleOpenAddressList);
  const [query, setQuery] = useState("");

  useEffect(() => {
    //check for savedAddresses
    checkSavedAddresses();
  }, []);

  useEffect(() => {
    try {
      if (savedAddresses.length > 0) {
        AsyncStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
      }
    } catch {}
  }, [savedAddresses]);

  const checkSavedAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem("savedAddresses");
      if (savedAddresses) {
        Dispatch(setSavedAddressesAction(JSON.parse(savedAddresses)));
      }
    } catch {}
  };

  const [dataArr, setDataArr] = useState(Array<any>());
  const internetConnection = useSelector(
    (state: any) => state.internetConnection
  );

  const valueOpen = useRef(new Animated.Value(0)).current; // 0 close 1 open
  const animatedlist = useRef(new Animated.Value(-500)).current;
  const animatedsmall = useRef(new Animated.Value(-50)).current;

  const zindexInterpulation = valueOpen.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 101],
  });

  useEffect(() => {
    setUsingCurrent(currentLocation === deliveryLocation);
  }, [address]);

  const AddressPressed = () => {
    Dispatch(InternetConnectionAction(!internetConnection));
    console.log(internetConnection);
    setListOpened((value) => {
      if (value === false) {
        // * opend
        Animated.timing(animatedsmall, {
          toValue: -150,
          useNativeDriver: true,
          duration: 270,
        }).start();
        Animated.timing(animatedlist, {
          toValue: 250,
          useNativeDriver: true,
          duration: 250,
        }).start();
      } else {
        // *not opend
        Animated.timing(animatedsmall, {
          toValue: -50,
          useNativeDriver: true,
          duration: 250,
        }).start();
        Animated.timing(animatedlist, {
          toValue: -250,
          useNativeDriver: true,
          duration: 250,
        }).start();
      }
      return !value;
    });
  };

  useEffect(() => {
    if (listOpened) {
      valueOpen.setValue(1);
      Dispatch(ToggleOpenAddressListAction());
      setDataArr([]);
    } else {
      setTimeout(() => {
        valueOpen.setValue(0);
      }, 100);
      Dispatch(ToggleCloseAddressListAction());
    }
  }, [listOpened]);

  useEffect(() => {
    if (!toggleOpenAddressList) {
      checkSavedAddresses();
      setListOpened(false);
    }
  }, [toggleOpenAddressList]);

  useEffect(() => {
    console.log("listisopened : " + listOpened);
    if (listOpened) Dispatch(ToggleOpenAddressListAction());
    else Dispatch(ToggleCloseAddressListAction());
  }, [listOpened]);

  useEffect(() => {}, [savedAddresses]);

  const fillter = (query: string): string => {
    var withNoDigits = query.replace(/[0-9]/g, "");
    var result = withNoDigits.replace(/\s+/g, " ").trim();
    return result;
  };

  const EventChanged = async (newtext: string) => {
    const fillteredQuery = fillter(query);
    fetch(GovAddressUri + fillteredQuery).then((res) => {
      res.json().then((data) => {
        setDataArr(data.result.records);
      });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      EventChanged(query);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [query]); // triggers the search after 300ms;

  const addressChoosen = (address: Location.LocationGeocodedAddress) => {
    Dispatch(StartLoadingAction());
    Dispatch(AddressAction(address));
    //!!
    Dispatch(AddSavedAddressAction({ address: address }));
    // !!
    AddressPressed();
    Dispatch(StopLoadingAction());
  };

  return (
    <Animated.View
      style={{
        height: 300,
        position: "absolute",
        zIndex: zindexInterpulation,
        top: 45,
      }}
    >
      <Animated.View
        style={{
          marginTop: -250,
          height: 300,
          backgroundColor: "lightgreen",
          transform: [{ translateY: animatedlist }],
          zIndex: 51,
        }}
      >
        <Pressable
          onPress={AddressPressed}
          style={{ height: 300, width: "100%" }}
        >
          <View
            style={{
              height: 250,
              width: "100%",
              backgroundColor: "lightgreen",
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <TextInput
                onChangeText={(newtext) => setQuery(newtext)}
                style={{
                  fontSize: 18,
                  padding: 10,
                  direction: "rtl",
                  width: "100%",
                }}
                placeholder="חפש כתובות"
              />
              <ScrollView keyboardShouldPersistTaps="handled">
                {(query !== "" &&
                  query !== undefined &&
                  query.length > 3 &&
                  dataArr.map((res, index) => {
                    res = AdpterToGeocodedAddress(res, query);
                    return (
                      <View key={index} style={styles.addressView}>
                        <Pressable
                          style={{ width: "100%" }}
                          onPress={() => addressChoosen(res)}
                        >
                          <Text style={styles.addressText}>
                            {res.street +
                              " " +
                              res.streetNumber +
                              " " +
                              res.city}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })) ||
                  (savedAddresses &&
                    savedAddresses.map((address, index) => {
                      return (
                        <View key={index} style={styles.addressView}>
                          <Pressable
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              direction: "rtl",
                            }}
                            onPress={() => addressChoosen(address.address)}
                          >
                            <Text style={styles.addressText}>
                              {address.address.street +
                                " " +
                                address.address.streetNumber +
                                " " +
                                address.address.city}{" "}
                              <MaterialCommunityIcons
                                size={16}
                                color={"green"}
                                name="history"
                              />
                            </Text>
                            {savedAddresses.length === index + 1 && (
                              <Text
                                style={{
                                  color: "green",
                                  top: 5,
                                  right: 0,
                                  position: "absolute",
                                }}
                              >
                                {"(נוכחי)"}
                              </Text>
                            )}
                          </Pressable>
                        </View>
                      );
                    }))}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateY: animatedsmall }],
          zIndex: 50,
        }}
      >
        <Pressable style={styles.view} onPress={AddressPressed}>
          <View style={styles.anotherView}>
            {address && (
              <Text style={{ textAlign: "center", width: "100%" }}>
                {address.street +
                  " " +
                  address.streetNumber +
                  " " +
                  address.city}
              </Text>
            )}
            {usingCurrent && (
              <Text style={{ fontWeight: "bold" }}> (Current Location)</Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 30,
    width: "100%",
    backgroundColor: "lightgreen",
    justifyContent: "center",
  },
  anotherView: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  addressText: {
    padding: 3,
    textAlign: "center",
    fontSize: 16,
    width: "100%",
  },
  addressView: {
    backgroundColor: "lightgreen",
    justifyContent: "center",
    width: "100%",
    height: 50,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
});
