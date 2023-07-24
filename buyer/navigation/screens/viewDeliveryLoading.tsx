import {
  LocationGeocodedAddress,
  LocationGeocodedLocation,
} from "expo-location";
import { View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DeliveryLocationAction } from "../../redux/actions/DeliveryLocationAction";

interface props {
  FromLocation: LocationGeocodedLocation | undefined;
  ToLocation: LocationGeocodedLocation | undefined;
  FromAddress: LocationGeocodedAddress;
  ToAddress: LocationGeocodedAddress;
}

export const ViewDeliveryLoading = ({
  FromLocation,
  FromAddress,
  ToAddress,
  ToLocation,
}: props) => {
  const reduxDeliveryLocation = useSelector(
    (state: any) => state.deliveryLocation
  );
  const dispatch = useDispatch();

  console.log(reduxDeliveryLocation);

  return (
    <View>
      <Pressable
        style={{ height: 100, width: "100%", backgroundColor: "red" }}
        onPress={() => {
          dispatch(
            DeliveryLocationAction({
              coords: {
                accuracy: null,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                latitude: 32,
                longitude: 32,
                speed: null,
              },
              timestamp: Date.now(),
            })
          );
        }}
      />
    </View>
  );
};
