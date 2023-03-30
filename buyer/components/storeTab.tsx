import React, { useState, useEffect } from 'react'; 
import ReactNative, {StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback,  Animated, Easing  } from 'react-native';
import { Store } from '../interfaces';
import { useNavigation } from '@react-navigation/native';
import {uri} from '../envVars';
interface Props {
    Store:Store;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>
}


const StoreTab = (props:Props) => {
    const navigation = useNavigation();

    const StorePressed = () => {
        console.log(props.Store.name + " pressed");
        props.setSelectedStore(props.Store);
        navigation.navigate("ViewStore", {});

    }   
    let scaleValue = new Animated.Value(0); // declare an animated value
    const cardScale = scaleValue.interpolate({
        inputRange: [0, 1.1, 1.1],
        outputRange: [1.1, 1.2, 1]
      });
      let transformStyle = { ...styles.view, transform: [{ scale: cardScale }] };


    return (
    <TouchableWithoutFeedback onPress={StorePressed}>
    <View style={styles.view}>
    <Text style={styles.title}>{props.Store.name}</Text>
    <Animated.View style={transformStyle}>
        <Image source={{uri:uri+"data/file/"+props.Store.logo}} style={styles.image}/>

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
        height:150,
        width:'88%',
        borderRadius:10,
    },

    title:{
        paddingLeft:10,
        marginBottom:8,
        fontWeight:'bold',
    }
});

export default StoreTab;

