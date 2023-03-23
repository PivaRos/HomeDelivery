import React, {useState, useEffect} from "react";
import {View, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {

}
export const ViewStore = (props:Props) => {
    const navigation = useNavigation();
    return (
        <View style={{backgroundColor:'white', height:'100%'}}>
            <Button title="Back" onPress={() => navigation.navigate("tabs", {})}/>
            <Text>this is viewstore page</Text>
        </View>
    );
}