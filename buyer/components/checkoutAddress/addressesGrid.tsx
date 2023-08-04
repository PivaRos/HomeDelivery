import { ScrollView, View, Text, Pressable } from "react-native";
import { addressesGridText } from "../../languageConfig";
import { MultiTab } from "../multiTab";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import { addressDetailsType, savedAddress } from "../../interfaces";
import { savedAddressToString } from "../../functions";

interface AddressesGridProps {
  style?: any;
}

export const AddressesGrid = ({ ...props }: AddressesGridProps) => {
  const savedAddresses = useSelector(
    (state: any) => state.savedAddress
  ) as savedAddress[];

  console.log(savedAddresses);

  return (
    <>
      <ScrollView style={[{ padding: 10 }]}>
        <Text style={{ fontSize: 26, padding: 15 }}>{addressesGridText}</Text>
        <View style={{ marginTop: 20, height: "100%" }}>
          {savedAddresses ? (
            savedAddresses.map((address, index) => {
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
                No saved Addresses
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Pressable
        style={{
          zIndex: 100,
          height: 40,
          padding: 10,
          width: "95%",
          position: "absolute",
          bottom: 0,
          backgroundColor: "green",
        }}
      ></Pressable>
    </>
  );
};
