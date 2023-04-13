import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, Store, selectedOption } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductOptionsList } from "../../components/product/options/options_grid";
import getSymbolFromCurrency from "currency-symbol-map";
import { ObjectId } from "mongodb";
import { RemoveOrAddFromOrder, getOccurrence } from "../../functions";


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
    const [selectedOptions, setSelectedOptions] = useState<selectedOption[] | null | undefined>(props.Product.selectedOptions);
    const [units, setUnits] = useState(0);
    const [justChanged, setJustChanged] = useState(false);


    const addToPrice = (amount: number) => {
        setProductPrice(productPrice + amount);
    }

    useEffect(() => {


        //price string
        let symbol = "";
        const thesymb = getSymbolFromCurrency(props.Product.price.currency);
        if (thesymb) {
            symbol = thesymb;
        }
        const sherit = props.Product.price.price % 1000;
        if (!sherit) setProductPrice(symbol + (props.Product.price.price / 1000).toString() + "." + sherit.toString());
        else setProductPrice(symbol + (props.Product.price.price / 1000).toString());
        
        
        //get unit of product
        if (props.savedOrder?.selecedProdcuts)
        {
            const newarray = props.savedOrder.selecedProdcuts.map((value) => {
                return value._id;
            })
            const units =  getOccurrence(newarray, props.Product._id);

            setUnits(units);
        }
    }, [])


    useEffect(() => {
        console.log("changed : " + selectedOptions);
    }, [selectedOptions])


    const addToOrder = () => {
        var previousOrder = props.savedOrder;
        if (previousOrder)
        {
            
           const result = RemoveOrAddFromOrder(1, props.setSavedOrder, props.savedOrder, props.Product)
            if (result)
            {
                navigation.navigate("ViewStore", {id:2});
            }
        }
        else
        {
            console.log("bug");
            navigation.navigate("ViewStore", {id:2});
        }
    }

    const changeUnitsUp = () => {

    if (props.savedOrder)
    {
        
    const result = RemoveOrAddFromOrder(1, props.setSavedOrder, props.savedOrder, props.Product);
    if (result)
    {
    setUnits(units+1);
    setJustChanged(true);  
    }}
    else
    {
        console.log("bug");
         
    }
}


    const changeUnitsDown = () => {
        if (units > 0)
        {
            
            let product1 = props.Product;
            product1.selectedOptions = selectedOptions;
            props.setSelectedProduct(product1);
            const result =  RemoveOrAddFromOrder(0, props.setSavedOrder, props.savedOrder, props.Product);
            if (result)
            {
            setUnits(units-1);
            setJustChanged(true);
            }

        }
        
    }


    const RemoveAllFromOrder = () => {
        if (!props.savedOrder) return;
        const savedOrder1 = props.savedOrder;
        const tempArray = [];
        for (let i = 0; i < props.savedOrder.selecedProdcuts.length; i++)
        {

          if (JSON.stringify(savedOrder1.selecedProdcuts[i]) !== JSON.stringify(props.Product))
          {
            tempArray.push(props.savedOrder.selecedProdcuts[i]);
        }
        }
        savedOrder1.selecedProdcuts = tempArray;
        props.setSavedOrder(savedOrder1);
        navigation.navigate("ViewStore", {id:2});
        
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
            </View >
            <View  style={styles.PressableUnits}>
            <Pressable style={{left:5, position:'absolute', zIndex:3}} onPress={changeUnitsUp}>
                    <Text style={styles.buttonText}>+</Text>
            </Pressable>
            <Text style={[styles.buttonText, {justifyContent:'center', display:'flex', flexDirection:'row', width:'100%', textAlign:'center'}]}>{units}</Text>
            <Pressable style={{right:5, position:'absolute', zIndex:3}} onPress={changeUnitsDown} >
                    <Text style={styles.buttonText}>-</Text>
            </Pressable>
            </View>
            {((units===0) && !justChanged) && <Pressable onPress={addToOrder} style={styles.PressableAdd}>
                    <Text style={styles.buttonText}>Add to order</Text><Text style={styles.buttonPrice}>{productPrice}</Text>
            </Pressable>}
            {((units > 0) && !justChanged) && <Pressable onPress={RemoveAllFromOrder} style={[styles.PressableAdd, {backgroundColor:"#fa3737"}]}>
                    <Text style={styles.buttonText}>{(units > 1) ? "Remove all" : "Remove"}</Text><Text style={styles.buttonPrice}>{"- "+productPrice}</Text>
            </Pressable>}
            {(justChanged) && <Pressable onPress={() => {setJustChanged(false), navigation.navigate("ViewStore", {id:2})}} style={styles.PressableAdd}>
                    <Text style={styles.buttonText}>Update order</Text>
            </Pressable>}
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
        flexDirection:'row',
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