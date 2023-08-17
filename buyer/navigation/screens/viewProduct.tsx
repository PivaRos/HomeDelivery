import React, { useState, useEffect, useRef, createRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Order, Product, RootStackParamList, Store } from "../../interfaces";
import { uri } from "../../envVars";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProductOptionsList } from "../../components/product/options/options_grid";
import { getTotalUnits, setOrderSelectedProductByIndex } from "../../functions";
import { userActions } from "../../network_services/user";
import { LocationObject } from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { SavedOrderAction } from "../../redux/actions/SavedOrderAction";
import {
  addProductToOrderText,
  directionEnum,
  removeAllText,
  removeText,
  updateOrderText,
} from "../../languageConfig";
import { useProductPrice } from "../../hooks/useProductPrice";

const imageUri = uri + "data/file/";

export const ViewProduct = () => {
  const Dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const savedOrder = useSelector((state: any) => state.savedOrder) as Order;
  const selectedProduct = useSelector(
    (state: any) => state.selectedProduct
  ) as Product;
  const selectedStore = useSelector(
    (state: any) => state.selectedStore
  ) as Store;

  const [justChanged, setJustChanged] = useState(false);
  const [Product, setProduct] = useState<Product>(
    JSON.parse(JSON.stringify(selectedProduct))
  );
  const { productPrice, price, setPrice } = useProductPrice(Product);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);

  const [dataSourceCords, setDataSourceCords] = useState([] as number[]);

  let scrollViewRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<unknown[]>([]);
  // you can access the elements with itemsRef.current[n]
  useEffect(() => {
    if (!Product.options) return;
    itemsRef.current = itemsRef.current.slice(0, Product.options.length);
  }, [Product.options]);

  useEffect(() => {
    if (!Product.units) {
      setProduct((p) => {
        p.units = 0;
        return p;
      });
    }
  }, []);

  useEffect(() => {
    //if the Product is in selectedProducts list then we update the selectedProductIndex
    let found = false;
    let tempindex = -1;
    savedOrder.selecedProdcuts.map((p, index) => {
      let pClone: Product = JSON.parse(JSON.stringify(p));
      let currentProductClone: Product = JSON.parse(
        JSON.stringify(selectedProduct)
      );
      if (JSON.stringify(pClone) === JSON.stringify(currentProductClone)) {
        tempindex = index;
        found = true;
      }
    });
    if (found) {
      setSelectedProductIndex(tempindex);
    }
  }, []);

  const checkIfNeedUpdate = () => {
    let same = JSON.stringify(selectedProduct) === JSON.stringify(Product);
    if (selectedProduct.units && !same) {
      setJustChanged(true);
    } else {
      setJustChanged(false);
    }
  };

  const canSave = (): boolean => {
    let cantAdd = false;
    let ProblemIndexes: number[] = [];
    Product.options?.map((option, index) => {
      if (option.selectedOptionProducts) {
        let totalUnitsOfOption = getTotalUnits(
          option.selectedOptionProducts.map((p) => {
            return p.units;
          })
        );
        if (option.mustPicks > totalUnitsOfOption) {
          cantAdd = true;
          let ref = itemsRef.current[index] as {
            Shake: () => void;
          };
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              animated: true,
              y: dataSourceCords[index],
            });
          }
          ref.Shake();

          //arrayOfShakes[index]();
          ProblemIndexes.push(index);
        }
      }
    });
    if (cantAdd) {
      return false;
    }
    return true;
  };

  const addToOrder = async () => {
    if (canSave()) {
      let foundInOrder = false;
      let theindex = -1;
      //check if the prodcut exists in the current order
      savedOrder.selecedProdcuts.map((p, index) => {
        let pClone = JSON.parse(JSON.stringify(p));
        pClone.units = 0;
        let currentProductClone = JSON.parse(JSON.stringify(Product));
        currentProductClone.units = 0;
        if (JSON.stringify(pClone) === JSON.stringify(currentProductClone)) {
          theindex = index;
          foundInOrder = true;
        }
      });
      if (!foundInOrder) {
        //if the product is selected for the first time
        if (Product.units == 0) {
          await setProduct((p) => {
            p.units = 1;
            return p;
          });
        }
        let order: Order = JSON.parse(JSON.stringify(savedOrder));
        order.selecedProdcuts.push(Product);
        Dispatch(SavedOrderAction(order));
      } else {
        if (Product.units == 0) {
          await setProduct((p) => {
            p.units = 1;
            return p;
          });
        }
        let currentProduct: Product = JSON.parse(
          JSON.stringify(savedOrder.selecedProdcuts[theindex])
        );
        if (currentProduct.units === undefined || Product.units === undefined)
          return;
        let cpu = currentProduct.units;
        currentProduct.units = cpu + Product.units;

        let order: Order = JSON.parse(JSON.stringify(savedOrder));
        let neworder = setOrderSelectedProductByIndex(
          order,
          currentProduct,
          theindex
        );
        Dispatch(SavedOrderAction(neworder));
      }
      navigation.navigate("ViewStore", { id: 2 });
    }
  };

  const changeUnitsUp = async () => {
    setProduct((Product) => {
      let newProduct: Product = JSON.parse(JSON.stringify(Product));
      if (newProduct.units !== undefined) {
        newProduct.units = newProduct.units + 1;
      } else {
        newProduct.units = 1;
      }
      return newProduct;
    });
    if (!Product.units) return;
    if (selectedProduct.units !== Product.units + 1 && selectedProduct.units) {
      setJustChanged(true);
    }
  };

  const changeUnitsDown = async () => {
    if (Product.units !== undefined && Product.units > 0) {
      setProduct((Product) => {
        let newProduct: Product = JSON.parse(JSON.stringify(Product));
        if (newProduct.units !== undefined) {
          newProduct.units = newProduct.units - 1;
        }
        return newProduct;
      });
    }
    if (!Product.units) return;
    if (selectedProduct.units !== Product.units - 1 && selectedProduct.units) {
      setJustChanged(true);
    }
  };

  const RemoveFromOrder = async () => {
    try {
      let order: Order = JSON.parse(JSON.stringify(savedOrder));
      for (let i = 0; i < order.selecedProdcuts.length; i++) {
        let ps = order.selecedProdcuts[i];
        if (selectedProductIndex !== -1) {
          order.selecedProdcuts.splice(selectedProductIndex, 1);
          await Dispatch(SavedOrderAction(order));
          navigation.navigate("ViewStore", { id: 2 });
        }
      }
    } catch {}
  };

  const saveOrder = () => {
    if (canSave()) {
      if (selectedProductIndex === -1) {
        //the Product is not in selectedProduct list and we need to add to the list for the first time
        //if the product is selected for the first time
        if (!Product.options) return;
        let order: Order = JSON.parse(JSON.stringify(savedOrder));
        order.selecedProdcuts.push(Product);
        Dispatch(SavedOrderAction(order));
      } else {
        let newOrder: Order = JSON.parse(JSON.stringify(savedOrder));
        let NewProduct: Product = JSON.parse(JSON.stringify(Product));
        newOrder.selecedProdcuts[selectedProductIndex] = NewProduct;
        Dispatch(SavedOrderAction(newOrder));
      }
      navigation.navigate("ViewStore", { id: 2 });
    }
  };

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate("ViewStore", { id: 2 })}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <ScrollView
        ref={(ref) => (scrollViewRef.current = ref)}
        scrollEventThrottle={16}
        pagingEnabled={true}
        style={[styles.restView, { marginBottom: 60 }]}
      >
        <Image
          style={styles.imageStyle}
          source={{
            uri: imageUri + Product?.mainimage,
            cache: "force-cache",
          }}
        />
        <View style={styles.productInfo}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.productName}>{Product.name}</Text>
            <Text style={styles.productPrice}>{productPrice}</Text>
            <Text style={styles.productDesc}>{Product.info}</Text>
          </View>
        </View>
        <View style={{ marginTop: 200 }}>
          {Product.options?.map((option, index) => {
            return (
              <ProductOptionsList
                positionsArray={dataSourceCords}
                setPositionsArray={setDataSourceCords}
                ref={(el) => (itemsRef.current[index] = el)}
                checkIfNeedUpdate={checkIfNeedUpdate}
                price={price}
                setPrice={setPrice}
                optionIndex={index}
                key={index}
                selectedProduct={Product}
                setSelectedProduct={setProduct}
                option={option}
                store={selectedStore}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.PressableUnits}>
        <Pressable
          style={{ left: 5, position: "absolute", zIndex: 3 }}
          onPress={changeUnitsUp}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Text
          style={[
            styles.buttonText,
            {
              justifyContent: "center",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              textAlign: "center",
            },
          ]}
        >
          {Product.units}
        </Text>
        <Pressable
          style={{ right: 5, position: "absolute", zIndex: 3 }}
          onPress={changeUnitsDown}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
      </View>
      {selectedProduct.units === 0 && !justChanged && (
        <Pressable onPress={addToOrder} style={styles.PressableAdd}>
          <View
            style={{
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <View
              style={{
                width: "100%",
                padding: 15,
              }}
            >
              <Text style={{ textAlign: "right" }}>
                {addProductToOrderText}
              </Text>

              <Text
                style={{
                  textAlign: "left",
                  left: 10,
                  top: 15,
                  position: "absolute",
                  width: "100%",
                }}
              >
                {productPrice}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
      {selectedProduct.units !== undefined &&
        selectedProduct.units !== 0 &&
        Product.units !== undefined &&
        Product.units > 0 &&
        !justChanged && (
          <Pressable
            onPress={RemoveFromOrder}
            style={[styles.PressableAdd, { backgroundColor: "#fa3737" }]}
          >
            <View style={{ justifyContent: "center", height: "100%" }}>
              <View
                style={{
                  width: "100%",
                  position: "absolute",
                  justifyContent: "center",
                  direction: directionEnum.RTL ? "rtl" : "ltr",
                  flexDirection: "row",
                }}
              >
                <Text>
                  <Text style={[styles.buttonText]}>
                    {Product.units > 1 ? removeAllText : removeText}
                  </Text>
                  <Text style={[styles.buttonPrice]}>
                    {"- " + productPrice}
                  </Text>
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      {justChanged && (
        <Pressable onPress={saveOrder} style={styles.PressableAdd}>
          <Text style={styles.buttonText}>{updateOrderText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  restView: {
    height: "100%",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 18,
    color: "#5C985C",
    padding: 5,
    right: 0,
  },
  productDesc: {
    fontSize: 20,
    color: "grey",
    padding: 5,
  },
  productInfo: {
    height: 120,
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    top: 200,
    padding: 10,
    borderBottomWidth: 1,
  },
  PressableAdd: {
    height: 50,
    width: "60%",
    backgroundColor: "lightgreen",
    bottom: 8,
    borderRadius: 10,
    right: 8,
    position: "absolute",
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
    flexDirection: "row",
    height: 50,
    width: "35%",
    backgroundColor: "white",
    bottom: 8,
    borderRadius: 10,
    left: 5,
    position: "absolute",
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
    fontWeight: "bold",
  },
  buttonPrice: {
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    right: 0,
    padding: 15,
    top: 0,
  },
  backButton: {
    position: "absolute",
    zIndex: 3,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "lightgreen",
    height: 40,
    width: 55,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    top: 10,
    left: 0,
  },
  backButtonText: {
    fontSize: 16,
    color: "black",
  },
  Conteintor: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "auto",
  },
  imageStyle: {
    top: 0,
    position: "absolute",
    width: "100%",
    transform: [{ scale: 1 }],
    height: 200,
  },
});
