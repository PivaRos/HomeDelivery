import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { getDistance, toDateTime } from "../../functions";
import ProductsGrid from "../../components/product/products_grid";

interface Props {
    Store: Store;
    thelocation: LocationObject;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
    savedOrder:Order | null | undefined;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
}

const imageUri = uri + "data/file/";
export const ViewStore = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [OpenDateString, setOpenDateString] = useState("");
    const [CloseDateString, setCloseDateString] = useState("");
    const [displayProducts, setDisplayProducts] = useState<Product[]>(props.Store.products);
    const [arrayOfProducts, setArrayOfProducts] = useState<string[]>([]);

    const DistanceKm : number = getDistance(props.Store.location, props.thelocation);

    const scrollOffsetY = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        const OpenDate = toDateTime(props.Store.openHoursObject.openFrom).toLocaleTimeString().split(":");

        if (props.Store.openHoursObject.closedFrom > 86400) props.Store.openHoursObject.closedFrom -= 86400
        const CloseDate = toDateTime(props.Store.openHoursObject.closedFrom).toLocaleTimeString().split(":");


        setOpenDateString(OpenDate[0] + ":" + OpenDate[1]);
        setCloseDateString(CloseDate[0] + ":" + CloseDate[1]);



        if (!props.savedOrder || JSON.stringify(props.savedOrder.seller) !== JSON.stringify(props.Store._id))
        {
            //Create new order
            let neworder: Order =  {
                buyer:undefined,
                city:undefined,
                date:{
                    date:new Date(),
                    timestamp:Math.floor(Date.now() / 1000)
                },
                homenumber:undefined,
                location:props.thelocation,
                selecedProdcuts:[],
                seller:props.Store._id,
                status:1,
                street:undefined,
                totalPrice:{
                    price:0,
                    currency:"ILS"
                },
                zipcode:undefined
            }
            
            props.setSavedOrder(neworder);
        }
        else
        {
        }

        props.Store.products.map((product) => {
            const index = arrayOfProducts.indexOf(product.category);
            if (index === -1) {
                arrayOfProducts.push(product.category);
            }
        })
        let varia= arrayOfProducts;
        setArrayOfProducts(varia);
        //just to let react know

    }, [])

    useEffect(() => {
        let newDisplayProducts:Product[] = JSON.parse(JSON.stringify(props.Store.products));
        let selectedProductOrder:Product[] = JSON.parse(JSON.stringify(props.savedOrder?.selecedProdcuts || []))
        setDisplayProducts(newDisplayProducts.concat(selectedProductOrder))
        }, [JSON.stringify(props.savedOrder?.selecedProdcuts)])



    const BackPress = () => {
        navigation.navigate("tabs", { id: 1 })
    }

    return (

        <View style={{ backgroundColor: 'white', height:'100%', justifyContent:'center', flexDirection:'row' }}>
            <View>
            <Pressable style={styles.backButton} onPress={BackPress}><Text style={styles.backButtonText}>Back</Text></Pressable>
            <ScrollView stickyHeaderHiddenOnScroll={true} style={{marginBottom:60}}>
                <View style={styles.Conteintor}>
                    <Image style={styles.imageStyle} source={
                        {
                            uri: imageUri + props.Store?.logo,
                            cache: "force-cache"

                        }} />
                    <View style={styles.storeInfo}>
                        <Text style={styles.StoreName}>{props.Store?.name}</Text>
                        { DistanceKm > 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}>{Math.round(getDistance(props.Store.location, props.thelocation)) + " km"}</Text></View>}
                        { DistanceKm < 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}>{Math.round(getDistance(props.Store.location, props.thelocation))*1000 + " m"}</Text></View>}
                    </View>
                </View>
                {arrayOfProducts.map((categoryname, index) => {
                if (!displayProducts) return 
                let localproducts = new Array<Product>();
                for (let i = 0; i < displayProducts?.length; i++) {
                    if (displayProducts[i].category === categoryname) {
                        localproducts.push(displayProducts[i]);
                    }
                }
                return <ProductsGrid 
                savedOrder={props.savedOrder} 
                setSavedOrder={props.setSavedOrder} 
                key={index} 
                title={categoryname} 
                thelocation={props.thelocation}  
                displayProducts={displayProducts} 
                setSelectedProduct={props.setSelectedProduct} />})}
                </ScrollView>
            </View>
            {(props.savedOrder  && (props.savedOrder.selecedProdcuts.length > 0 )) && 
                <Pressable onPress={() => (navigation.navigate('ViewOrder', {id:4}))} style={styles.ViewOrderButton}>
                    <Text style={{width:'100%', textAlign:'center', top:6, fontSize:16, fontWeight:'bold'}}>View Order</Text>
                </Pressable>}
        </View>
    );
}

const styles = StyleSheet.create({
    ViewOrderButton:{
        flexDirection:'row',
        height:50,
        width:'90%',
        padding:10,
        backgroundColor:"lightgreen",
        textAlign:'center',
        bottom:8,
        borderRadius:10,
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
    backButton: {
        position:'absolute',
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
    },
    detailsView: {
        display: 'flex',
        flexDirection: 'row',

    },
    detailsText: {
        marginRight: 5,
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
    },
    StoreName: {
        fontSize: 18,
    },
    ProductsView: {
        height: 'auto',
        width: '100%',
        backgroundColor: 'red'
    },
    storeInfo: {
        width: "100%",
        padding: 10,
        marginTop: 200,
    },
    imageStyle: {
        position: 'absolute',
        top: 0,
        height: 200,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: '100%'
    }
})