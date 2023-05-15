import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Pressable, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { DeliveryFee, PriceString, getDistance, getPricePerUnit, toDateTime } from "../../functions";
import ProductsGrid from "../../components/product/products_grid";
import getSymbolFromCurrency from "currency-symbol-map";
import { SvgXml } from "react-native-svg";
import ShakeText from "react-native-shake-text";

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

    const timeSvg = '<svg height="48" fill="black" viewBox="0 96 960 960" width="48"><path d="m627 769 45-45-159-160V363h-60v225l174 181ZM480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-82 31.5-155t86-127.5Q252 239 325 207.5T480 176q82 0 155 31.5t127.5 86Q817 348 848.5 421T880 576q0 82-31.5 155t-86 127.5Q708 913 635 944.5T480 976Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480 236q-140 0-240 100T140 576q0 140 100 240t240 100Z"/></svg>'
    const DistanceSvg = '<svg fill="black" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M240 936 87 783l153-153 49 49-69 69h520l-69-69 49-49 153 153-153 153-49-49 69-69H220l69 69-49 49ZM99 521v-13q0-21.081 11.408-38.649Q121.816 451.784 142 443q25.078-10.522 51.603-16.261Q220.128 421 249.064 421t55.417 5.739Q330.963 432.478 356 443q20.184 8.784 31.592 26.351Q399 486.919 399 508v13H99Zm462 0v-13q0-21.081 11.408-38.649Q583.816 451.784 604 443q25.078-10.522 51.603-16.261Q682.128 421 711.064 421t55.417 5.739Q792.963 432.478 818 443q20.184 8.784 31.592 26.351Q861 486.919 861 508v13H561ZM248.956 366Q218 366 196 343.956q-22-22.045-22-53Q174 260 196.044 238q22.045-22 53-22Q280 216 302 238.044q22 22.045 22 53Q324 322 301.956 344q-22.045 22-53 22Zm462 0Q680 366 658 343.956q-22-22.045-22-53Q636 260 658.044 238q22.045-22 53-22Q742 216 764 238.044q22 22.045 22 53Q786 322 763.956 344q-22.045 22-53 22Z"/></svg>'

    

const imageUri = uri + "data/file/";
export const ViewStore = (props: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [OpenDateString, setOpenDateString] = useState("");
    const [CloseDateString, setCloseDateString] = useState("");
    const [displayProducts, setDisplayProducts] = useState<Product[]>(props.Store.products);
    const [arrayOfProducts, setArrayOfProducts] = useState<string[]>([]);

    const DistanceKm : number = getDistance(props.Store.location, props.thelocation);

    let ShakeRef = useRef<ShakeText>();
    let shakeLayoutY = 0;

    let ScrollViewRef = useRef<ScrollView>();

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
        let newarrayOfProducts = JSON.parse(JSON.stringify(arrayOfProducts));
        props.Store.products.map((product) => {
            const index = newarrayOfProducts.indexOf(product.category);
            if (index === -1) {
                newarrayOfProducts.push(product.category);
            }
        })
        setArrayOfProducts(newarrayOfProducts);
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

    const TotalPrice = () => {
        let price = 0;
         props.savedOrder?.selecedProdcuts.map((p) => {
           price += getPricePerUnit(p)*(p.units ||1)
        });
        return price
    }

    const canViewOrder = () => {
        if (props.Store.minOrder)
        {
            if (props.Store.minOrder.price > TotalPrice())
            {
                if (ShakeRef.current)
                {
                    ScrollViewRef.current?.scrollTo({animated:true, y:shakeLayoutY})
                    ShakeRef.current.startShakeAnimation()
                }
            }
            else{
            navigation.navigate('ViewOrder', {id:4})
                
            }
        }
        else{
            navigation.navigate('ViewOrder', {id:4})
        }
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
           <Animated.View style={[
            {
                transform:[
                {translateY:ImageTranslate},
                ],
                position:'absolute',
                top:0,
            }
           ,styles.imageStyle]}>
           <Animated.Image style={[styles.imageStyle, {
                transform:[
                    
                    {scale:imageScale}
                ]
           }]} source={{
            uri: imageUri + props.Store?.logo,
            cache: "force-cache"}} />
            <View style={{flexDirection:'row', position:'absolute', 
                top:160, left:10}}>
                <View onLayout={(e) => {
                  shakeLayoutY = e.nativeEvent.layout.y;
                }} style={styles.imageText}><ShakeText TextComponent={Text} duration={200} ref={(ref: ShakeText) => (ShakeRef.current = ref)}  style={{padding:2}}>{props.Store.minOrder && "Min Order: " + PriceString(props.Store.minOrder?.price, props.Store.minOrder?.currency) || "Min Order: 0"+getSymbolFromCurrency("ILS")}</ShakeText></View>
                <View style={styles.imageText}><Text  style={{padding:2}} >Delivery: {PriceString(DeliveryFee(DistanceKm), "ILS")}</Text></View>
            </View>
            </Animated.View>
            <ScrollView ref={(ref:ScrollView) => {ScrollViewRef.current = ref}} snapToOffsets={[0, 150]} snapToEnd={false} scrollEventThrottle={16} onScroll={(event) => {
               scrollOffsetY.setValue(event.nativeEvent.contentOffset.y);
            }} stickyHeaderHiddenOnScroll={true} style={{marginBottom:60}}>
                <View style={styles.Conteintor}>
                    

                    <Animated.View style={[styles.storeInfo, {opacity:opacityOff}]}>
                        { DistanceKm > 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}><SvgXml style={{ height:16, marginTop:-2}} height={16} width={16}  xml={timeSvg}/> {" "+ OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}><SvgXml style={{ height:16, marginTop:-3, paddingRight:10}} height={16} width={16}  xml={DistanceSvg}/> {" "+Math.round(getDistance(props.Store.location, props.thelocation)) + " km"}</Text></View>}
                        { DistanceKm < 1 &&  <View style={styles.detailsView}><Text style={styles.detailsText}><SvgXml style={{ height:16}} height={16} width={16}  xml={timeSvg}/>{OpenDateString + " - " + CloseDateString}</Text><Text style={styles.detailsText}><SvgXml style={{ height:16, marginTop:-3,  paddingRight:10}} height={16} width={16}  xml={DistanceSvg}/> {" "+Math.round(getDistance(props.Store.location, props.thelocation))*1000 + " m"}</Text></View>}
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
                displayProducts={localproducts} 
                setSelectedProduct={props.setSelectedProduct} />})}
                </ScrollView>
            </View>
            {(props.savedOrder  && (props.savedOrder.selecedProdcuts.length > 0 )) && 
                <Pressable onPress={ canViewOrder} style={styles.ViewOrderButton}>
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
    }, 
    imageText:{
        padding:5,
        backgroundColor:'lightgreen',
        borderRadius:10,
        marginRight:15
    }
})