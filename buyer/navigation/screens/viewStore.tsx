import React, {useState, useEffect} from "react";
import {View, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Store } from "../../interfaces";

interface Props {
    Store:Store | undefined
}
export const ViewStore = (props:Props) => {
    const navigation = useNavigation();
    return (
        <View style={{backgroundColor:'white', height:'100%'}}>
            <Text>{props.Store?.name}</Text>
            <Button title="Back" onPress={() => navigation.navigate("tabs", {})}/>
            <Text>this is viewstore page</Text>
        </View>
    );
}