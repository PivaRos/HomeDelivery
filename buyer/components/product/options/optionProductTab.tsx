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
        setUnits(units-1);
        if (units === 0){
            setChecked(false);
        }
        else
        {
            let Tunits = props.units;
            Tunits[props.index] = units;
            props.setUnits(Tunits);
        }

    }




    //update current isChecked
    useEffect(() => {
        setIsChecked(props.isChecked);
    }, [props.isChecked])

    const comp = <View style={{marginLeft:6, alignContent:'center', flexDirection:'row', width:'100%'}}>
        <Text style={{textAlign:'center', fontSize:17}}>{props.optionProduct.name}</Text>
    {units > 0 && 
        <View style={styles.PressableUnits}>
        <Pressable style={{left:5, position:'absolute',   zIndex:3}} onPress={changeUnitsUp}>
                <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Text style={[styles.buttonText, {justifyContent:'center', display:'flex', flexDirection:'row', width:'100%', textAlign:'center'}]}>{units}</Text>
        <Pressable style={{right:5, position:'absolute', zIndex:3}} onPress={changeUnitsDown} >
                <Text style={styles.buttonText}>-</Text>
        </Pressable>
        </View>
    }</View>;

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
    PressableUnits:{
        right:40,
        width:60,
        flexDirection:'row',
        position:'absolute'
    },
    buttonText:{
        fontSize:16,
    },

    Conteintor: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 'auto',
    }
})



export default OptionProductTab;

