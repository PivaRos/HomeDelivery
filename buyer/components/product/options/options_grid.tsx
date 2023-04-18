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
    units:number;
}

export const ProductOptionsList = (props: Props) => {



    const [ListIsChecked, setListIsChecked] = useState<boolean[]>(props.option.selectedOptionProducts);
    const [indexForOptions, setIndexForOptions] = useState(-1);

        //gets the index of current option in the product options
        useEffect(() => {
            let index = props.Product.options?.indexOf(props.option)
            if (index && index !== -1)
            {
                 setIndexForOptions(index);
            }
            else if(props.Product.options && props.option === props.Product.options[0]){
             setIndexForOptions(0);
            }
         }, [])

    useEffect(() => {
        //change local product
        if (props.units > 0)
        {
            props.setJustChanged(true); // to handle first time user changing checkbox 
        }
        let p = props.Product;
        if (p.options && p.options[indexForOptions])
        {
            
            console.log("option is :"+ p.options[indexForOptions]);
            p.options[indexForOptions].selectedOptionProducts = ListIsChecked;
            props.setProduct(p);
        }
    }, [JSON.stringify(ListIsChecked)])



    //returns the OptionProduct that has the id
    const GetOptionProduct = (value:ObjectId) => {
        for (let i = 0;i<props.store.optionProducts.length;i++)
        {
            if (props.store.optionProducts[i]._id === value)
            {
                return props.store.optionProducts[i];
            }
        }
    }

    //changes the selectedOptionProducts
    const ChangeSelectedOptionProducts = async (index:number) => {
        console.log(indexForOptions);
        let selectedlist = ListIsChecked;
        selectedlist[index] = !selectedlist[index];
        setListIsChecked(selectedlist);
    }

    const getProductOptions = () => {
       return (props.option.optionProducts.map((value, index) => {

            return (<View style={{padding:5, marginLeft:5}} key={index}>
                <BouncyCheckbox isChecked={ListIsChecked[index]}
                fillColor="lightgreen"
                text={GetOptionProduct(value)?.name}
                onPress={() => {
                    ChangeSelectedOptionProducts(index);
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