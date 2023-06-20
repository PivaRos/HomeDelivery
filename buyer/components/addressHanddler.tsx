import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Animated, NativeSyntheticEvent, TextInputChangeEventData, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { availableStores, Pages, Address } from '../interfaces';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';
import { GovAddressUri } from '../envVars';

interface Props {
    address: LocationGeocodedAddress | undefined;
    deliveryLoction: Location.LocationObject | undefined;
    currentLocation: Location.LocationObject | undefined;
    setDeliveryLoction: React.Dispatch<React.SetStateAction<Location.LocationObject | undefined>>
    setAddress: React.Dispatch<React.SetStateAction<Location.LocationGeocodedAddress | undefined>>
    setLoading:React.Dispatch<React.SetStateAction<boolean>>;
    toggleOpenAddressList:boolean;
    setToggleOpenAddressList:React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddressHanddler = ({ address, currentLocation, deliveryLoction, setDeliveryLoction, setAddress, setLoading, toggleOpenAddressList, setToggleOpenAddressList }: Props) => {
    const [usingCurrent, setUsingCurrent] = useState(currentLocation === deliveryLoction);
    const [listOpened, setListOpened] = useState(toggleOpenAddressList);
    const [query, setQuery ] = useState("");

    const [dataArr, setDataArr] = useState(Array<any>());

    const animatedToggle = new Animated.Value(0);

    useEffect(() => {
        setUsingCurrent(currentLocation === deliveryLoction);
    }, [address])

    const AddressPressed = () => {
        setListOpened(value => {
            if (value === false)
            {
                animatedToggle.setValue(1)
            }
            else
            {
                animatedToggle.setValue(0);
            }
            return !value
        })
    }


    useEffect(() => {
        setToggleOpenAddressList(listOpened);
        if (listOpened)
        {
            setDataArr([]);
        }
    }, [listOpened])

    useEffect(() => {
        if (!toggleOpenAddressList)
        {
        setListOpened(false);
        animatedToggle.setValue(0);
        }
        
    }, [toggleOpenAddressList])



    const heightIntepulation = animatedToggle.interpolate({
        inputRange:[0,1],
        outputRange:[30, 150]
    })

    const fillter = (query:string):string => {
        var withNoDigits = query.replace(/[0-9]/g, '');
        var result = withNoDigits.replace(/\s+/g, ' ').trim()
        return result
    }

    const EventChanged  = async (newtext:string) => {
        const fillteredQuery = fillter(query);
        console.log(fillteredQuery);
        fetch(GovAddressUri+query).then(res => {
            res.json().then((data) => {
                setDataArr(data.result.records);
            })
        })
    }
    
    useEffect(() => {

        const timeout = setTimeout(() => {
            EventChanged(query);
        }, 300);
        return () => { clearTimeout(timeout) }
    }, [query])



    const addressChoosen = (address:any) => {
        setLoading(true);
        setAddress({
            city:address.שם_ישוב,
            country:"Israel",
            district:"",
            isoCountryCode:'IL',
            postalCode:null,
            street:address.שם_רחוב,
            streetNumber:query.replace(/^\D+/g, ''),
            name:"",
            region:null,
            subregion:null,
            timezone:null
        })
        AddressPressed();
        setLoading(false);

    }
    

    return (
        <Animated.View style={[{height: 30, backgroundColor: 'lightgreen' }, {height:heightIntepulation}]}>
            <Pressable onPress={AddressPressed} style={styles.view}>
                <View style={styles.anotherView}>

                    {address && <Text style={{textAlign:'center', width:'100%'}}>{address.street + " " + address.streetNumber + " " + address.city}</Text>}
                    {usingCurrent && <Text style={{ fontWeight: 'bold' }}> (current)</Text>}
                </View>
                {listOpened && <View style={{
                    height: 250,
                    width: '100%',
                    backgroundColor: 'lightgreen',
                    zIndex: 10,
                    position: 'absolute',


                }}>
                    <View style={{width:'100%', justifyContent:'center', flexDirection:'column'}}>
                    
                    <TextInput onChangeText={newtext => setQuery(newtext)} style={{fontSize:18, padding:10}} placeholder='חפש כתובות'/>
                    <ScrollView keyboardShouldPersistTaps="handled">
                    {dataArr.map((res, index) => {
                        return (<View  key={index}  style={{justifyContent:"center", flexDirection:'row', width:'100%'}}><Pressable style={{width:'50%'}} onPress={() => addressChoosen(res)}>
                        <Text style={{padding:5, textAlign:'center'}}>{ res.שם_רחוב +" "+  query.replace(/^\D+/g, '')+" " + res.שם_ישוב  }</Text>
                        </Pressable></View>)
                    })}
                    </ScrollView>
                    </View>
                </View>}
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    view: {
        height: 30,
        width: '100%',
    },
    anotherView: {
        width:'100%',
        position: 'absolute',
        left: 5,
        bottom: 6,
        display: 'flex',
        flexDirection: 'row',
    },
    openedView:{
        height:200,
        width:"100%"
    }
    
})