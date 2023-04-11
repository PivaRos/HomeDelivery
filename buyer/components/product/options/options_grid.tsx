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
    addToPrice: (amount: number) => void,
    option: Option,
    store: Store,
}



export const ProductOptionsList = (props: Props) => {
    const [ListIsChecked, setListIsChecked] = useState<boolean[]>(new Array(props.option.optionProducts.length));
    const toggleCheckbox = (index:number) => {
        console.log(index);
        let tempListIsChecked = ListIsChecked;
        tempListIsChecked[index] = !tempListIsChecked[index];
        setListIsChecked(tempListIsChecked); 
    }

    const CheckBoxPressed = (isChecked:boolean, index:number) => {

    }

    const GetOptionProductsName = (value:ObjectId) => {
        for (let i = 0;i<props.store.optionProducts.length;i++)
        {
            if (props.store.optionProducts[i]._id === value)
            {
                return props.store.optionProducts[i].name;
            }
        }
    }

    const getProductOptions = () => {
       return (props.option.optionProducts.map((value, index) => {

            return (<View style={{padding:5, marginLeft:5}} key={index}><BouncyCheckbox isChecked={ListIsChecked[index]}  fillColor="lightgreen" text={GetOptionProductsName(value)} onPress={() => {
                console.log(ListIsChecked)
                let tempListIsChecked = ListIsChecked;
                tempListIsChecked[index] = !tempListIsChecked[index];
                setListIsChecked(tempListIsChecked); 
            }}/></View> )
        }));
    }

    return (<View style={styles.mainGrid}>
        <Text style={styles.optionName}>{props.option.name}</Text>
        {props.option.maxPicks > 1 && <Text style={styles.ChooseText}>בחר עד {props.option.maxPicks} פריטים</Text>}
        {props.option.maxPicks === 1 && <Text style={styles.ChooseText}>בחר פריט אחד</Text>}
        {getProductOptions()}
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