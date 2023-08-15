import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  addAddressText,
  addressesGridText,
  directionEnum,
  noSavedAddressesText,
  textDirection,
} from "../../languageConfig";
import { MultiTab } from "../multiTab";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import {
  UserAddress,
  addressDetailsType,
  govAddress,
  savedAddress,
} from "../../interfaces";
import { AdpterToGeocodedAddress, savedAddressToString } from "../../functions";
import BottomDrawer, {
  BottomDrawerMethods,
} from "react-native-animated-bottom-drawer";
import React, { useEffect, useRef, useState } from "react";
import { GovAddressUri } from "../../envVars";
import SearchableDropdown from "react-native-searchable-dropdown";
import {
  LocationGeocodedAddress,
  LocationGeocodedLocation,
} from "expo-location";

interface AddressesGridProps {
  style?: any;
}

export const AddressesGrid = ({ ...props }: AddressesGridProps) => {
  const userAddresses = useSelector(
    (state: any) => state.userAddresses
  ) as UserAddress[];

  const [query, setQuery] = useState("");
  const [dataArr, setDataArr] = useState<govAddress[] | []>([]);
  const inputRef = useRef(null);
  const [selectedAddres, setSelectedAddress] =
    useState<LocationGeocodedAddress>();

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

  const addAddressDrawerRef = useRef<BottomDrawerMethods>(null);

  const addressSelected = (address: LocationGeocodedAddress) => {
    setQuery(address.street + " " + address.streetNumber + " " + address.city);
    setSelectedAddress(address);
  };

  return (
    <>
      <ScrollView
        style={[{ padding: 10 }]}
        contentContainerStyle={{ height: 345 }}
      >
        <Text
          style={{
            fontSize: 26,
            padding: 15,
            width: "100%",
            textAlign: textDirection === directionEnum.RTL ? "right" : "left",
          }}
        >
          {addressesGridText}
        </Text>
        <View style={{ marginTop: 20 }}>
          {userAddresses ? (
            userAddresses.map((address, index) => {
              if (address.addressDetailsType) {
                return (
                  <MultiTab
                    key={"AddressTabNumber" + index}
                    IconImage={AntDesign}
                    IconName=""
                    IconImageSize={14}
                    subTitle={savedAddressToString(address)}
                    title={address.title}
                  />
                );
              }
            })
          ) : (
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: "grey",
                  fontSize: 18,
                }}
              >
                {noSavedAddressesText}
              </Text>
            </View>
          )}
        </View>
        <Pressable
          style={{
            height: 50,
            width: "100%",

            backgroundColor: "lightgreen",
            borderRadius: 10,
            justifyContent: "center",
          }}
          onPress={() => {
            addAddressDrawerRef.current?.open();
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", width: "100%" }}>
            {addAddressText}
          </Text>
        </Pressable>
      </ScrollView>
      <BottomDrawer initialHeight={520} ref={addAddressDrawerRef}>
        <View
          style={{
            height: 520,
            top: 5,
            padding: 10,
            position: "absolute",
            width: "100%",
          }}
        >
          <TextInput
            ref={inputRef}
            onChangeText={(newtext) => setQuery(newtext)}
            style={{
              fontSize: 18,
              padding: 10,
              textAlign: "center",
            }}
            placeholder="חפש כתובות"
          />
          {query.length > 1 &&
            query !==
              selectedAddres?.street +
                " " +
                selectedAddres?.streetNumber +
                " " +
                selectedAddres?.city && (
              <FlatList
                data={dataArr}
                renderItem={({ item, index }) => {
                  const address = AdpterToGeocodedAddress(item, query);
                  return (
                    <Pressable
                      style={{ width: "100%" }}
                      key={index}
                      onPress={() => {
                        addressSelected(address);
                      }}
                    >
                      <Text key={index}>
                        {address.street +
                          " " +
                          address.streetNumber +
                          " " +
                          address.city}
                      </Text>
                    </Pressable>
                  );
                }}
                keyExtractor={(item, index) => index + ""}
              />
            )}
        </View>
      </BottomDrawer>
    </>
  );
};
