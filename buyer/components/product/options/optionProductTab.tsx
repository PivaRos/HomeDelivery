import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Store } from '../../../interfaces';
import { ObjectId } from 'mongodb';
import { GetOptionProduct } from '../../../functions';


interface Props {
    optionProductId:ObjectId;
    store:Store;
}


const OptionProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [optionProduct, setOptionProduct] = useState(GetOptionProduct(props.store, props.optionProductId));


    return (
            <View>
                <Text>{optionProduct?.name}</Text>
            </View>);

}


export default OptionProductTab;

