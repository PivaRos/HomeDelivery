import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Product, Store, Option } from "../../../interfaces";
import OptionProductTab from "./optionProductTab";
import { GetOptionProduct, PriceString, getTotalUnits } from "../../../functions";
import ShakeText from "react-native-shake-text";

interface Props {
    option: Option;
    optionIndex: number;
    store: Store;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product>>;
    selectedProduct: Product;
    setPrice:React.Dispatch<React.SetStateAction<number>>;
    price:number;
    checkIfNeedUpdate:() => void
    setPositionsArray:React.Dispatch<React.SetStateAction<number[]>>
    positionsArray:number[];
}



export const ProductOptionsList = forwardRef((props: Props, ref:React.ForwardedRef<unknown>) => {
    const [optionProductCheckedState, setOptionProductCheckedState] = useState<boolean[]>(props.option.optionProducts.map(() => { return false }));
    const [optionProductUnits, setOptionProductUnits] = useState<number[]>(props.option.optionProducts.map(() => {
        return 0;
    }));
    let ShakeRef = useRef<ShakeText>();

    useImperativeHandle(ref, () => ({
        // methods connected to `ref`
        Shake:() => Shake()
      }), [])

    useEffect(() => {


        if (props.option.selectedOptionProducts && props.option.selectedOptionProducts.length > 0) //if product is not default *
        {
            // need to update checkedState 
            setOptionProductCheckedState(props.option.selectedOptionProducts.map((v) => {
                return v.selected;
            }))
            // need to update units
            setOptionProductUnits(props.option.selectedOptionProducts.map((v) => {
                return v.units;
            }))
        }
    }, [])




    const Shake = () => {
        ShakeRef.current?.startShakeAnimation();
    }

    const getLimitString = (): string => {
        if (!props.option.mustPicks)
        {
            if (props.option.additionalAllowed && props.option.maxPicks+props.option.additionalMax > 1)
            {
                return `ניתן לבחור עד ${props.option.maxPicks+props.option.additionalMax} פריטים ${props.option.maxPicks} בחינם `
            }
            if (!props.option.additionalAllowed && props.option.maxPicks > 1)
            {
                return `ניתן לבחור עד ${props.option.maxPicks} פריטים בחינם`
            }
            if (!props.option.additionalAllowed && props.option.maxPicks === 1)
            {
                return `ניתן לבחור עד פריט אחד בחינם`
            }
        }
        else{
            if (props.option.mustPicks === 1)
            {
                return `חובה לבחור לפחות פריט אחד`
            }
            if (props.option.mustPicks > 1)
            {
                return `חובה לבחור לפחות ${props.option.maxPicks} פריטים`
            }
        }
        return "";
    }


    useEffect(() => {
        let option = props.option;
        option.selectedOptionProducts = option.optionProducts.map((v, index) => {
            return {
                selected: optionProductCheckedState[index],
                units: optionProductUnits[index]
            };
        })
        let TselectedProduct = JSON.parse(JSON.stringify(props.selectedProduct));
        if (TselectedProduct.options) {
            TselectedProduct.options[props.optionIndex] = option;
        }
        props.setSelectedProduct(TselectedProduct);
        props.checkIfNeedUpdate();

    }, [JSON.stringify(optionProductCheckedState), JSON.stringify(optionProductUnits)])

    return (<View style={styles.mainGrid} onLayout={(event) => {
       const layout =  event.nativeEvent.layout;
        let array = JSON.parse(JSON.stringify(props.positionsArray));
        array[props.optionIndex] = layout.y;
        props.setPositionsArray(array);
       layout.y
    }}>
        <Text style={{ fontWeight: 'bold', padding: 5, paddingLeft: 15, }}>{props.option.name}</Text>
        <ShakeText
            duration={100} 
            TextComponent={Text}
            ref={(ref: ShakeText) => (ShakeRef.current = ref)} 
            style={{ padding: 2, color: "grey", paddingLeft: 13, }}>
            {getTotalUnits(optionProductUnits) > props.option.maxPicks && PriceString(props.option.additionalPricePerUnit.price*(getTotalUnits(optionProductUnits) - props.option.maxPicks), props.option.additionalPricePerUnit.currency) +" + "} {getLimitString()}
        </ShakeText>
        {props.option.optionProducts.map((OptionProduct, index) => {
            return <OptionProductTab Shake={Shake} checkIfNeedUpdate={props.checkIfNeedUpdate} option={props.option} optionProductCheckedState={optionProductCheckedState} optionProductUnits={optionProductUnits} setOptionProductUnits={setOptionProductUnits} isChecked={optionProductCheckedState[index]} setOptionProductCheckedState={setOptionProductCheckedState} key={index} index={index} optionProduct={GetOptionProduct(props.store, OptionProduct)} />
        })}
    </View>);
})

const styles = StyleSheet.create({
    mainGrid: {
        width: '100%',
    },
    ChooseText: {
        top: -7,
        color: 'grey',
        left: 5,
    },
    optionName: {
        padding: 10,
        fontWeight: 'bold',
    },
})