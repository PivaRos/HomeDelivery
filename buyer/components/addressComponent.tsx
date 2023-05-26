import { View, Text } from "react-native";
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Address } from "react-native-maps";


interface addressComponentProps {
    AddressArray:Address[];
}


export const AddressComponent = ({AddressArray}:addressComponentProps) => {

    const [addressList, SetAddressParty] = useState<Address[]>(AddressArray);





    return (
        <View>
            <Text></Text>
        </View>
    );
}