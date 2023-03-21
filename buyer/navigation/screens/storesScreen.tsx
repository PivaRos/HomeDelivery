import { StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { availableStores, LocationObject, Pages } from '../../interfaces';
import StoresGrid from '../../components/stores_grid';


interface Props {
    location:LocationObject;
    Stores:availableStores | null | undefined;
  }

const Stores = (props:Props) => {
return (
    <View style={style.view}>
        <Text>this is stores screen</Text>
    <StoresGrid  title='Available Stores' displayStores={[]} />
    <StoresGrid  title='Closed Stores' displayStores={[]} />
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