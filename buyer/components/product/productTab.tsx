import React, { useState, useEffect } from 'react'; 
import ReactNative, {StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback,  Animated, Easing  } from 'react-native';
import { LocationObject, Product, RootStackParamList, Store } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import {uri} from '../../envVars';
import { StackNavigationProp } from '@react-navigation/stack';
interface Props {
    Product:Product;
    setSelectedProduct:React.Dispatch<React.SetStateAction<Product | undefined>>
    thelocation:LocationObject;
}


const ProductTab = (props:Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const ProductPressed = () => {
        props.setSelectedProduct(props.Product);
        navigation.navigate("ViewProduct", {id:3});

    }   
    let scaleValue = new Animated.Value(0); // declare an animated value
    const cardScale = scaleValue.interpolate({
        inputRange: [0, 1.1, 1.1],
        outputRange: [1.1, 1.2, 1]
      });
      let transformStyle = { ...styles.view, transform: [{ scale: cardScale }] };


    return (
    <TouchableWithoutFeedback onPress={ProductPressed}>
    <View style={styles.view}>
    <Text style={styles.title}>{props.Product.name}</Text>
    <Animated.View style={transformStyle}>
        <Image source={
            {uri:uri+"data/file/"+props.Product.mainimage,
            cache:'force-cache'
            }} style={styles.image}/>

    </Animated.View>
    </View>
    </TouchableWithoutFeedback>); 
}


const styles = StyleSheet.create({
    view:{
        width:Dimensions.get('window').width-100,
        height:180,
        alignItems:'center',
        marginTop:10,

    },
    image:{
        height:100,
        width:100,
        borderRadius:10,
    },

    title:{
        paddingLeft:10,
        marginBottom:8,
        fontWeight:'bold',
    }
});

export default ProductTab;

