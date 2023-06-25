import { View, Text } from "react-native";
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Address } from "react-native-maps";
import { savedAddress } from "../interfaces";


interface addressComponentProps {
    savedAddresses:savedAddress[] | undefined;
}


export const AddressComponent = ({savedAddresses}:addressComponentProps) => {






    return (
        <View style={{
            width:'100%',
            height:100, 
            backgroundColor:'lightgreen'
            }}>
            <Text></Text>
        </View>
    );
}