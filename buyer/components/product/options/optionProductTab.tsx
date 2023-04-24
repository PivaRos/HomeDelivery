import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Store, optionProduct } from '../../../interfaces';
import { ObjectId } from 'mongodb';
import BouncyCheckbox from 'react-native-bouncy-checkbox';


interface Props {
    optionProduct:optionProduct;
    isChecked:boolean;
    units:number[];
    index:number;
    setUnits:React.Dispatch<React.SetStateAction<number[]>>
    setOptionProductCheckedState:React.Dispatch<React.SetStateAction<boolean[]>>;
    optionProductCheckedState:boolean[];
}


const OptionProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [isChecked, setIsChecked] = useState(props.isChecked);
    const [units, setUnits ] = useState(props.units[props.index]);

    const CheckBoxPressed = (isChecked:boolean) => {
        setIsChecked(isChecked);
        setChecked(isChecked);
    }

    


    const setChecked = (isChecked:boolean) => {
        let ToptionProductCheckedState = props.optionProductCheckedState;
        ToptionProductCheckedState[props.index] = isChecked;
        if (!isChecked)
        {
            let Tunits = props.units;
            setUnits(0);
            Tunits[props.index] = 0;
            props.setUnits(Tunits);
        }
        else{
            setUnits(1);
            let Tunits = props.units;
            Tunits[props.index] = 1;
            props.setUnits(Tunits);
        }
        props.setOptionProductCheckedState(ToptionProductCheckedState);
    }

    const changeUnitsUp = async () => {
        setUnits(units+1);
        let Tunits = props.units;
        Tunits[props.index] = units;
        props.setUnits(Tunits);
    }

    const changeUnitsDown = async () => {
        if (units === 0){
            setChecked(false);
        }
        else
        {
            setUnits(units-1);
            let Tunits = props.units;
            Tunits[props.index] = units;
            props.setUnits(Tunits);
        }

    }




    //update current isChecked
    useEffect(() => {
        setIsChecked(props.isChecked);
    }, [props.isChecked])

    const comp = <View style={{marginLeft:6}}>{units > 0 && <View style={styles.PressableUnits}>
    <Pressable style={{left:5, position:'absolute', zIndex:3}} onPress={changeUnitsUp}>
            <Text style={styles.buttonText}>+</Text>
    </Pressable>
    <Text style={[styles.buttonText, {justifyContent:'center', display:'flex', flexDirection:'row', width:'100%', textAlign:'center'}]}>{units}</Text>
    <Pressable style={{right:5, position:'absolute', zIndex:3}} onPress={changeUnitsDown} >
            <Text style={styles.buttonText}>-</Text>
    </Pressable>
    </View>}<Text>{props.optionProduct.name}</Text></View>;

    return (
        <View style={{padding:5, marginLeft:5}}>
        <BouncyCheckbox isChecked={isChecked}
        fillColor="lightgreen"
        textComponent={comp}
        onPress={(isChecked) => CheckBoxPressed(isChecked)}
        /></View>);

}

const styles = StyleSheet.create({
    restView:{
        marginTop:180,
    },
    productName:{
        fontSize:24,
        fontWeight:'bold'
    },
    productPrice:{
        fontSize:18,
        color: '#5C985C',
        padding:5,
        right:0
    },
    productDesc:{
        fontSize:20,
        color: 'grey',
        padding:5,
    },
    productInfo:{
        justifyContent:'center',
        display:'flex',
        flexDirection:'row',
        width:'100%',
        top:160,
        padding:10,
        borderBottomWidth:1,
    },
    PressableAdd:{
        height:50,
        width:'60%',
        backgroundColor:"lightgreen",
        bottom:8,
        borderRadius:10,
        right:8,
        position:'absolute',
        shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    },
    PressableUnits:{
        flexDirection:'row',
        height:50,
        backgroundColor:"white",
        borderRadius:10,
        position:'absolute',   
    },
    buttonText:{
        fontSize:12,
        top:0,
        left:0,
        padding:15,
        fontWeight:'bold',
    },
    buttonPrice:{
        fontSize:16,
        fontWeight:'bold',
        position:'absolute',
        right:0,
        padding:15,
        top:0,
    },
    backButton: {
        zIndex: 3,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: 'lightgreen',
        height: 40,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        top: 10,
        left: 0
    },
    backButtonText: {
        fontSize: 16,
        color: 'black'
    },
    Conteintor: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 'auto',
    },
    imageStyle: {
        top:0,
        position:'absolute',
        width:'100%',
        height:200,
    }
})



export default OptionProductTab;

