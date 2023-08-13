import { Skeleton } from "moti/skeleton";
import { Spacer, Spacerwidth } from "../spacers";
import { View } from "react-native";
import { MotiView } from "moti";

export const StoresSkeleton = () => {
  return (
    <MotiView>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          marginTop: 100,
        }}
      >
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
        <Spacerwidth />
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
      </View>
      <Spacer />
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
        <Spacerwidth />
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
      </View>

      <Spacer />
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
        <Spacerwidth />
        <Skeleton width={"100%"} colorMode="light" height={130}></Skeleton>
      </View>
    </MotiView>
  );
};
