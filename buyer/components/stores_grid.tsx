import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text} from 'react-native';
import { Store } from '../interfaces';

interface Props {
    title:string;
    displayStores:Store[] | null | undefined;
}
const StoresGrid = (props:Props) => {
    


    return (<View style={styles.view}>
                <Text style={styles.title}>{props.title}</Text>
                <Text>{(props.displayStores && props.displayStores[0]) && props.displayStores[0].name}</Text>
            </View>); 
}

const styles = StyleSheet.create({
    view:{
        width:'100%',
        height:300,
        position:'relative',

    },

    title:{
        paddingLeft:10,
        fontWeight:'bold',
    }
})

export default StoresGrid;

