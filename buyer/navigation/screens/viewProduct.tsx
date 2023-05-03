import React, { useState, useEffect, useRef, createRef } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LocationObject, Order, Product, RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductOptionsList } from "../../components/product/options/options_grid";
import { PriceString, getTotalUnits, setOrderSelectedProductByIndex } from "../../functions";


interface Props {
    selectedProduct: Product;
    thelocation: LocationObject;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>;
    savedOrder: Order;
    setSavedOrder: React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    Store: Store;
    indexinSelectedProduct?: number;
}

const imageUri = uri + "data/file/";


export const ViewProduct = (props: Props) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [productPrice, setProductPrice] = useState("");
    const [justChanged, setJustChanged] = useState(false);
    const [Product, setProduct] = useState<Product>(JSON.parse(JSON.stringify(props.selectedProduct)));
    const [price, setPrice] = useState(Product.price.price);
    const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

    
    const itemsRef = useRef<unknown[]>([]);
    // you can access the elements with itemsRef.current[n]
    useEffect(() => {
        if (!Product.options) return;
       itemsRef.current = itemsRef.current.slice(0, Product.options.length);
    }, [Product.options]);




    useEffect(() => {
        //price string
        calculatePriceString();
        if (!Product.units) {
            console.log("changed Units");
            setProduct(p => {
                p.units = 0;
                return p
            })
        }



    }, [])

    useEffect(() => {
        //if the Product is in selectedProducts list then we update the selectedProductIndex
        let found = false;
        let tempindex = -1;
        props.savedOrder.selecedProdcuts.map((p, index) => {
            let pClone: Product = JSON.parse(JSON.stringify(p));
            let currentProductClone: Product = JSON.parse(JSON.stringify(props.selectedProduct));
            if (JSON.stringify(pClone) === JSON.stringify(currentProductClone)) {
                tempindex = index;
                found = true;
            }
        })
        if (found) {
            setSelectedProductIndex(tempindex);
        }
    }, [])

    const calculatePriceString = () => {
        //price string
        setProductPrice(PriceString(price, Product.price.currency));
    }

    useEffect(() => {
        calculatePriceString();
    }, [price])


    useEffect(() => {
        //calculates price
        let pricePerUnit = +Product.price.price;
        if (Product.options) {

            for (let i = 0; i < Product.options?.length; i++) {
                if (Product.options[i].additionalAllowed) {
                    let option = Product.options[i];
                    let maxPicks = +Product.options[i].maxPicks;
                    let OptionTotalPicks = +getTotalUnits(option.selectedOptionProducts?.map((v) => {
                        return v.units
                    }) || []);
                    if (OptionTotalPicks - maxPicks > 0) {

                        pricePerUnit += (OptionTotalPicks - maxPicks) * option.additionalPricePerUnit.price;
                    }
                }
            }
        }
        setPrice(+pricePerUnit * (Product.units || 1))
    }, [Product.units, JSON.stringify(Product)])

    const checkIfNeedUpdate = () => {
        let same = JSON.stringify(props.selectedProduct) === JSON.stringify(Product)
        if (props.selectedProduct.units && !same) {

            setJustChanged(true);
        }
        else {
            setJustChanged(false);
        }
    }





    const canSave = ():boolean => {
        let cantAdd = false;
        let ProblemIndexes:number[] = [];
        Product.options?.map((option, index) => {
            if (option.selectedOptionProducts)
            {
                let totalUnitsOfOption = getTotalUnits(option.selectedOptionProducts.map(p => {
                    return p.units;
                }))
                if (option.mustPicks > totalUnitsOfOption)
                {
                    cantAdd = true;
                    let ref = itemsRef.current[index] as {
                        Shake: () => void;
                    }
                    ref.Shake()
                    //arrayOfShakes[index]();
                    ProblemIndexes.push(index);
                }
            }
        })
        if (cantAdd)
        {
            return false;
        }
        return true;
    }




    const addToOrder = async () => {
        if (canSave()) {
            let foundInOrder = false;
            let theindex = -1;
            //check if the prodcut exists in the current order
            props.savedOrder.selecedProdcuts.map((p, index) => {
                let pClone = JSON.parse(JSON.stringify(p)); pClone.units = 0;
                let currentProductClone = JSON.parse(JSON.stringify(Product)); currentProductClone.units = 0;
                if (JSON.stringify(pClone) === JSON.stringify(currentProductClone)) {
                    theindex = index;
                    foundInOrder = true;
                }
            })
            if (!foundInOrder) {
                //if the product is selected for the first time 
                if (Product.units == 0) {
                    await setProduct(p => {
                        p.units = 1;
                        return p;
                    })
                }
                await props.setSavedOrder(o => {
                    let order: Order = JSON.parse(JSON.stringify(o));
                    order.selecedProdcuts.push(Product);
                    return order;
                })
            }
            else {
                if (Product.units == 0) {
                    await setProduct(p => {
                        p.units = 1;
                        return p;
                    })
                }
                let currentProduct: Product = JSON.parse(JSON.stringify(props.savedOrder.selecedProdcuts[theindex]));
                if (currentProduct.units === undefined || Product.units === undefined) return;
                let cpu = currentProduct.units;
                currentProduct.units = (cpu + Product.units);

                await props.setSavedOrder(o => {
                    let order: Order = JSON.parse(JSON.stringify(o));
                    let neworder = setOrderSelectedProductByIndex(order, currentProduct, theindex);
                    return neworder;
                })
            }
            navigation.navigate("ViewStore", { id: 2 })
        }
    }

    const changeUnitsUp = async () => {
        setProduct(Product => {
            let newProduct: Product = JSON.parse(JSON.stringify(Product));
            if (newProduct.units !== undefined) {
                newProduct.units = newProduct.units + 1;
            }
            else {
                newProduct.units = 1;
            }
            return newProduct
        })
        if (!Product.units) return;
        if (props.selectedProduct.units !== Product.units + 1 && props.selectedProduct.units) {
            setJustChanged(true);
        }
    }

    const changeUnitsDown = async () => {
        if (Product.units !== undefined && Product.units > 0) {
            setProduct(Product => {
                let newProduct: Product = JSON.parse(JSON.stringify(Product));
                if (newProduct.units !== undefined) {
                    newProduct.units = newProduct.units - 1;
                }
                return newProduct
            })
        }
        if (!Product.units) return;
        if (props.selectedProduct.units !== Product.units - 1 && props.selectedProduct.units) {
            setJustChanged(true);
        }
    }

    const RemoveFromOrder = async () => {
        props.setSavedOrder(o => {
            let order: Order = JSON.parse(JSON.stringify(o));
            for (let i = 0; i < order.selecedProdcuts.length; i++) {
                let ps = order.selecedProdcuts[i];
                if (JSON.stringify(ps) === JSON.stringify(Product)) {
                    order.selecedProdcuts.splice(i, 1);


                }
            }

            return order;
        })
        navigation.navigate("ViewStore", { id: 2 })

    }

    const saveOrder = () => {
        if (selectedProductIndex === -1) {
            //the Product is not in selectedProduct list and we need to add to the list for the first time
                //if the product is selected for the first time 
                props.setSavedOrder(o => {
                    let order: Order = JSON.parse(JSON.stringify(o));
                    order.selecedProdcuts.push(Product);
                    return order;
                })
        }
        else {
            props.setSavedOrder(o => {
                let newOrder: Order = JSON.parse(JSON.stringify(o));
                let NewProduct: Product = JSON.parse(JSON.stringify(Product));
                newOrder.selecedProdcuts[selectedProductIndex] = NewProduct;
                return newOrder
            })
        }
        navigation.navigate("ViewStore", { id: 2 });

    }

    return (

        <View style={{ backgroundColor: 'white', height: '100%' }}>

            <View >
                <ScrollView>
                    <Pressable style={styles.backButton} onPress={() => (navigation.navigate("ViewStore", { id: 2 }))}><Text style={styles.backButtonText}>Back</Text></Pressable>
                    <Image style={styles.imageStyle} source={
                        {
                            uri: imageUri + Product?.mainimage,
                            cache: "force-cache"
                        }} />
                    <View style={styles.productInfo}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.productName}>{Product.name}</Text>
                            <Text style={styles.productPrice}>{productPrice}</Text>
                            <Text style={styles.productDesc}>{Product.info}</Text>
                        </View>
                    </View>
                
                    <ScrollView style={[styles.restView, { height: 340, paddingBottom: 10, }]}>
                        {Product.options?.map((option, index) => {
                            return (<ProductOptionsList 
                                ref={el => itemsRef.current[index] = el} 
                                checkIfNeedUpdate={checkIfNeedUpdate} 
                                price={price} setPrice={setPrice} 
                                optionIndex={index} key={index} 
                                selectedProduct={Product} 
                                setSelectedProduct={setProduct} 
                                option={option} 
                                store={props.Store} />)
                        })}
                    </ScrollView>



                </ScrollView>
            </View >
            <View style={styles.PressableUnits}>
                <Pressable style={{ left: 5, position: 'absolute', zIndex: 3 }} onPress={changeUnitsUp}>
                    <Text style={styles.buttonText}>+</Text>
                </Pressable>
                <Text style={[styles.buttonText, { justifyContent: 'center', display: 'flex', flexDirection: 'row', width: '100%', textAlign: 'center' }]}>{Product.units}</Text>
                <Pressable style={{ right: 5, position: 'absolute', zIndex: 3 }} onPress={changeUnitsDown} >
                    <Text style={styles.buttonText}>-</Text>
                </Pressable>
            </View>
            {((props.selectedProduct.units === 0) && !justChanged) && <Pressable onPress={addToOrder} style={styles.PressableAdd}>
                <Text style={styles.buttonText}>Add to order</Text><Text style={styles.buttonPrice}>{productPrice}</Text>
            </Pressable>}
            {(props.selectedProduct.units !== undefined && props.selectedProduct.units !== 0) && (Product.units !== undefined && Product.units > 0 && !justChanged) && <Pressable onPress={RemoveFromOrder} style={[styles.PressableAdd, { backgroundColor: "#fa3737" }]}>
                <Text style={styles.buttonText}>{(Product.units > 1) ? "Remove all" : "Remove"}</Text><Text style={styles.buttonPrice}>{"- " + productPrice}</Text>
            </Pressable>}
            {justChanged && <Pressable onPress={saveOrder} style={styles.PressableAdd}>
                <Text style={styles.buttonText}>Update order</Text>
            </Pressable>}
        </View>
    );
}

const styles = StyleSheet.create({
    restView: {
        marginTop: 180,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    productPrice: {
        fontSize: 18,
        color: '#5C985C',
        padding: 5,
        right: 0
    },
    productDesc: {
        fontSize: 20,
        color: 'grey',
        padding: 5,
    },
    productInfo: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        top: 160,
        padding: 10,
        borderBottomWidth: 1,
    },
    PressableAdd: {
        height: 50,
        width: '60%',
        backgroundColor: "lightgreen",
        bottom: 8,
        borderRadius: 10,
        right: 8,
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    PressableUnits: {
        flexDirection: 'row',
        height: 50,
        width: '35%',
        backgroundColor: "white",
        bottom: 8,
        borderRadius: 10,
        left: 5,
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        top: 0,
        left: 0,
        padding: 15,
        fontWeight: 'bold',
    },
    buttonPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        position: 'absolute',
        right: 0,
        padding: 15,
        top: 0,
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
        top: 0,
        position: 'absolute',
        width: '100%',
        height: 200,
    }
})