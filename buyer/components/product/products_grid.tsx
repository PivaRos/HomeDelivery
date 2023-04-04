import React, { useState, useEffect } from 'react'; 
import {StyleSheet, View, Text, Image, ScrollView, Dimensions} from 'react-native';
import { LocationObject, Product, Store } from '../../interfaces';
import ProductTab from './productTab';

interface Props {
    title:string;
    displayProducts:Product[] | null | undefined;
    setSelectedProduct:React.Dispatch<React.SetStateAction<Product | undefined>>;
    thelocation:LocationObject;
    
}
const ProductsGrid = (props:Props) => {
    



    return (    <View style={{ marginTop:50,}}>
                <Text style={styles.title}>{props.title}</Text>
                <ScrollView style={styles.view}>
                {props.displayProducts && props.displayProducts.map((product, index) => {
                    return <ProductTab thelocation={props.thelocation} setSelectedProduct={props.setSelectedProduct} key={index} Product={product}/>
                })}
                </ScrollView>
                </View>); 
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

