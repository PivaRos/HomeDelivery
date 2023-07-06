import { LocationGeocodedAddress, LocationGeocodedLocation } from "expo-location";
import { View, Text } from "react-native";


interface props {
    FromLocation:LocationGeocodedLocation| undefined;
    ToLocation:LocationGeocodedLocation | undefined;
    FromAddress:LocationGeocodedAddress;
    ToAddress:LocationGeocodedAddress;
}


export const ViewDeliveryLoading = ({
    FromLocation, 
    FromAddress, 
    ToAddress, 
    ToLocation,
}:props) => {



    return (<View>
        
        

    </View>);
}