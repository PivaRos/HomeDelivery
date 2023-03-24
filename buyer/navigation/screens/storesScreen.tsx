import { StyleSheet, Text, View, ScrollView  } from 'react-native';
import React, {useEffect, useState} from 'react'
import { availableStores, LocationObject, Pages } from '../../interfaces';
import StoresGrid from '../../components/stores_grid';
import { storeActions } from '../../hooks/stores';


interface Props {
    location:LocationObject;
    Stores:availableStores | null | undefined;
    setAvailableStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
  }

const Stores = (props:Props) => {

    useEffect(() => {
       (async () => {
        props.setAvailableStores(await storeActions.GetStores(props.location));
        })();
    }, [])


return (
    <View style={style.view}>
    <Text style={style.title}>The Way For Delivery {"(:"}</Text>
    <ScrollView>
    <StoresGrid  title='Available Stores' displayStores={props.Stores?.Open} />
    <StoresGrid  title='Closed Stores' displayStores={props.Stores?.Closed} />
    </ScrollView>
    </View>
);
}

const style = StyleSheet.create({
    view:{
        width:'100%',
        height:'100%',
        
    },

    title:{
        fontSize:19 ,
        textAlign:'center',
        marginTop:5,
        fontFamily:"Inter-Black"
    }
})

export default Stores;