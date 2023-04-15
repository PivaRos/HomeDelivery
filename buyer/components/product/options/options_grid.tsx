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
    option: Option,
    store: Store,
    Product:Product,
    setProduct:React.Dispatch<React.SetStateAction<Product>>,
    justChanged:boolean,
    setJustChanged:React.Dispatch<React.SetStateAction<boolean>>
}



export const ProductOptionsList = (props: Props) => {
    const [ListIsChecked, setListIsChecked] = useState<boolean[]>(props.option.selectedOptionProducts);
    


    const toggleCheckbox = (index:number) => {
        if (!props.Product.options) return


    }

    const GetOptionProduct = (value:ObjectId) => {
        for (let i = 0;i<props.store.optionProducts.length;i++)
        {
            if (props.store.optionProducts[i]._id === value)
            {
                return props.store.optionProducts[i];
            }
        }
    }

    const getProductOptions = () => {
       return (props.option.optionProducts.map((value, index) => {

            return (<View style={{padding:5, marginLeft:5}} key={index}><BouncyCheckbox isChecked={ListIsChecked[index]}  fillColor="lightgreen" text={GetOptionProduct(value)?.name} onPress={() => {
                toggleCheckbox(index);
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