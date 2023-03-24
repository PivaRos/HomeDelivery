import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text, Image, ScrollView, Dimensions} from 'react-native';
import { Store } from '../interfaces';
import StoreTab from './storeTab';

interface Props {
    title:string;
    displayStores:Store[] | null | undefined;
}
const StoresGrid = (props:Props) => {
    
    const uri = "http://192.168.1.198:8000/data/file/";

    const [arr, setArr] = useState(new Array(props.displayStores?.length))

    return (    <View style={{ marginTop:50,}}>
                <Text style={styles.title}>{props.title}</Text>
                <ScrollView showsHorizontalScrollIndicator={false}  snapToOffsets={arr.map((value, index) => {
                    return ((index+1)*Dimensions.get('window').width-100);
                })} decelerationRate="fast" horizontal={true} style={styles.view}>
                {props.displayStores && props.displayStores.map((store, index) => {
                    return <StoreTab key={index} Store={store}/>
                })}
                </ScrollView>
                </View>); 
}

const styles = StyleSheet.create({
    view:{
        height:200,
    },

    title:{
        paddingLeft:10,
        fontWeight:'bold',
    }
})

export default StoresGrid;

