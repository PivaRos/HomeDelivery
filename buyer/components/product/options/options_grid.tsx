import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, PriceObject, Product, RootStackParamList, Store, Option } from "../../../interfaces";
import { uri } from "../../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import OptionProductTab from "./optionProductTab";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ObjectId } from "mongodb";

interface Props {
}

export const ProductOptionsList = (props: Props) => {



    const [ListIsChecked, setListIsChecked] = useState<boolean[]>([]);
    const [indexForOptions, setIndexForOptions] = useState(-1);

        //gets the index of current option in the product options
    useEffect(() => {

    }, [])

    useEffect(() => {  

    }, [JSON.stringify(ListIsChecked)])





    return (<View style={styles.mainGrid}>
        <OptionProductTab/>
    </View>);
}

const styles = StyleSheet.create({
    mainGrid:{
        width:'100%',   
    },
    ChooseText:{
        top:-7,
        color:'grey',
        left:5,
    },
    optionName:{
        padding:10,
        fontWeight:'bold',
    },
})