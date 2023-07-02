import { Pressable, StyleSheet, Text, TextInput, View, NativeUIEvent  } from 'react-native';
import * as React from 'react'
import { availableStores, govAddress, Pages } from '../../interfaces';
import * as Location from 'expo-location';
import { StackRouter } from '@react-navigation/native';
import { Fumi, Akira } from 'react-native-textinput-effects';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from 'react';
import { GovAddressUri } from '../../envVars';
import { AdpterToGeocodedAddress } from '../../functions';


interface Props {
    location:Location.LocationObject;
  }

const OrdersScreen = (props:Props) => {
    const [fromDestinationQuery, setFromDestinationQuery] = useState<string>("");
    const [toDestinationQuery, setToDestinationQuery] = useState<string>("");

    const [fromDestination, setFromDestination] = useState<Location.LocationGeocodedAddress>();
    const [toDestination, setToDestination] = useState<Location.LocationGeocodedAddress>();

    const [FromFocus, setFromFocus] = useState<boolean>(false);
    const [ToFocus, setToFocus] = useState<boolean>(false);

    const [fromResults, setFromResults] = useState<Location.LocationGeocodedAddress[]>([])
    const [toResults, setToResults] = useState<Location.LocationGeocodedAddress[]>([])

const SwitchDestinations = () => {
    if (fromDestinationQuery !== "" || toDestinationQuery !== "")
    {
        const TFromDestinationQuery = fromDestinationQuery
        const TToDestinationQuery = toDestinationQuery

        setFromDestinationQuery(TToDestinationQuery);
        setToDestinationQuery(TFromDestinationQuery);
    }
}

const fillter = (query:string):string => {
    var withNoDigits = query.replace(/[0-9]/g, '');
    var result = withNoDigits.replace(/\s+/g, ' ').trim()
    return result
}

const searchAddress = async (query:string) => {
    try{
    const fillteredQuery = fillter(query);
    const res = await fetch(GovAddressUri+fillteredQuery)
    const data = await res.json();

    const dataArray = data.result.records;
    const GoodArray = dataArray.map((govAddress:govAddress, index:number) => {
        return AdpterToGeocodedAddress(govAddress, query);
    }) as Location.LocationGeocodedAddress[]
        return GoodArray;
    }
    catch{
        return [];
    }   
}

useEffect(() => {
    const timeout = setTimeout(async () => {
    const results = await searchAddress(fromDestinationQuery) as Location.LocationGeocodedAddress[];
    setFromResults(results)
    }, 300);
    return () => { clearTimeout(timeout)};
}, [fromDestinationQuery]) // triggers the search after 300ms;



useEffect(() => {
    const timeout = setTimeout(async () => {
    const results = await searchAddress(toDestinationQuery) as Location.LocationGeocodedAddress[];
    setToResults(results);
    }, 300);
    return () => { clearTimeout(timeout) }
}, [toDestinationQuery]) // triggers the search after 300ms;



return (
    <View>
        <Text style={[ styles.title,{left:0, width:"100%", fontSize:22, padding:2}]}>Request Delivery {"(:"}</Text>
        <View style={{width:'100%', justifyContent:'center', flexDirection:'row',  marginTop:20}}>
        <View style={{justifyContent:"center", display:'flex', width:'15%', height:145}}>
        <Pressable style={{
            width:'100%', 
            height:135, 
            backgroundColor:'green', 
            borderTopLeftRadius:15, 
            borderBottomLeftRadius:15,
            opacity:0.9,
            justifyContent:'center'
        }}
        onPress={() => SwitchDestinations()}>
        <View style={{width:'100%',justifyContent:'center', flexDirection:'row'}}>
            <AntDesign color={'white'} name='retweet' size={28}/>
        </View>
        </Pressable>
        </View>
            <View style={{width:"70%"}}>
                <Fumi 
                iconName='warehouse'
                iconColor='green'
                style={{direction:'rtl',margin:4, borderRadius:6, zIndex:10}} 
                iconClass={FontAwesome5} 
                label='מאיפה ?'
                blurOnSubmit={true}
                iconSize={18}
                inputPadding={16}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={"green"}
                value={fromDestinationQuery}
                onChangeText={(text:string) => setFromDestinationQuery(text)}
                onFocus={() => setFromFocus(true)}
                onBlur={() => setFromFocus(false)}
                />
                {FromFocus && fromResults.length > 0 && fromDestinationQuery!== "" &&
                    <View>
                        {fromResults.map((address, index) => {
                            return (<Pressable style={{
                                width:"100%", 
                                zIndex:11,
                                padding:4
                                }} 
                                key={index}>
                                <Text style={{textAlign:'center'}}>{address.street + " " + address.streetNumber + " " + address.city}</Text>
                            </Pressable>)
                        })}
                    </View>}

                <Fumi
                iconName='delivery-dining'
                dataDetectorTypes={'address'} 
                iconColor='green'
                style={{direction:'rtl',margin:4, borderRadius:6, zIndex:10}} 
                iconClass={MaterialIcons} 
                label='לאן ?'
                blurOnSubmit={true}
                iconSize={26}
                inputPadding={16}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={"green"}
                value={toDestinationQuery}
                onChangeText={(text:string) => setToDestinationQuery(text)}
                onFocus={() => setToFocus(true)}
                onBlur={() => setToFocus(false)}
                />

                {ToFocus && toResults.length > 0 && toDestinationQuery!== "" &&
                    <View>
                        {toResults.map((address, index) => {
                            return (<Pressable style={{
                                width:"100%", 
                                zIndex:11,
                                padding:4
                                }} 
                                key={index}>
                                <Text style={{textAlign:'center'}}>{address.street + " " + address.streetNumber + " " + address.city}</Text>
                            </Pressable>)
                        })}
                    </View>}
            </View>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    title:{
        fontSize:22 ,
        marginLeft:10,
        marginTop:10,
        fontFamily:'AmericanTypewriter',
        fontWeight:'bold'
        
    }, 
    TextInputStyle: {
        direction:'rtl',
        width:"50%",
        textAlign:'center',
        borderColor:'black', 
        borderWidth:1,
        padding:5,
        borderRadius:30
        
    }
})

export default OrdersScreen;