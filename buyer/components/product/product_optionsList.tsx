import React, {useState, useEffect} from "react";
import {View, Text, Button, Pressable, StyleSheet, ScrollView, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, PriceObject, Product, RootStackParamList, Store, product_option, ui_order } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";




interface Props{
    addToPrice:(amount: number) => void,
    option:product_option
}   

const ProductOptionsList = (props:Props) => {


    return (<View>

    </View>);
}