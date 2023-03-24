import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { availableStores, LocationObject, Pages } from '../interfaces';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';

interface Props{
    fullcoords:Location.LocationObjectCoords | undefined;
}

export const AddressHanddler = (props:Props) => {
    const [address, setAddress] = useState<LocationGeocodedAddress[]>();

    const ReverseGeocodeing = async () => {
        try{

            if (props.fullcoords)
            {
                //const adresscheck =  await Location.geocodeAsync("ברודצקי 43 תל אביב");
                //console.log(adresscheck);
                const {latitude, longitude} = props.fullcoords
                let response = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });
                console.log(response);
                setAddress(response);
            }
        }
        catch{

        }
    }

        useEffect(() => {
            ReverseGeocodeing();

        },[])

    return (
        <View style={styles.view}>
            <View style={styles.anotherView}>

                <Text>{address && address[0].street + " " + address[0].streetNumber + ", " + address[0].city}</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    view:{
        height:60,
        width:'100%',
    },
    input:{
     direction:'rtl',
     height:30,
     fontSize:19,
     width:150,
     backgroundColor:'red',
    },
     anotherView:{
        position:'absolute',
        left:0,
        bottom:5,
        display:'flex',
        flexDirection:'row',
     }
})