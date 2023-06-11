import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { availableStores, Pages, Address } from '../interfaces';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';

interface Props {
    address: LocationGeocodedAddress | undefined;
    deliveryLoction: Location.LocationObject | undefined;
    currentLocation: Location.LocationObject | undefined;
    setDeliveryLoction: React.Dispatch<React.SetStateAction<Location.LocationObject | undefined>>
    setAddress: React.Dispatch<React.SetStateAction<Location.LocationGeocodedAddress | undefined>>
}

export const AddressHanddler = ({ address, currentLocation, deliveryLoction, setDeliveryLoction, setAddress }: Props) => {
    const [usingCurrent, setUsingCurrent] = useState(currentLocation === deliveryLoction);
    const [listOpened, setListOpened] = useState(false);



    const AddressPressed = () => {
        setListOpened(value => {
            return !value
        })
    }

    return (
        <View style={{ minHeight: 30, backgroundColor: 'lightgreen' }}>
            <Pressable onPress={AddressPressed} style={styles.view}>
                <View style={styles.anotherView}>

                    {address && <Text>{address.street + " " + address.streetNumber + " " + address.city}</Text>}
                    {usingCurrent && <Text style={{ fontWeight: 'bold' }}> (current)</Text>}
                </View>
                {listOpened && <View style={{
                    height: 250,
                    width: '100%',
                    backgroundColor: 'lightgreen',
                    zIndex: 10,
                    position: 'absolute',


                }}>
                    <Text> asd</Text>
                </View>}
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    view: {
        height: 30,
        width: '100%',
    },
    anotherView: {
        position: 'absolute',
        left: 5,
        bottom: 6,
        display: 'flex',
        flexDirection: 'row',
    }
})