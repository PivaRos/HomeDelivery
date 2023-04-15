import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text, Image, ScrollView, Dimensions} from 'react-native';
import { LocationObject, Order, Store } from '../../interfaces';
import StoreTab from './storeTab';

interface Props {
    title:string;
    displayStores:Store[] | null | undefined;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    thelocation:LocationObject;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;    
    savedOrder:Order| undefined| null;
}
const StoresGrid = (props:Props) => {
    

    const [arr, setArr] = useState([0,0]);

    useEffect(() => {

        const newarray = new Array(props.displayStores?.length);
        if (newarray)
        {
            for(let i = 0;i < newarray.length; i++)
            {

                newarray[i] = i*Dimensions.get('window').width-(100*i);
            }
            setArr(newarray);
        }
    }, [props.displayStores])


    return (    <View style={{ marginTop:50,}}>
                <Text style={styles.title}>{props.title}</Text>
                <ScrollView showsHorizontalScrollIndicator={false}  snapToOffsets={arr} decelerationRate="fast" horizontal={true} style={styles.view}>
                {props.displayStores && props.displayStores.map((store, index) => {
                    return <StoreTab savedOrder={props.savedOrder} setSavedOrder={props.setSavedOrder} thelocation={props.thelocation} setSelectedStore={props.setSelectedStore} key={index} Store={store}/>
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

