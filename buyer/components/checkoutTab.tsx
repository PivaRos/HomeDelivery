import { View, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import ShakeText from "react-native-shake-text";
import { useEffect, useRef } from "react";

interface CheckoutTabProps {
  title: string;
  subTitle: string;
  IconImage: any;
  IconImageSize: number;
  IconName: string;
  IconColor?: string;
}

export const CheckoutTab = ({
  IconImage,
  title,
  subTitle,
  IconImageSize,
  IconName,
  IconColor,
}: CheckoutTabProps) => {
  const ok = false;

  let shakeRef = useRef<ShakeText>(null).current;

  useEffect(() => {
    if (shakeRef) {
      shakeRef.startShakeAnimation();
    }
  }, [shakeRef]);

  return (
    <View style={{ justifyContent: "center", width: "100%" }}>
      <ShakeText duration={200} ref={(ref) => (shakeRef = ref)}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: 80,
          }}
        >
          <IconImage
            size={IconImageSize}
            name={IconName}
            color={IconColor || "black"}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{title}</Text>
            <Text>{subTitle}</Text>
          </View>
        </View>
        <IconImage />
        <AntDesign
          style={{ position: "absolute", right: 15 }}
          name={ok ? "checkcircle" : "pluscircle"}
          size={28}
        />
      </ShakeText>
    </View>
  );
};
