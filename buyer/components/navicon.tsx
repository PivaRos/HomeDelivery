import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { Pages } from "../interfaces";

interface Props {
  svgicon: string;
}

const Navicon = (props: Props) => {
  const styles = StyleSheet.create({
    navicon: {
      paddingTop: 5,
    },
  });

  const [clicked, setClicked] = useState(false);
  return (
    <View style={styles.navicon}>
      <SvgXml
        style={{
          height: 30,
          width: 30,
        }}
        xml={props.svgicon}
      />
    </View>
  );
};

export default Navicon;
