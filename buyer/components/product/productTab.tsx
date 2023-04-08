import React, { useState, useEffect } from 'react';
import ReactNative, { StyleSheet, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, Easing, ScrollView } from 'react-native';
import { LocationObject, Order, Product, RootStackParamList } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import { uri } from '../../envVars';
import { StackNavigationProp } from '@react-navigation/stack';
import getSymbolFromCurrency from 'currency-symbol-map'
import { getExpoPushTokenAsync } from 'expo-notifications';


interface Props {
    Product: Product;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>
    thelocation: LocationObject;
    savedOrder:Order | undefined |  null;
    setSelectedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>
}


const ProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [price, setPrice] = useState("" + (props.Product.price.price / 1000).toString());

    const [glowing, setGlowing] = useState(false);
    const [units, setUnits] = useState<undefined | null | number>();

    useEffect(() => {
        if (props.savedOrder)
        {
            console.log(props.savedOrder);
            props.savedOrder.selecedProdcuts.forEach(selectedProduct => {
                if (selectedProduct._id.toString() === props.Product._id.toString())
                {
                    if (units) setUnits(units+1);
                    else setUnits(1);
                    setGlowing(true);
                }
            });
        }  
    }, [props.savedOrder?.selecedProdcuts.length])

    useEffect(() => {

        let symbol = "";
        const thesymb = getSymbolFromCurrency(props.Product.price.currency);
        if (thesymb) {
            symbol = thesymb;
        }

        const sherit = props.Product.price.price % 1000;
        if (!sherit) setPrice(symbol + (props.Product.price.price / 1000).toString() + "." + sherit.toString());
        else setPrice(symbol + (props.Product.price.price / 1000).toString());
    }, [])


    const ProductPressed = () => {
        props.setSelectedProduct(props.Product);
        navigation.navigate("ViewProduct", { id: 3 });

    }

    const GetContent = () => {
        return (
            <TouchableWithoutFeedback onPress={ProductPressed}>
                <View style={ !glowing ? styles.view : styles.viewGlowing}>
                    <View style={styles.TextView}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.title}>{props.Product.name}</Text>
                    {units && <Text style={styles.units}> x {units}</Text>}
                    </View>
                        <Text numberOfLines={2} style={styles.info_text}>{props.Product.info}</Text>
                        <Text style={styles.price_text}>{price}</Text>
                    </View>
                    <Image source={
                        {
                            uri: uri + "data/file/" + props.Product.mainimage,
                            cache: 'force-cache'
                        }} style={styles.image} />
    
                </View>
            </TouchableWithoutFeedback>);
    }

    return GetContent();
}


const styles = StyleSheet.create({
    units:{
        top :0,
    },
    viewGlowing:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        height: 100,
        backgroundColor: "white",
        borderColor:"lightgreen",
        borderWidth:1,
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
        height: 100,
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

export default ProductTab;

