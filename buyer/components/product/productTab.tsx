import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView } from 'react-native';
import { LocationObject, Order, Product, RootStackParamList, selectedOption } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import { uri } from '../../envVars';
import { StackNavigationProp } from '@react-navigation/stack';
import getSymbolFromCurrency from 'currency-symbol-map'
import { getExpoPushTokenAsync } from 'expo-notifications';
import { PriceString, getTotalUnits, getUnits } from '../../functions';


interface Props {
    Product: Product;
    selectedOptions?: selectedOption[];
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>
    thelocation: LocationObject;
    savedOrder: Order | undefined | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<Order | undefined | null>>
}


const ProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [priceString, setPriceString] = useState("");
    const [glowing, setGlowing] = useState(false);
    const [units, setUnits] = useState<number>(props.Product.units || 0);
    const [price, setPrice] = useState(props.Product.price.price);

    useEffect(() => {
        setPriceString(PriceString(price, props.Product.price.currency));
    }, [price])

    useEffect(() => {
        if (props.savedOrder) {
            const number = props.Product.units;
            if (number && number > 0) {
                setGlowing(true);
            }
            else {
                setGlowing(false);
            }

            setUnits(number || 0);

        }
    }, [])

    useEffect(() => {
        //calculates price
        let pricePerUnit = +props.Product.price.price;
        if (props.Product.options) {

            for (let i = 0; i < props.Product.options?.length; i++) {
                if (props.Product.options[i].additionalAllowed) {
                    let option = props.Product.options[i];
                    let maxPicks = +props.Product.options[i].maxPicks;
                    let OptionTotalPicks = +getTotalUnits(option.selectedOptionProducts?.map((v) => {
                        return v.units
                    }) || []);
                    if (OptionTotalPicks - maxPicks > 0) {

                        pricePerUnit += (OptionTotalPicks - maxPicks) * option.additionalPricePerUnit.price;
                    }
                }
            }
        }
        setPrice(+pricePerUnit * (props.Product.units || 1))
    }, [props.Product.units, JSON.stringify(props.Product)])



    useEffect(() => {

    }, [])


    const ProductPressed = () => {
        props.setSelectedProduct(JSON.parse(JSON.stringify(props.Product)));
        navigation.navigate("ViewProduct", { id: 3 });

    }


    return (
        <TouchableWithoutFeedback onPress={ProductPressed}>
            <View style={!glowing ? styles.view : styles.viewGlowing}>
                <View style={styles.TextView}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}> { props.Product.name }</Text>
                        <View style={styles.units}>
                            {props.Product.units && <View><Text style={{ marginTop:1}}> x </Text></View>}
                            {props.Product.units && <View style={{borderRadius:100, backgroundColor:"lightgreen", minWidth:20, minHeight:20,  aspectRatio:1/1}}><Text style={{textAlign:'center', alignContent:'center', marginTop:1}}>{props.Product.units}</Text></View>}
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.info_text}>{props.Product.info}</Text>
                    <Text style={styles.price_text}>{priceString}</Text>
                </View>
                <Image source={
                    {
                        uri: uri + "data/file/" + props.Product.mainimage,
                        cache: 'force-cache'
                    }} style={styles.image} />

            </View>
        </TouchableWithoutFeedback>);

}


const styles = StyleSheet.create({
    units: {
        flexDirection:'row',
        top: 0,
        
    },
    viewGlowing: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        height: 120,
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: 1,
        alignItems: 'center',

        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    view: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        height: 120,
        backgroundColor: "white",
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    image: {
        height: 80,
        width: 120,
        borderRadius: 8,
        position: 'absolute',
        right: 10,
    },

    title: {
        top: 0,
        position: 'relative',
        fontSize:17,
    },
    TextView: {
        height: '100%',
        padding: 10,
        position: 'absolute',
        width: '65%',
    },
    info_text: {
        top: 10,
        color: 'grey',
    },
    price_text: {
        bottom: 0,
        position: 'absolute',
        padding: 10,
        color: '#5C985C',
    }
});

export default ProductTab;

