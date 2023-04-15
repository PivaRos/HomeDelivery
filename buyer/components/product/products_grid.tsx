import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text, Image, ScrollView, Dimensions} from 'react-native';
import { LocationObject, Order, Product, Store } from '../../interfaces';
import ProductTab from './productTab';

interface Props {
    title:string;
    displayProducts:Product[] | null | undefined;
    displaySelectedProducts?:Product[];
    setSelectedProduct:React.Dispatch<React.SetStateAction<Product | undefined>>;
    thelocation:LocationObject;
    savedOrder:Order | undefined | null
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
}
const ProductsGrid = (props:Props) => {


    useEffect(() => {
        console.log(props.displayProducts?.map((value) => {
            return value.name;
        }))
    }, [])

    const GetContent = () => {
        return (    <View style={{ marginTop:50,}}>
            <Text style={styles.title}>{props.title}</Text>
            <ScrollView style={styles.view}>
            {(props.displayProducts) && props.displayProducts.map((product, index) => {
                return <ProductTab savedOrder={props.savedOrder} setSelectedOrder={props.setSavedOrder} thelocation={props.thelocation} setSelectedProduct={props.setSelectedProduct} key={index} Product={product}/>
            })}
            </ScrollView>
            </View>); 
    }

    return GetContent();
}

const styles = StyleSheet.create({
    view:{
    },

    title:{
        paddingLeft:10,
        fontWeight:'bold',
    }
})

export default ProductsGrid;

