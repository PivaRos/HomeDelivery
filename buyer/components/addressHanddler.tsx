import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';
import { GovAddressUri } from '../envVars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savedAddress } from '../interfaces';
import { addAddress } from '../addressesFunctions';

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

export const AddressHanddler = ({ 

        address,
        currentLocation,
        deliveryLoction, 
        setDeliveryLoction, 
        setAddress, 
        setLoading, 
        toggleOpenAddressList, 
        setToggleOpenAddressList 
    }: Props) => {
    const [usingCurrent, setUsingCurrent] = useState(currentLocation === deliveryLoction);
    const [listOpened, setListOpened] = useState(toggleOpenAddressList);
    const [savedAddresses, setSavedAddresses] = useState<savedAddress[]>([]);
    const [query, setQuery ] = useState("");
    
    useEffect(() => {
        //check for savedAddresses
        checkSavedAddresses();
    }, [])
    

    useEffect(() => {
        try{
            if(savedAddresses.length > 0)
            {
                AsyncStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
            }
        }

        catch{

        }
    }, [savedAddresses])

    const checkSavedAddresses = async () => {
            const tryAddresses = await AsyncStorage.getItem("savedAddresses");
            if (!tryAddresses) return;
            const savedAddresses:savedAddress[] =  JSON.parse(tryAddresses);
            if (savedAddresses) setSavedAddresses(savedAddresses)
    }

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
        checkSavedAddresses();
        setListOpened(false);
        animatedToggle.setValue(0);
        }
        
    }, [toggleOpenAddressList])


    useEffect(() => {
        
    }, [savedAddresses])


    const heightIntepulation = animatedToggle.interpolate({
        inputRange:[0,1],
        outputRange:[30, 250]
    })

    const fillter = (query:string):string => {
        var withNoDigits = query.replace(/[0-9]/g, '');
        var result = withNoDigits.replace(/\s+/g, ' ').trim()
        return result
    }

    const EventChanged  = async (newtext:string) => {
        const fillteredQuery = fillter(query);
        fetch(GovAddressUri+fillteredQuery).then(res => {
            res.json().then((data) => {
                setDataArr(data.result.records);
                console.log(data.result.records);
            })
        })
    }
    
    useEffect(() => {

        const timeout = setTimeout(() => {
            EventChanged(query);
        }, 300);
        return () => { clearTimeout(timeout) }
    }, [query]) // triggers the search after 300ms;



    const addressChoosen = (address:Location.LocationGeocodedAddress) => {
        setLoading(true);
        setAddress(address);
        //!!
        setSavedAddresses(savedAddresses => {
            return addAddress(savedAddresses, {address:address})
        });
        // !!
        AddressPressed();
        setLoading(false);

    }

    const AdpterToGeocodedAddress = (GovAddress:any) => {
        return {
            city:GovAddress.שם_ישוב,
            country:'Israel',
            isoCountryCode:"IL",
            street:GovAddress.שם_רחוב,
            streetNumber:query.replace(/^\D+/g, ''),
        } as Location.LocationGeocodedAddress
    }// converts Gov return data to own Type
    

    return (
        <Animated.View style={[{height: 30, backgroundColor: 'lightgreen' }, {height:heightIntepulation}]}>
            <Pressable onPress={AddressPressed} style={styles.view}>
                <View style={styles.anotherView}>

                    {address && <Text style={{textAlign:'center', width:'100%'}}>{address.street + " " + address.streetNumber + " " + address.city}</Text>}
                    {usingCurrent && <Text style={{ fontWeight: 'bold' }}> (Current Location)</Text>}
                </View>
                {listOpened && <View style={{
                    height: 250,
                    width: '100%',
                    backgroundColor: 'lightgreen',
                    zIndex: 10,
                    position: 'absolute',


                }}>
                    <View style={{width:'100%', justifyContent:'center', flexDirection:'column'}}>
                    
                    <TextInput onChangeText={newtext => setQuery(newtext)} style={{fontSize:18, padding:10, direction:'rtl', width:"100%"}} placeholder='חפש כתובות'/>
                    <ScrollView keyboardShouldPersistTaps="handled">
                    {(query !== "" && query !== undefined) && dataArr.map((res, index) => {
                        res = AdpterToGeocodedAddress(res);
                        return (<View  key={index}  style={styles.addressView}><Pressable style={{width:'50%'}} onPress={() => addressChoosen(res)}>
                        <Text style={styles.addressText}>{res.street + " " + res.streetNumber + " " + res.city}</Text>
                        </Pressable></View>)
                    }) ||
                    savedAddresses && savedAddresses.map((address, index) => {
                        return (
                        <View key={index} style={styles.addressView}>
                            <Pressable style={{width:'100%', flexDirection:'row', direction:'rtl'}} onPress={() => addressChoosen(address.address)}>
                                <Text style={styles.addressText}>{address.address.street + " " + address.address.streetNumber + " " + address.address.city}</Text>
                                {(savedAddresses.length === (index +1)) && <Text style={{color:"green", top:5}}>{"(נוכחי)"}</Text>}
                            </Pressable>
                        </View>)

    
                    })
                    
                    }
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
        height:300,
        width:"100%"
    },
    addressText:{
        padding:3,
        textAlign:'center',
        fontSize:16,
        width:"100%"
    },
    addressView:{
        backgroundColor:'lightgreen',
        justifyContent:"center",
        width:'100%',
        height:50,
        padding:4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        
        elevation: 12,
    }
    
})