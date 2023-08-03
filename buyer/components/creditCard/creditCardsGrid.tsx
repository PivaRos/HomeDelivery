import { ScrollView, View } from "react-native";

interface CreditCardsGridProps {
  style?: any;
}

export const CreditCardsGrid = ({ ...props }: CreditCardsGridProps) => {
  return <ScrollView style={[props.style, {}]}></ScrollView>;
};
