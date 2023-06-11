import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView } from 'react-native';
import { Order, Product, RootStackParamList, selectedOption } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import { uri } from '../../envVars';
import { StackNavigationProp } from '@react-navigation/stack';
import getSymbolFromCurrency from 'currency-symbol-map'
import { getExpoPushTokenAsync } from 'expo-notifications';
import { PriceString, getTotalUnits } from '../../functions';


interface Props {
    Product: Product;
}


const ProductSumTab = (props: Props) => {
    const [price, setPrice] = useState(props.Product.price.price);
    const [priceString, setPriceString] = useState(PriceString(price * (props.Product.units || 1), props.Product.price.currency));
    const [selectedOptionsString, setSelectedOptionsString] = useState<string>("");


    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();





    useEffect(() => {
        setPriceString(PriceString(price, props.Product.price.currency));
    }, [price])


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

    const ProductPressed = () => {

    }


    return (
        <TouchableWithoutFeedback onPress={ProductPressed}>
            <View style={styles.view}>
                <View style={styles.TextView}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title}>{props.Product.name}</Text>
                    </View>
                    <Text style={{ marginTop: 5, color: "grey" }} numberOfLines={4}>
                        {selectedOptionsString}
                    </Text>
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
        top: 0,
    },
    viewGlowing: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        height: 100,
        backgroundColor: "white",
        borderColor: "lightgreen",
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: "lightgreen",
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
        textAlign: 'center',
        width: '100%',
        position: 'relative',
        fontWeight: 'bold',
    },
    TextView: {
        height: '100%',
        padding: 10,
        position: 'absolute',
        width: '65%',
    },
    info_text: {
        top: 6,
        color: 'grey',
    },
    price_text: {
        bottom: 0,
        position: 'absolute',
        padding: 10,
        color: '#5C985C',
    }
});

export default ProductSumTab;

