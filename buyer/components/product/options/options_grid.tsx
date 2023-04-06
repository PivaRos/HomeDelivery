import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, PriceObject, Product, RootStackParamList, Store, Option, ui_order } from "../../../interfaces";
import { uri } from "../../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import OptionProductTab from "./optionProductTab";


interface Props {
    addToPrice: (amount: number) => void,
    option: Option,
    store: Store,
}

export const ProductOptionsList = (props: Props) => {


    return (<View style={styles.mainGrid}>
        <Text style={styles.optionName}>{props.option.name}</Text>
        {props.option.maxPicks > 1 && <Text style={styles.ChooseText}>בחר עד {props.option.maxPicks} פריטים</Text>}
        {props.option.maxPicks === 1 && <Text style={styles.ChooseText}>בחר פריט אחד</Text>}
        {props.option.optionProducts.map((value, index) => {
            return (<OptionProductTab key={index} store={props.store} optionProductId={value} />)
        })}
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