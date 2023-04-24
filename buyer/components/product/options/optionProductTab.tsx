import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Store } from '../../../interfaces';
import { ObjectId } from 'mongodb';
import BouncyCheckbox from 'react-native-bouncy-checkbox';


interface Props {
    
}


const OptionProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isChecked, setIsChecked] = useState(false);
    const [units, setUnits ] = useState(0);
    const CheckBoxPressed = () => {

    }

    const comp = <View><Text>asdasdas</Text></View>;

    return (
        <View style={{padding:5, marginLeft:5}}>
        <BouncyCheckbox isChecked={isChecked}
        fillColor="lightgreen"
        textComponent={comp}
        onPress={() => CheckBoxPressed()}
        /></View>);

}



export default OptionProductTab;

