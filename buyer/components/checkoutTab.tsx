import { View, Text, Pressable, TextStyle, Platform } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import ShakeText from "react-native-shake-text";
import { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { directionEnum, textDirection } from "../languageConfig";

interface CheckoutTabProps {
  title: string;
  subTitle: string;
  IconImage: any;
  IconImageSize: number;
  IconName: string;
  ok: boolean;
  IconColor?: string;
  IconStyle?: TextStyle;
}

export const CheckoutTab = ({
  IconImage,
  title,
  subTitle,
  IconImageSize,
  IconName,
  IconColor,
  ok,
  IconStyle,
}: CheckoutTabProps) => {
  const navigation = useNavigation();

  let shakeRef = useRef<ShakeText>(null).current;

  useEffect(() => {
    if (!ok) {
      setTimeout(() => {
        if (shakeRef) shakeRef.startShakeAnimation();
      }, 800);
    }
  }, [shakeRef]);

  const TabClicked = () => {
    console.log("clicked");
  };

  return (
    <ShakeText
      TextComponent={View}
      duration={120}
      animationValue={12}
      ref={(ref) => (shakeRef = ref)}
    >
      <Pressable
        onPress={() => TabClicked()}
        style={[
          {
            justifyContent: "center",
            width: "95%",
            height: 80,
            shadowColor: "#000",
            backgroundColor: "white",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            margin: "2.5%",
            borderRadius: 5,
            shadowRadius: 5.46,

            elevation: 9,
          },
          textDirection === directionEnum.RTL
            ? {
                direction: "rtl",
              }
            : {},
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: 80,
          }}
        >
          <IconImage
            style={[
              IconStyle ? { ...IconStyle } : {},
              Platform.OS === "android"
                ? {
                    padding: 15,
                    paddingTop: 25,
                  }
                : {
                    padding: 33,
                    margin: 0,

                    paddingRight: textDirection === directionEnum.RTL ? 10 : 10,
                    paddingLeft: textDirection === directionEnum.RTL ? 10 : 10,
                  },
            ]}
            size={IconImageSize}
            name={IconName}
            color={IconColor || "black"}
          />
          <View
            style={[
              {
                height: "100%",
                justifyContent: "center",
                top: 8,
              },
              textDirection === directionEnum.RTL
                ? {
                    direction: "rtl",
                  }
                : {},
            ]}
          >
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: 16,
                },
                textDirection === directionEnum.RTL
                  ? {
                      textAlign: "left",
                    }
                  : {},
              ]}
            >
              {title}
            </Text>
            <Text>{subTitle}</Text>
          </View>
        </View>
        <AntDesign
          style={{
            position: "absolute",
            right: 0,
            padding: 33,
            paddingRight: textDirection === directionEnum.RTL ? 15 : 5,
            paddingLeft: textDirection === directionEnum.RTL ? 5 : 15,
          }}
          name={ok ? "checkcircle" : "pluscircle"}
          color={ok ? "green" : "grey"}
          size={24}
        />
      </Pressable>
    </ShakeText>
  );
};
