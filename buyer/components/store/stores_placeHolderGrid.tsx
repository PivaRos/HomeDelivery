import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";

interface Props {
  title: string;
}

export const StoresPlacaHolderGrid = (props: Props) => {
  return (
    <View style={{ marginTop: 50 }}>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 200,
  },

  title: {
    paddingLeft: 10,
    fontWeight: "bold",
  },
});
