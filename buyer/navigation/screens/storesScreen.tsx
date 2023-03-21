import { StyleSheet, Text, View  } from 'react-native';
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
        <Text>this is stores screen</Text>
    <StoresGrid  title='Available Stores' displayStores={props.Stores?.Open} />
    <StoresGrid  title='Closed Stores' displayStores={props.Stores?.Closed} />
    </View>
);
}

const style = StyleSheet.create({
    view:{
        width:'100%',
        height:'100%',
        
    }
})

export default Stores;