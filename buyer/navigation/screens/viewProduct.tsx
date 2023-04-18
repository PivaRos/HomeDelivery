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
    const [justChanged, setJustChanged] = useState(false);
    const [Product, setProduct] = useState(props.Product);
    const [units, setUnits] = useState(0);
    const [indexForSavedOrder, setIndexSavedOrder] = useState(-1);

    useEffect(() => {


        //price string
        calculatePriceString();
       
        GetIndex();

        if (Product.units !== undefined )
        {
            let u = units;
            u = Product.units;
            setUnits(u);
        }

    }, [])


    const GetIndex = () => {
        props.savedOrder.selecedProdcuts.forEach((p, index) => {
            if (JSON.stringify(p) === JSON.stringify(props.Product))
            {
               setIndexSavedOrder(index); 
                
            }
        }
        );
    }


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
        let saved1 = props.savedOrder;
        let p = Product;
        p.units = 1;
        saved1.selecedProdcuts.push(Product);
        props.setSavedOrder(saved1);
        props.setSelectedProduct(undefined);
        navigation.navigate("ViewStore", {id:2});
    }

    const changeUnitsUp = async () => {
        // change in local list
        console.log("pressed Up");
        let p = Product;
        if (units === 0 )
        {
            // change in local list
            console.log("units was 0")
            await setUnits(1);
            console.log("units is "+ units);
            p.units = units;
            await setProduct(p);
            setJustChanged(true);
        }
        else
        { 
            let u = units;
            // change in local list
            await setUnits(u+1);  
            p.units = u+1;
            await setProduct(p);
            setJustChanged(true);
        }

        
    }


    useEffect(() => {

        console.log("product changed in viewProduct");
    }, [JSON.stringify(Product)])


    const changeUnitsDown = async () => {
        let u = units;
        if (!units || units <= 0) return
        // change in local list
        await setUnits(u-1);  
        let p = Product;
        p.units = units;
        await setProduct(p);
        setJustChanged(true);
    }
    


    const RemoveFromOrder = async () => {
        if (!props.savedOrder) return;
        //remove from local list
        let u = units;
        u = 0;
        await setUnits(u);
        let p = Product;
        p.units = u;
        setProduct(p);
        saveOrder();
    }

   const saveOrder = async () => {
        setJustChanged(false)
        //save product state to savedOrder;
        var order = props.savedOrder;
        if (units === 0)
        {

            order.selecedProdcuts.splice(indexForSavedOrder, 1);
            await  props.setSavedOrder(order);
            await  props.setSelectedProduct(undefined);
            navigation.navigate("ViewStore", {id:2})
        }
        else
        {
            order.selecedProdcuts[indexForSavedOrder] = Product;
            await props.setSavedOrder(order);
            await props.setSelectedProduct(undefined);
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
                    <ScrollView style={[styles.restView, {height:340, paddingBottom:10,}]}>
                     {props.Product.options?.map((option, index) => {
                        return (<ProductOptionsList units={units} justChanged={justChanged} setJustChanged={setJustChanged} key={index} Product={Product} setProduct={setProduct} option={option} store={props.Store} />)
                    })}  
                    </ScrollView>
  


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
            {(units !== undefined && units > 0 && !justChanged)  && <Pressable onPress={RemoveFromOrder} style={[styles.PressableAdd, {backgroundColor:"#fa3737"}]}>
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