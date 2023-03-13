import { StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { Pages } from '../../interfaces';


const Stores = () => {
return (
    <View style={style.view}>
        <Text>this is stores screen</Text>
    </View>
);
}

const style = StyleSheet.create({
    view:{
        width:'100%',
        height:'100%',
        display:'flex',
        justifyContent:'center',
        flexDirection:'row'
    }
})

export default Stores;