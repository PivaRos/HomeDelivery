import React, {useState, useEffect} from "react";
import {View, Text, Button, Pressable, StyleSheet, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
    Store:Store | undefined
}

const imageUri = uri+"data/file/";
export const ViewStore = (props:Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    console.log(imageUri)
    return (
        
        <View style={{backgroundColor:'white', height:'100%'}}>
        <ScrollView>
        <View style={styles.Conteintor}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate("tabs", {id:1})}><Text style={styles.backButtonText}>Back</Text></Pressable>
        <Image style={styles.imageStyle} source={
            {uri:imageUri+props.Store?.logo,
                cache:"only-if-cached"
            
            }} />
        <View style={styles.storeInfo}>
        <Text style={styles.StoreName}>{props.Store?.name}</Text>
        </View>
        </View>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton:{
        zIndex:3,
        borderTopRightRadius:40,
        borderBottomRightRadius:40,
        backgroundColor:'lightgreen',
        height:40,
        width:55,
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
        top:10,
        left:25
        },
    backButtonText:{
        fontSize:16,
        color:'black'
    }, 
    Conteintor:{
        justifyContent:'center',
        display:'flex',
        flexDirection:'row',
        width:'100%',
        height:'auto',
    },
    StoreName:{
        fontSize:18,
    }, 
    ProductsView:{
        height:'auto',
        width:'100%',
        backgroundColor:'red'
    },
    storeInfo:{
        width:"100%",
        padding:10,
        marginTop:200,
    }, 
    imageStyle:{
        position:'absolute',
        top:0,
        height:200,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        width:'100%'
    }
})