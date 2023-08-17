import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { availableStores, Pages } from "../../interfaces";
import LoginScreen from "react-native-login-screen";
import BottomDrawer, {
  BottomDrawerMethods,
} from "react-native-animated-bottom-drawer";
import {
  directionEnum,
  emailText,
  passwordText,
  textDirection,
} from "../../languageConfig";
import { FcGoogle } from "react-icons/fc";
import { SvgXml } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface Props {
  Stores: availableStores | null | undefined;
}

const Account = () => {
  const navigation = useNavigation();

  const LoginDrawerRef = useRef<BottomDrawerMethods>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const CheckIfNeedToOpen = async () => {
    const sessionid = await AsyncStorage.getItem("sessionid");
    console.log(sessionid);
    if (!sessionid) {
      LoginDrawerRef.current?.open();
    }
  };

  useEffect(() => {
    CheckIfNeedToOpen();
  }, []);

  return (
    <View style={{ width: "100%", height: "100%", justifyContent: "center" }}>
      <BottomDrawer
        initialHeight={Dimensions.get("screen").height - 100}
        ref={LoginDrawerRef}
      >
        <View
          style={{
            height: Dimensions.get("screen").height - 100,
            top: 5,
            padding: 10,
            width: "100%",
            position: "absolute",
            marginTop: 10,
          }}
        >
          <LoginScreen
            style={{
              //direction: textDirection === directionEnum.RTL ? "rtl" : "ltr",

              backgroundColor: "white",
            }}
            logoImageSource={require("../../assets/icon.png")}
            logoImageStyle={{ height: 100, margin: 30 }}
            onLoginPress={() => {}}
            onSignupPress={() => {}}
            onEmailChange={setUsername}
            onPasswordChange={setPassword}
            enablePasswordValidation
            emailPlaceholder={emailText}
            passwordPlaceholder={passwordText}
            disableEmailTooltip
            disablePasswordTooltip
            loginButtonStyle={{ backgroundColor: "lightgreen" }}
            customSocialLoginButtons={
              <Pressable
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  width: "85%",
                  height: 50,
                  backgroundColor: "white",
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,

                  elevation: 4,
                }}
              >
                <View style={{ justifyContent: "center", height: "100%" }}>
                  <Text>
                    <View
                      style={{
                        height: "100%",
                        justifyContent: "center",
                        width: "100%",
                        padding: 10,
                      }}
                    >
                      <SvgXml
                        xml={
                          '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>'
                        }
                        height={40}
                        width={40}
                      />
                    </View>
                    <View
                      style={{
                        margin: 0,
                        justifyContent: "center",
                        padding: 10,
                        paddingTop: 0,
                        paddingBottom: 14,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Continue with Google
                      </Text>
                    </View>
                  </Text>
                </View>
              </Pressable>
            }
          />
        </View>
      </BottomDrawer>
    </View>
  );
};

export default Account;
