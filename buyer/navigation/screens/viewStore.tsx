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

    enum Extarpolate {
        clamp="clamp",
        extend= "extend",
        identity = "identity"

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

    const opacityChange = scrollOffsetY.interpolate({
        inputRange:[100, 150],
        outputRange:[0, 1]
    })

    const opacityOff = scrollOffsetY.interpolate({
        inputRange:[0,20],
        outputRange:[1,0]
    })

    const TransformText = scrollOffsetY.interpolate({
        inputRange:[50, 150],
        outputRange:[10, 78],
        extrapolateLeft:Extarpolate.clamp,
        extrapolateRight:Extarpolate.clamp
    })
    const TransformTextY = scrollOffsetY.interpolate({
        inputRange:[0,60, 150],
        outputRange:[210, 150, 20],
        extrapolateRight:Extarpolate.clamp,
        extrapolateLeft:Extarpolate.clamp,
    })

    const TransformTextScale = scrollOffsetY.interpolate({
        inputRange:[0,60, 150],
        outputRange:[1, 0.95, 1.05],
        extrapolateRight:Extarpolate.clamp,
        extrapolateLeft:Extarpolate.clamp,
    })


    const ImageTranslate = scrollOffsetY.interpolate({
        inputRange:[0, 200],
        outputRange:[0, -200],
        extrapolateLeft:Extarpolate.clamp
    })


    const imageScale = scrollOffsetY.interpolate({
        inputRange:[-100, 0],
        outputRange:[1.2, 1],
        extrapolateRight:Extarpolate.clamp
    })


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
            <Animated.Text style={[styles.StoreName, {
                            transform:[
                                {translateX:TransformText},
                                {translateY:TransformTextY},
                                {scale:TransformTextScale}
                            ],
                            zIndex:3
                            
            }]}>{props.Store?.name}</Animated.Text>
           <Animated.View style={{
            opacity:opacityChange,
            backgroundColor:'white',
            height:60,
            width:'100%',
            position:'absolute',
            zIndex:2
           }}></Animated.View>
           <Pressable style={styles.backButton} onPress={BackPress}><Text style={styles.backButtonText}>Back</Text></Pressable>
           <Animated.Image style={[styles.imageStyle, {
                transform:[
                    {translateY:ImageTranslate},
                    {scale:imageScale}
                ]
           }]} source={{
            uri: imageUri + props.Store?.logo,
            cache: "force-cache"}} />

            <ScrollView snapToOffsets={[0, 150]} scrollEventThrottle={16} onScroll={(event) => {
               scrollOffsetY.setValue(event.nativeEvent.contentOffset.y);
            }} stickyHeaderHiddenOnScroll={true} style={{marginBottom:60}}>
                <View style={styles.Conteintor}>
                    
                    <Animated.View style={[styles.storeInfo, {opacity:opacityOff}]}>
                        { DistanceKm > 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}>{Math.round(getDistance(props.Store.location, props.thelocation)) + " km"}</Text></View>}
                        { DistanceKm < 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}>{Math.round(getDistance(props.Store.location, props.thelocation))*1000 + " m"}</Text></View>}
                    </Animated.View>
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
    },
    detailsText: {
        marginTop:6,
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