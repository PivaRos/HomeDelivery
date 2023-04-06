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


    return (<View>
        <Text>{props.option.name}</Text>
        {props.option.optionProducts.map((value, index) => {
            return (<OptionProductTab key={index} store={props.store} optionProductId={value} />)
        })}
    </View>);
}