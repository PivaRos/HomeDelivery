import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, PriceObject, Product, RootStackParamList, Store, Option } from "../../../interfaces";
import { uri } from "../../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import OptionProductTab from "./optionProductTab";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ObjectId } from "mongodb";
import { GetOptionProduct } from "../../../functions";
import { BackHandler } from "react-native";

interface Props {
    option: Option;
    optionIndex: number;
    store: Store;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
    selectedProduct: Product;
}

export const ProductOptionsList = (props: Props) => {
    const [optionProductCheckedState, setOptionProductCheckedState] = useState<boolean[]>(props.option.optionProducts.map(() => { return false }));
    const [optionProductUnits, setOptionProductUnits] = useState<number[]>(props.option.optionProducts.map(() => {
        return 0;
    }));

    const getTotalUnits = (array: number[]) => {
        let TotalUnits = 0;
        array.forEach(units => {
            if (units) {
                TotalUnits += units;
            }
        });
        return TotalUnits;
    }

    useEffect(() => {
        console.log(getTotalUnits(optionProductUnits));
        if (props.option.selectedOptionProducts && props.option.selectedOptionProducts.length > 0) //if product is not default *
        {
            // need to update checkedState 
            setOptionProductCheckedState(props.option.selectedOptionProducts.map((v) => {
                return v.selected;
            }))
            // need to update units
            setOptionProductUnits(props.option.selectedOptionProducts.map((v) => {
                return v.units;
            }))
        }
    }, [])


    useEffect(() => {
        // not working properly 
        console.log("optionProducts Units Changed !");
        console.log("the unmber array is" + optionProductUnits);
        let option = props.option;
        option.selectedOptionProducts = option.optionProducts.map((v, index) => {
            return {
                selected: optionProductCheckedState[index],
                units: optionProductUnits[index]
            };
        })
        let TselectedProduct = props.selectedProduct;
        if (TselectedProduct.options) {
            TselectedProduct.options[props.optionIndex] = option;
        }
        props.setSelectedProduct(TselectedProduct);
    }, [JSON.stringify(optionProductCheckedState), JSON.stringify(optionProductUnits)])

    return (<View style={styles.mainGrid}>
        <Text style={{ fontWeight: 'bold', padding: 5, paddingLeft: 15, }}>{props.option.name}</Text>
        {props.option.maxPicks > 1 && <Text style={{ padding: 2, color: "grey", paddingLeft: 13, }}>ניתן לבחור עד {props.option.maxPicks} פריטים</Text>}
        {props.option.maxPicks === 1 && <Text style={{ padding: 2, color: "grey", paddingLeft: 13, }}>ניתן לבחור עד פריט אחד{getTotalUnits(optionProductUnits) > props.option.maxPicks && "+"}</Text>}
        {props.option.optionProducts.map((OptionProduct, index) => {
            return <OptionProductTab optionProductCheckedState={optionProductCheckedState} optionProductUnits={optionProductUnits} setOptionProductUnits={setOptionProductUnits} isChecked={optionProductCheckedState[index]} setOptionProductCheckedState={setOptionProductCheckedState} key={index} index={index} optionProduct={GetOptionProduct(props.store, OptionProduct)} />
        })}
    </View>);
}

const styles = StyleSheet.create({
    mainGrid: {
        width: '100%',
    },
    ChooseText: {
        top: -7,
        color: 'grey',
        left: 5,
    },
    optionName: {
        padding: 10,
        fontWeight: 'bold',
    },
})