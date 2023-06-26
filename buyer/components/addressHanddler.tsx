import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { LocationGeocodedAddress } from 'expo-location';
import { GovAddressUri } from '../envVars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { savedAddress } from '../interfaces';

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

            AsyncStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
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
        setListOpened(false);
        animatedToggle.setValue(0);
        }
        
    }, [toggleOpenAddressList])


    useEffect(() => {
        
    }, [savedAddresses])


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
        let found  = false;
        let index = -1;
        const TempSavedAddresses = JSON.parse(JSON.stringify(savedAddresses)) as savedAddress[];
        TempSavedAddresses.map((CheckAddress, index) => {
            if (JSON.stringify(CheckAddress.address) === JSON.stringify(address))
            {
                found = true;
                index = index;
            }
        })
        if (found)
        {
            TempSavedAddresses.splice(index, 1);
            
        }
        TempSavedAddresses.push({
            address:address
        })
        setSavedAddresses(TempSavedAddresses);
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
                    {(query !== "") && dataArr.map((res, index) => {
                        res = AdpterToGeocodedAddress(res);
                        return (<View  key={index}  style={{justifyContent:"center", flexDirection:'row', width:'100%'}}><Pressable style={{width:'50%'}} onPress={() => addressChoosen(res)}>
                        <Text style={{padding:5, textAlign:'center'}}>{res.street + " " + res.streetNumber + " " + res.city}</Text>
                        </Pressable></View>)
                    }) ||
                    savedAddresses && savedAddresses.map((address, index) => {
                        return (<View key={index} style={{justifyContent:"center", flexDirection:'row', width:'100%'}}><Pressable style={{width:'50%'}} onPress={() => addressChoosen(address.address)}>
                        <Text style={{padding:5, textAlign:'center'}}>{address.address.street + " " + address.address.streetNumber + " " + address.address.city}</Text>
                        {(savedAddresses.length === (index +1)) && <Text style={{color:"green"}}>{"(נוכחי)"}</Text>}
                        </Pressable></View>)

    
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
        height:200,
        width:"100%"
    }
    
})