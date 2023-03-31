import React, {useState, useEffect} from "react";
import {View, Text, Button, Pressable, StyleSheet, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Store } from "../../interfaces";

interface Props {
    Store:Store | undefined
}
export const ViewStore = (props:Props) => {
    const navigation = useNavigation();
    return (
        
        <View style={{backgroundColor:'white', height:'100%'}}>
            <Pressable style={styles.backButton} onPress={() => navigation.navigate("tabs", {})}><Text style={styles.backButtonText}>Back</Text></Pressable>
        <ScrollView contentContainerStyle={styles.Conteintor}>

        <Text>{props.Store?.name}</Text>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton:{
        padding:8,

    },
    backButtonText:{
        fontSize:18,
        color:'#1787d1'
    }, 
    Conteintor:{
        justifyContent:'center',
        display:'flex',
        flexDirection:'row',
        width:'100%',
        height:'auto',
        backgroundColor:'red'
    }
})