import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeUIEvent,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import * as React from "react";
import {
  availableStores,
  govAddress,
  Pages,
  RootStackParamList,
} from "../../interfaces";
import * as Location from "expo-location";
import { StackRouter, useNavigation } from "@react-navigation/native";
import { Fumi, Akira } from "react-native-textinput-effects";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useEffect, useRef, useState } from "react";
import { GovAddressUri } from "../../envVars";
import { AdpterToGeocodedAddress, getDistance } from "../../functions";
import MapView, { MapMarker, Marker, Polyline } from "react-native-maps";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
  fromDestination: Location.LocationGeocodedAddress;
  toDestination: Location.LocationGeocodedAddress;
  fromLocation: Location.LocationGeocodedLocation | undefined;
  toLocation: Location.LocationGeocodedLocation | undefined;
  setFromDestination: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedAddress>
  >;
  setToDestination: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedAddress>
  >;
  setFromLocation: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedLocation | undefined>
  >;
  setToLocation: React.Dispatch<
    React.SetStateAction<Location.LocationGeocodedLocation | undefined>
  >;
}

const OrdersScreen = ({
  fromDestination,
  toDestination,
  fromLocation,
  toLocation,
  setFromDestination,
  setToDestination,
  setFromLocation,
  setToLocation,
}: Props) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [distance, setDistance] = useState(0);

  const [fromDestinationQuery, setFromDestinationQuery] = useState<string>("");
  const [toDestinationQuery, setToDestinationQuery] = useState<string>("");

  const [FromFocus, setFromFocus] = useState<boolean>(false);
  const [ToFocus, setToFocus] = useState<boolean>(false);

  const [fromResults, setFromResults] = useState<
    Location.LocationGeocodedAddress[]
  >([]);
  const [toResults, setToResults] = useState<
    Location.LocationGeocodedAddress[]
  >([])
  let MapRef = useRef<MapView>(null).current;
  let FromMarkerRef = useRef<MapMarker>(null).current;
  let ToMarkerRef = useRef<MapMarker>(null).current;

  //when user picks address from list
  useEffect(() => {
    (async () => {
      if (fromDestination) {
        const PossibleFromLocations = await Location.geocodeAsync(
          fromDestination.street +
            " " +
            fromDestination.streetNumber +
            " " +
            fromDestination.city
        );
        setFromLocation(PossibleFromLocations[0]);
      }
      if (toDestination) {
        const PossibleToLocations = await Location.geocodeAsync(
          toDestination.street +
            " " +
            toDestination.streetNumber +
            " " +
            toDestination.city
        );
        setToLocation(PossibleToLocations[0]);
      }
    })();
  }, [fromDestination, toDestination]);

  const SwitchDestinations = () => {
    if (fromDestinationQuery !== "" || toDestinationQuery !== "") {
      const TFromDestinationQuery = fromDestinationQuery;
      const TToDestinationQuery = toDestinationQuery;

      setFromDestinationQuery(TToDestinationQuery);
      setToDestinationQuery(TFromDestinationQuery);

      const TFromResults = fromResults;
      const TToResults = toResults;

      setToResults(TFromResults);
      setFromResults(TToResults);

      const TfromDestination = fromDestination;
      const TtoDestination = toDestination;

      setFromDestination(TtoDestination);
      setToDestination(TfromDestination);
    }
  };

  useEffect(() => {
    if (!MapRef || !fromLocation || !toLocation) return;
    let LatMiddle = (+fromLocation.latitude + toLocation.latitude) / 2;
    let lonMiddle = (+fromLocation.longitude + toLocation.longitude) / 2;
    const distance = getDistance(
      {
        coords: {
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
          accuracy: null,
          altitude: 0,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      },
      {
        coords: {
          latitude: toLocation.latitude,
          longitude: toLocation.longitude,
          accuracy: null,
          altitude: 0,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }
      );
      setDistance(distance);

    MapRef.fitToSuppliedMarkers(["toMarker", "fromMarker"], {
      animated: true,
    });

  }, [fromLocation, toLocation]);

  const fillter = (query: string): string => {
    var withNoDigits = query.replace(/[0-9]/g, "");
    var result = withNoDigits.replace(/\s+/g, " ").trim();
    return result;
  };

  const searchAddress = async (query: string) => {
    try {
      const fillteredQuery = fillter(query);
      const res = await fetch(GovAddressUri + fillteredQuery);
      const data = await res.json();

      const dataArray = data.result.records;
      const GoodArray = dataArray.map(
        (govAddress: govAddress, index: number) => {
          return AdpterToGeocodedAddress(govAddress, query);
        }
      ) as Location.LocationGeocodedAddress[];
      return GoodArray;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const results = (await searchAddress(
        fromDestinationQuery
      )) as Location.LocationGeocodedAddress[];
      setFromResults(results);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [fromDestinationQuery]); // triggers the search after 300ms;

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const results = (await searchAddress(
        toDestinationQuery
      )) as Location.LocationGeocodedAddress[];
      setToResults(results);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [toDestinationQuery]); // triggers the search after 300ms;

  const canStart = (): boolean => {
    if (
      fromLocation &&
      toLocation &&
      toDestinationQuery ===
        toDestination.street +
          " " +
          toDestination.streetNumber +
          " " +
          toDestination.city &&
      fromDestinationQuery ===
        fromDestination.street +
          " " +
          fromDestination.streetNumber +
          " " +
          fromDestination.city
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View>
      <Text
        style={[
          styles.title,
          { left: 0, width: "100%", fontSize: 22, padding: 2 },
        ]}
      >
        Request Delivery {"(:"}
      </Text>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            display: "flex",
            width: "15%",
            height: 145,
          }}
        >
          <Pressable
            style={{
              width: "100%",
              height: 135,
              backgroundColor: "green",
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
              opacity: 0.9,
              justifyContent: "center",
            }}
            onPress={() => SwitchDestinations()}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <AntDesign color={"white"} name="retweet" size={28} />
            </View>
          </Pressable>
        </View>
        <View style={{ width: "70%" }}>
          <Fumi
            iconName="warehouse"
            iconColor="green"
            style={{ direction: "rtl", margin: 4, borderRadius: 6, zIndex: 10 }}
            iconClass={FontAwesome5}
            label="מאיפה ?"
            blurOnSubmit={true}
            iconSize={18}
            inputPadding={16}
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholderTextColor={"green"}
            value={fromDestinationQuery}
            onChangeText={(text: string) => setFromDestinationQuery(text)}
            onFocus={() => setFromFocus(true)}
            onBlur={() => setTimeout(() => setFromFocus(false), 50)}
          />
          {(FromFocus || fromResults.length > 0) &&
            fromDestinationQuery.length > 3 &&
            fromDestinationQuery !==
              fromDestination.street +
                " " +
                fromDestination.streetNumber +
                " " +
                fromDestination.city && (
              <ScrollView
                style={{
                  backgroundColor: "white",
                  zIndex: 101,
                }}
                keyboardShouldPersistTaps={"handled"}
              >
                {fromResults.map((address, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setFromDestination(address);
                        setFromDestinationQuery(
                          address.street +
                            " " +
                            address.streetNumber +
                            " " +
                            address.city
                        );
                      }}
                      style={{
                        width: "100%",
                        zIndex: 101,
                        padding: 4,
                        height: 30,
                      }}
                      key={index}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {address.street +
                          " " +
                          address.streetNumber +
                          " " +
                          address.city}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

          <Fumi
            iconName="delivery-dining"
            dataDetectorTypes={"address"}
            iconColor="green"
            style={{ direction: "rtl", margin: 4, borderRadius: 6, zIndex: 10 }}
            iconClass={MaterialIcons}
            label="לאן ?"
            blurOnSubmit={true}
            iconSize={26}
            inputPadding={16}
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholderTextColor={"green"}
            value={toDestinationQuery}
            onChangeText={(text: string) => setToDestinationQuery(text)}
            onFocus={() => setToFocus(true)}
            onBlur={() => setTimeout(() => setToFocus(false), 50)}
          />

          {(ToFocus || toResults.length > 0) &&
            toDestinationQuery.length > 3 &&
            toDestinationQuery !==
              toDestination.street +
                " " +
                toDestination.streetNumber +
                " " +
                toDestination.city && (
              <ScrollView style={{ zIndex: 10, backgroundColor: "white" }}>
                {toResults.map((address, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setToDestination(address);
                        setToDestinationQuery(
                          address.street +
                            " " +
                            address.streetNumber +
                            " " +
                            address.city
                        );
                      }}
                      style={{
                        width: "100%",
                        zIndex: 101,
                        padding: 4,
                        height: 30,
                      }}
                      key={index}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {address.street +
                          " " +
                          address.streetNumber +
                          " " +
                          address.city}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
        </View>
      </View>
      {toDestination && fromDestination && (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            padding: 10,
          }}
        >
          <Pressable
            disabled={!canStart()}
            onPress={() => {
              navigation.navigate("ViewDeliveryLoading", { id: 6 });
            }}
            style={{
              width: fromLocation && toLocation ? "90%" : "70%",
              padding: 15,
              backgroundColor: "lightgreen",
              borderRadius: 10,
              opacity: canStart() ? 1 : 0.7,
            }}
          >
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: canStart() ? 20 : 18,
              }}
            >
              {canStart() ? " בקש משלוח " : "נא בחר את היעדים"}{" "}
              {canStart() ? (
                <Text style={{ fontSize: 16 }}>
                  {canStart() ? +Math.round(distance * 10) / 10 + ' ק"מ ' : ""}
                </Text>
              ) : (
                ""
              )}
            </Text>
          </Pressable>
        </View>
      )}
      <View>
        <MapView

          style={{ width: "100%", height: windowHeight - 435 }}
          ref={(ref) => (MapRef = ref)}
          mapType={Platform.OS == "android" ? "none" : "standard"}
          camera={{
            center:{latitude: 32.0461, 
              longitude: 34.8516,} , 
              heading:0,
              pitch:0,
              altitude:10000
          }}
          
        >
          {fromLocation && (
            <Marker
              ref={(ref) => (FromMarkerRef = ref)}
              coordinate={{
                latitude: fromLocation.latitude,
                longitude: fromLocation.longitude,
              }}
              focusable
              identifier={"fromMarker"}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: "#ffcccb",
                  borderRadius: 10,
                }}
              ></View>
            </Marker>
          )}

          {toLocation && (
            <Marker
              ref={(ref) => (ToMarkerRef = ref)}
              coordinate={{
                latitude: toLocation.latitude,
                longitude: toLocation.longitude,
              }}
              focusable
              identifier={"toMarker"}
            >
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: "#ffcccb",
                  borderRadius: 10,
                }}
              ></View>
            </Marker>
          )}

          {toLocation && fromLocation && (
            <Polyline
              coordinates={[
                {
                  latitude: fromLocation.latitude,
                  longitude: fromLocation.longitude,
                }, // optional
                {
                  latitude: toLocation.latitude,
                  longitude: toLocation.longitude,
                }, // optional
              ]}
              strokeWidth={4}
              strokeColor="grey"
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  TextInputStyle: {
    direction: "rtl",
    width: "50%",
    textAlign: "center",
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
    borderRadius: 30,
  },
});

export default OrdersScreen;
