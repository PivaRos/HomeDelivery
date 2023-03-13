import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text} from 'react-native';
import { Store } from '../interfaces';

interface Props {
    title:string;
    displayStores:Store[];
}
const StoresGrid = (props:Props) => {
    

    return (<View style={styles.view}>
                <Text style={styles.title}>{props.title}</Text>
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
        fontSize:'18px',
    }
})

export default StoresGrid;

