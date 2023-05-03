import React, { useState, useEffect } from 'react';
import  { StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Option, RootStackParamList, Store, optionProduct } from '../../../interfaces';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { getTotalUnits } from '../../../functions';



interface Props {
    optionProduct: optionProduct;
    isChecked: boolean;
    optionProductUnits: number[];
    index: number;
    setOptionProductUnits: React.Dispatch<React.SetStateAction<number[]>>
    setOptionProductCheckedState: React.Dispatch<React.SetStateAction<boolean[]>>;
    optionProductCheckedState: boolean[];
    option:Option;
    checkIfNeedUpdate:() => void
    Shake:() => void
}


const OptionProductTab = (props: Props) => {
    const [isChecked, setIsChecked] = useState(props.isChecked);
    const [units, setUnits] = useState(props.optionProductUnits[props.index]);


    useEffect(() => {
        setIsChecked(props.optionProductCheckedState[props.index]);
        setUnits(props.optionProductUnits[props.index]);
    }, [JSON.stringify(props.isChecked), JSON.stringify(props.optionProductUnits[props.index])])

    const CheckBoxPressed = (isChecked: boolean) => {
        if (isChecked)
        {
            //if user wants to check the box
            if ((props.option.additionalAllowed && ((props.option.maxPicks +props.option.additionalMax) > getTotalUnits(props.optionProductUnits))) || !props.option.additionalAllowed && (props.option.maxPicks > getTotalUnits(props.optionProductUnits)))
            {
                setIsChecked(isChecked);
                setChecked(isChecked);
                
            }
            else{
                //"no" animation;
                props.Shake();
            }
        }
        else
        {
            //if user wants to uncheck the box
            setIsChecked(isChecked);
            setChecked(isChecked);   
        }
        
    }

    const setChecked = (isChecked: boolean) => {
        let ToptionProductCheckedState = JSON.parse(JSON.stringify(props.optionProductCheckedState));
        ToptionProductCheckedState[props.index] = isChecked;
        if (isChecked === false) {
            setUnits(0);
            props.setOptionProductUnits(realoptionProductUnits => {
                let Tunits = JSON.parse(JSON.stringify(realoptionProductUnits));
                Tunits[props.index] = 0;
                return Tunits;
            });
        }
        else {
            setUnits(1);
            props.setOptionProductUnits(realoptionProductUnits => {
                let Tunits = JSON.parse(JSON.stringify(realoptionProductUnits));
                Tunits[props.index] = 1;
                return Tunits;
    
            });
        }
        props.setOptionProductCheckedState(ToptionProductCheckedState);
    }

    const changeUnitsUp = async () => {
        if ((props.option.additionalAllowed && ((props.option.maxPicks +props.option.additionalMax) > getTotalUnits(props.optionProductUnits))) || !props.option.additionalAllowed && (props.option.maxPicks > getTotalUnits(props.optionProductUnits)))
        {
            setUnits(realunits => { return realunits + 1 });
            props.setOptionProductUnits(realoptionProductUnits => {
                let Tunits = JSON.parse(JSON.stringify(realoptionProductUnits));
                Tunits[props.index] = Tunits[props.index] + 1;
                return Tunits;
    
            });   
        }
        else{
            //"no" animation
            props.Shake();
        }

    }

    const changeUnitsDown = async () => {
        if (units > 0) {

            if (units - 1 === 0) {
                //nothing
            }
            else {
                setUnits(currentValue => {
                    return currentValue - 1;
                });
                props.setOptionProductUnits(value => {
                    let Tunits = JSON.parse(JSON.stringify(value));
                    Tunits[props.index] = units-1;
                    return Tunits;
                });

            }
        }
    }

    const comp = <View style={{ marginLeft: 6, alignContent: 'center', flexDirection: 'row', width: '100%' }}>
        <Text style={{ textAlign: 'center', fontSize: 17 }}>{props.optionProduct.name}</Text>
        {units > 0 &&
            <View style={styles.PressableUnits}>
                <Pressable style={styles.pressableButton} onPress={changeUnitsUp}>
                    <Text style={styles.buttonText}>+</Text>
                </Pressable>
                <Text style={[styles.unitText]}>{units}</Text>
                <Pressable style={styles.pressableButton} onPress={changeUnitsDown} >
                    <Text style={styles.buttonText}>-</Text>
                </Pressable>
            </View>
        }</View>;

    return (
        <View style={{ padding: 10, marginLeft: 5 }}>
            <BouncyCheckbox
                disableBuiltInState={true}
                isChecked={isChecked}
                fillColor="lightgreen"
                textComponent={comp}
                onPress={() => CheckBoxPressed(!isChecked)}
            /></View>);

}

const styles = StyleSheet.create({

    pressableButton: {
        zIndex: 3,
        padding: 10,
    },
    PressableUnits: {
        right: 50,
        width: 70,
        flexDirection: 'row',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'black',
    },
    unitText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
    },
})



export default OptionProductTab;

