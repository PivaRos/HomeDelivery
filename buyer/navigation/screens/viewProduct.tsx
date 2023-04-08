import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, SelectedProduct, Store, selectedOption } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductOptionsList } from "../../components/product/options/options_grid";
import getSymbolFromCurrency from "currency-symbol-map";
import { ObjectId } from "mongodb";

interface Props {
    Product: Product,
    thelocation: LocationObject
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>
    savedOrder: undefined | null | Order
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>
    Store: Store
}

const imageUri = uri + "data/file/";


export const ViewProduct = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [uiOrder, setUiOrder] = useState(props.savedOrder);
    const [productPrice, setProductPrice] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<selectedOption[] | null | undefined>();


    const addToPrice = (amount: number) => {
        setProductPrice(productPrice + amount);
    }

    useEffect(() => {

        let symbol = "";
        const thesymb = getSymbolFromCurrency(props.Product.price.currency);
        if (thesymb) {
            symbol = thesymb;
        }

        const sherit = props.Product.price.price % 1000;
        if (!sherit) setProductPrice(symbol + (props.Product.price.price / 1000).toString() + "." + sherit.toString());
        else setProductPrice(symbol + (props.Product.price.price / 1000).toString());



    }, [])

    const addToOrder = () => {
        //need to add animation
        console.log(props.savedOrder);
        let previousOrder = props.savedOrder;
        if (previousOrder != undefined)
        {
        let newSelectedProduct:SelectedProduct = {
            _id:props.Product._id,
            options:selectedOptions
        }
        previousOrder.selecedProdcuts.push(newSelectedProduct);
        props.setSavedOrder(previousOrder);
        navigation.navigate("ViewStore", {id:2});
        }
        else
        {
            let newSelectedProduct:SelectedProduct = {
                _id:props.Product._id,
                options:selectedOptions
            }
            let neworder: Order =  {
                buyer:undefined,
                city:undefined,
                date:{
                    date:new Date(),
                    timestamp:Math.floor(Date.now() / 1000)
                },
                homenumber:undefined,
                location:props.thelocation,
                selecedProdcuts:[newSelectedProduct],
                seller:props.Store._id,
                status:1,
                street:undefined,
                totalPrice:{
                    price:props.Product.price.price,
                    currency:"ILS"
                },
                zipcode:undefined
            }
            neworder.selecedProdcuts.push(newSelectedProduct);
            props.setSavedOrder(neworder);
            navigation.navigate("ViewStore", {id:2});
        }
    }

    return (

        <View style={{ backgroundColor: 'white', height: '100%' }}>
            
                <View >
                <ScrollView>
                    <Pressable style={styles.backButton} onPress={() => (navigation.navigate("ViewStore", { id: 2 }))}><Text style={styles.backButtonText}>Back</Text></Pressable>
                    <Image style={styles.imageStyle} source={
                        {
                            uri: imageUri + props.Product?.mainimage,
                            cache: "force-cache"
                        }} />
                    <View style={styles.productInfo}>
                        <View style={{alignItems:'center'}}>
                        <Text  style={styles.productName}>{props.Product.name}</Text>                        
                        <Text style={styles.productPrice}>{productPrice}</Text>
                        <Text style={styles.productDesc}>{props.Product.info}</Text>
                        </View>
                    </View>
                    <View style={styles.restView}>
                     {props.Product.options?.map((option, index) => {
                        return (<ProductOptionsList key={index} addToPrice={addToPrice} option={option} store={props.Store} />)
                    })}  
                    </View>
  


            </ScrollView>
            </View>
            <Pressable style={styles.PressableUnits}>
                    <Text style={styles.buttonText}>+  1   -</Text>
            </Pressable>
            <Pressable onPress={addToOrder} style={styles.PressableAdd}>
                    <Text style={styles.buttonText}>Add to order</Text><Text style={styles.buttonPrice}>{productPrice}</Text>
            </Pressable>
        </View>
    );
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
        height:50,
        width:'35%',
        backgroundColor:"white",
        bottom:8,
        borderRadius:10,
        left:5,
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
    buttonText:{
        fontSize:16,
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