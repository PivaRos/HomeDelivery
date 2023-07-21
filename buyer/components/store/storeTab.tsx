import React, { useState, useEffect } from 'react'; 
import ReactNative, {StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback,  Animated, Easing  } from 'react-native';
import { LocationObject, Order, RootStackParamList, Store } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import {uri} from '../../envVars';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { SelectedStoreAction } from '../../redux/actions/SelectedStoreAction';
interface Props {
    Store:Store;
}


const StoreTab = (props:Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const Dispatch = useDispatch();

    const selectedStore = useSelector((state:any) => state.selectedStore);
    const StorePressed = async () => {
        console.log("heere")
        try{
        await Dispatch(SelectedStoreAction(props.Store));
        console.log(selectedStore);
        navigation.navigate("ViewStore", {id:2});
        }catch(e){
            console.log(e);
        }

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
        <Image source={
            {uri:uri+"data/file/"+props.Store.logo,
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

