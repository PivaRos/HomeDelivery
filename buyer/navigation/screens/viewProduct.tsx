import React, { useState, useEffect } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, Store, selectedOption } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductOptionsList } from "../../components/product/options/options_grid";
import getSymbolFromCurrency from "currency-symbol-map";
import { ObjectId } from "mongodb";
import { RemoveOrAddFromOrder, getUnits } from "../../functions";


interface Props {
    Product: Product;
    thelocation: LocationObject;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
    savedOrder: Order;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    Store: Store;
    indexinSelectedProduct?:number;
}

const imageUri = uri + "data/file/";


export const ViewProduct = (props: Props) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [productPrice, setProductPrice] = useState("");
    const [units, setUnits] = useState(props.Product.units || 0);
    const [justChanged, setJustChanged] = useState(false);
    const [Product, setProduct] = useState(props.Product);
    const [indexForSavedOrder, setIndexSavedOrder] = useState(-1);

    useEffect(() => {


        //price string
        calculatePriceString();
       
        GetIndex();




    }, [])

    useEffect(() => {
        if (props.savedOrder)
        {
            setUnits(props.Product.units || 0);
            setProduct(props.Product);
        }
    }, [JSON.stringify(props.savedOrder?.selecedProdcuts)])


    const GetIndex = () => {
        props.savedOrder.selecedProdcuts.forEach((p, index) => {
            if (JSON.stringify(p) === JSON.stringify(props.Product))
            {
                setIndexSavedOrder(index); 
            }
        }
        );
    }

    useEffect(() => {
        let p = Product;
        p.units = units;
        setProduct(p);
    }, [units])

    const calculatePriceString = () => {
        //price string
        let symbol = "";
        const thesymb = getSymbolFromCurrency(props.Product.price.currency);
        if (thesymb) {
            symbol = thesymb;
        }
        const sherit = props.Product.price.price % 1000;
        if (!sherit) setProductPrice(symbol + (props.Product.price.price / 1000).toString() + "." + sherit.toString());
        else setProductPrice(symbol + (props.Product.price.price / 1000).toString());
    }



    const addToOrder = () => {
        //saved to savedorder;
        const saved1 = props.savedOrder;
        Product.units = 1;
        saved1.selecedProdcuts.push(Product);
        props.setSavedOrder(saved1);
        navigation.navigate("ViewStore", {id:2});
    }

    const changeUnitsUp = () => {
        // change in local list
        if (units === 0)
        {
            const saved1 = props.savedOrder;
            Product.units = 1;
            setUnits(1);
            saved1.selecedProdcuts.push(Product);
            props.setSavedOrder(saved1);
            GetIndex();
            setJustChanged(true);
        }
        else
        {
            setUnits(units+1);
            setJustChanged(true);  
        }

        
    }


    const changeUnitsDown = () => {
        if (units <= 0) return;
        // change in local list
        let units1 = units;
        setUnits(units1-1); 
        setJustChanged(true);
    }
    


    const RemoveFromOrder = async () => {
        if (!props.savedOrder) return;
        //remove from local list

       await setUnits(0);
        saveOrder();
    }

   const saveOrder = () => {
        setJustChanged(false)
        //save product to savedOrder;
        if (Product.units == 0)
        {
            var order = props.savedOrder;
            order.selecedProdcuts.splice(indexForSavedOrder, 1);
            props.setSavedOrder(order);
            navigation.navigate("ViewStore", {id:2})
        }
        else{
        var order = props.savedOrder;
        order.selecedProdcuts[indexForSavedOrder] = Product;
        props.setSavedOrder(order);
        navigation.navigate("ViewStore", {id:2})
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
                        return (<ProductOptionsList justChanged={justChanged} setJustChanged={setJustChanged} key={index} Product={Product} setProduct={setProduct} option={option} store={props.Store} />)
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
            {((units > 0) && !justChanged) && <Pressable onPress={RemoveFromOrder} style={[styles.PressableAdd, {backgroundColor:"#fa3737"}]}>
                    <Text style={styles.buttonText}>{(units > 1) ? "Remove all" : "Remove"}</Text><Text style={styles.buttonPrice}>{"- "+productPrice}</Text>
            </Pressable>}
            {(justChanged) && <Pressable onPress={saveOrder} style={styles.PressableAdd}>
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