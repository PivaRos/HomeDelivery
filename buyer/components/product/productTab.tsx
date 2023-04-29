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
    selectedOptions?:selectedOption[];
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>
    thelocation: LocationObject;
    savedOrder:Order | undefined |  null;
    setSelectedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>
}


const ProductTab = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [priceString, setPriceString] = useState("");
    const [Product, setProduct] = useState<Product>(props.Product);
    const [glowing, setGlowing] = useState(false);
    const [units, setUnits] = useState<number>(props.Product.units || 0);
    const [price, setPrice] = useState(Product.price.price);

    useEffect(() => {
        setPriceString(PriceString(price, Product.price.currency));
    }, [price])

    useEffect(() => {
        if (props.savedOrder)
        {
           const number =  Product.units;
           if (number && number > 0)
           {
                setGlowing(true);
           }
           else
           {
                setGlowing(false);
           }

           setUnits(number || 0);
           
        }
    }, [])

    useEffect(() => {
        //calculates price
        let pricePerUnit = +Product.price.price;
        if (Product.options)
        {

            for(let i = 0; i< Product.options?.length;i++)
            {
                if (Product.options[i].additionalAllowed)
                {
                let option = Product.options[i];
                let maxPicks = +Product.options[i].maxPicks;
                let OptionTotalPicks = +getTotalUnits(option.selectedOptionProducts?.map((v) => {
                    return v.units
                }) || []);
                if(OptionTotalPicks-maxPicks > 0)
                {

                    pricePerUnit += (OptionTotalPicks-maxPicks)*option.additionalPricePerUnit.price;
                }
                }
            }
        }
        setPrice(+pricePerUnit*(Product.units || 1))
    }, [Product.units, JSON.stringify(Product)])


    useEffect(() => {
        console.log("productTab: product Changed");
    }, [JSON.stringify(Product)])

    useEffect(() => {

    }, [])


    const ProductPressed = () => {
        props.setSelectedProduct(Product);
        navigation.navigate("ViewProduct", { id: 3 });

    }

    const GetContent = () => {
        if (units){
        return (
            <TouchableWithoutFeedback onPress={ProductPressed}>
                <View style={ !glowing ? styles.view : styles.viewGlowing}>
                    <View style={styles.TextView}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.title}>{Product.name}</Text>
                    <Text style={styles.units}> x {units}</Text>
                    </View>
                        <Text numberOfLines={2} style={styles.info_text}>{Product.info}</Text>
                        <Text style={styles.price_text}>{priceString}</Text>
                    </View>
                    <Image source={
                        {
                            uri: uri + "data/file/" + Product.mainimage,
                            cache: 'force-cache'
                        }} style={styles.image} />
    
                </View>
            </TouchableWithoutFeedback>);
        }
        else
        {
            return (
                <TouchableWithoutFeedback onPress={ProductPressed}>
                    <View style={ !glowing ? styles.view : styles.viewGlowing}>
                        <View style={styles.TextView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.title}>{Product.name}</Text>
                        </View>
                            <Text numberOfLines={2} style={styles.info_text}>{Product.info}</Text>
                            <Text style={styles.price_text}>{priceString}</Text>
                        </View>
                        <Image source={
                            {
                                uri: uri + "data/file/" + Product.mainimage,
                                cache: 'force-cache'
                            }} style={styles.image} />
        
                    </View>
                </TouchableWithoutFeedback>);
        }
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

