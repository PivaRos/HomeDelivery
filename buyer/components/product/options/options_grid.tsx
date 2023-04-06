import React, {useState, useEffect} from "react";
import {View, Text, Button, Pressable, StyleSheet, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, PriceObject, Product, RootStackParamList, Store, Option, ui_order } from "../../../interfaces";
import { uri } from "../../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import OptionProductTab from "./optionProductTab";


interface Props{
    addToPrice:(amount: number) => void,
    option:Option,
    store:Store,
}   

const ProductOptionsList = (props:Props) => {


    return (<View>
            {props.option.optionProducts.map((value) => {
                return (<OptionProductTab store={props.store} optionProductId={value}/>)
            })}
    </View>);
}