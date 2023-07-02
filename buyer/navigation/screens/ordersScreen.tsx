import { StyleSheet, Text, TextInput, View  } from 'react-native';
import * as React from 'react'
import { availableStores, Pages } from '../../interfaces';
import * as Location from 'expo-location';
import { StackRouter } from '@react-navigation/native';
import { Fumi, Akira } from 'react-native-textinput-effects';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


interface Props {
    location:Location.LocationObject;
  }

const OrdersScreen = (props:Props) => {
return (
    <View>
        <Text style={[ styles.title,{left:0, width:"100%", fontSize:22, padding:2}]}>Request Delivery {"(:"}</Text>
        <View style={{width:'100%', justifyContent:'center', flexDirection:'row'}}>
            <View style={{width:"70%"}}>
                <Fumi 
                iconName='warehouse'
                iconColor='green'
                style={{direction:'rtl',margin:2}} 
                iconClass={FontAwesome5} 
                label='מאיפה ?'
                blurOnSubmit={true}
                inputPadding={16}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={"green"}
                />


                <Fumi
                iconName='delivery-dining'
                dataDetectorTypes={'address'} 
                iconColor='green'
                style={{direction:'rtl',margin:2}} 
                iconClass={MaterialIcons} 
                label='לאן ?'
                blurOnSubmit={true}
                inputPadding={16}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={"green"}
                
                
                />
            </View>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    title:{
        fontSize:22 ,
        marginLeft:10,
        marginTop:10,
        fontFamily:'AmericanTypewriter',
        fontWeight:'bold'
        
    }, 
    TextInputStyle: {
        direction:'rtl',
        width:"50%",
        textAlign:'center',
        borderColor:'black', 
        borderWidth:1,
        padding:5,
        borderRadius:30
        
    }
})

export default OrdersScreen;