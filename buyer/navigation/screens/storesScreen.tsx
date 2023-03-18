import { StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { Pages } from '../../interfaces';
import StoresGrid from '../../components/stores_grid';


const Stores = () => {
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