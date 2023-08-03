import React from "react";
import { Platform, Pressable, TextStyle, View, Text } from "react-native";
import { directionEnum, textDirection } from "../languageConfig";

interface MultiTabProps {
  title: string;
  subTitle: string;
  IconImage: any;
  IconImageSize: number;
  IconName: string;
  onPress?: () => void;
  IconColor?: string;
  IconStyle?: TextStyle;
}

export const MultiTab = ({
  IconImage,
  title,
  subTitle,
  IconImageSize,
  IconName,
  IconColor,
  IconStyle,
  onPress,
}: MultiTabProps) => {
  const TabClicked = () => {
    console.log("checkoutTab : clicked");
    if (onPress) {
      onPress();
    }
  };

  return (
    <View>
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
      </Pressable>
    </View>
  );
};
