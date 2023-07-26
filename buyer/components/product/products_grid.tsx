import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { LocationObject, Order, Product, Store } from "../../interfaces";
import ProductTab from "./productTab";

interface Props {
  title: string;
  displayProducts: Product[] | null | undefined;
}
const ProductsGrid = (props: Props) => {
  useEffect(() => {}, [JSON.stringify(props.displayProducts)]);

  const GetContent = () => {
    return (
      <View style={{ marginTop: 50 }}>
        <Text style={styles.title}>{props.title}</Text>
        <ScrollView style={styles.view}>
          {props.displayProducts &&
            props.displayProducts.map((product, index) => {
              return <ProductTab key={index} Product={product} />;
            })}
        </ScrollView>
      </View>
    );
  };

  return GetContent();
};

const styles = StyleSheet.create({
  view: {},

  title: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ProductsGrid;
