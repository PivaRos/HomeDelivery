import { View, Text } from "react-native";
import { PriceString } from "../functions";

interface BillingTabProps {
  description: string;
  amount: number;
  currency: string;
  additionalText?: string;
}

export const BillingTab = ({ ...props }: BillingTabProps) => {
  const priceString = PriceString(props.amount, props.currency);
  return (
    <View
      style={{
        width: "100%",
        height: 45,
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <Text style={{ right: 15, position: "absolute", fontSize: 16 }}>
        {priceString}
      </Text>
      <Text style={{ left: 15, position: "absolute", fontSize: 16 }}>
        {props.description} <Text>{props.additionalText}</Text>
      </Text>
    </View>
  );
};
