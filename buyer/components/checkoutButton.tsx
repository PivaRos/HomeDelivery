import { View, Text, Pressable } from "react-native";

interface CheckoutBottonProps {
  mainText: string;
  subText?: string;
  onPress: () => any | void;
}

export const CheckoutBotton = ({ ...props }: CheckoutBottonProps) => {
  return (
    <View
      style={{
        height: 65,
        backgroundColor: "lightgrey",
        margin: "5%",
        width: "90%",
        borderRadius: 10,
      }}
    >
      <Pressable
        onPress={props.onPress}
        style={{
          justifyContent: "center",
          height: 65,
        }}
      >
        <Text
          style={[
            {
              fontSize: 18,
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
            },
            props.subText ? { padding: 5 } : {},
          ]}
        >
          {props.mainText}
        </Text>
        {props.subText && (
          <Text
            style={[
              { width: "100%", textAlign: "center" },
              props.subText ? { padding: 5 } : {},
            ]}
          >
            {props.subText}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
