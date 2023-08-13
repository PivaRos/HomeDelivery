import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { store_category } from "../../interfaces";
import StoresGrid from "../../components/store/stores_grid";
import { useSelector } from "react-redux";
import { useStores } from "../../hooks/useStores";
import { SvgXml } from "react-native-svg";
import { hasStores } from "../../functions";
import { StoresSkeleton } from "../../components/store/StoresSkeleton";

const HomeMadeStoresScreen = () => {
  const deliveryLocation = useSelector((state: any) => state.deliveryLocation);

  const { Stores, loading } = useStores(
    deliveryLocation,
    store_category.homeMade
  );

  const windowWidth = Dimensions.get("window").width;

  const sadSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >	<path d="M 24.235 14.43 C 29.751 11.339 37.025 9.46 45 9.46 s 15.249 1.879 20.765 4.97 l -0.001 0.001 C 71.363 6.82 78.737 2.927 88.5 4.038 c -0.39 11.292 -2.458 20.856 -6.835 28.04 l 0 0 c -0.381 6.76 1.656 10.471 5.385 14.077 c -1.793 2.23 -4.228 4.028 -7.458 4.789 c 2.254 2.713 4.018 3.954 7.458 4.789 C 81.608 73.211 65.118 86.149 45 86.149 S 8.392 73.211 2.95 55.733 c 3.439 -0.835 5.203 -2.076 7.458 -4.789 c -3.23 -0.761 -5.665 -2.558 -7.458 -4.789 c 3.729 -3.606 5.766 -7.317 5.385 -14.077 l 0 0 C 3.958 24.893 1.89 15.33 1.5 4.038 c 9.763 -1.111 17.137 2.782 22.736 10.394 L 24.235 14.43 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #90EE90; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 19.098 18.129 c -2.815 -3.544 -7.084 -5.741 -10.874 -6.591 c 0.149 2.846 1.656 8.292 3.708 12.224 c 0.564 1.08 2.1 1.099 2.682 0.029 C 15.831 21.556 17.014 19.598 19.098 18.129 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #90EE90; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 71.224 18.129 c 2.815 -3.544 7.084 -5.741 10.874 -6.591 c -0.149 2.846 -1.656 8.292 -3.708 12.224 c -0.564 1.08 -2.1 1.099 -2.682 0.029 C 74.491 21.556 73.308 19.598 71.224 18.129 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #90EE90; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 49.737 39.988 c 0 2.616 -2.121 4.737 -4.737 4.737 s -4.737 -2.121 -4.737 -4.737 c 0 -2.616 2.121 -2.737 4.737 -2.737 S 49.737 37.372 49.737 39.988 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(80,86,94); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 45 55.72 c -0.829 0 -1.5 -0.672 -1.5 -1.5 v -9.495 c 0 -0.829 0.671 -1.5 1.5 -1.5 s 1.5 0.671 1.5 1.5 v 9.495 C 46.5 55.048 45.829 55.72 45 55.72 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 45 46.225 c -3.439 0 -6.237 -2.798 -6.237 -6.237 c 0 -4.236 4.057 -4.236 6.237 -4.236 s 6.236 0 6.236 4.236 C 51.236 43.427 48.438 46.225 45 46.225 z M 45 38.751 c -3.237 0 -3.237 0.387 -3.237 1.236 c 0 1.785 1.452 3.237 3.237 3.237 c 1.784 0 3.236 -1.452 3.236 -3.237 C 48.236 39.139 48.236 38.751 45 38.751 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 54.924 65.644 c -0.828 0 -1.5 -0.672 -1.5 -1.5 c 0 -4.645 -3.779 -8.424 -8.424 -8.424 s -8.423 3.779 -8.423 8.424 c 0 0.828 -0.671 1.5 -1.5 1.5 s -1.5 -0.672 -1.5 -1.5 c 0 -6.299 5.125 -11.424 11.423 -11.424 s 11.424 5.125 11.424 11.424 C 56.424 64.972 55.752 65.644 54.924 65.644 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 28 39.087 c -3.411 0 -6.186 -2.775 -6.186 -6.186 c 0 -0.829 0.671 -1.5 1.5 -1.5 s 1.5 0.671 1.5 1.5 c 0 1.757 1.429 3.186 3.186 3.186 s 3.186 -1.429 3.186 -3.186 c 0 -0.829 0.671 -1.5 1.5 -1.5 s 1.5 0.671 1.5 1.5 C 34.186 36.313 31.411 39.087 28 39.087 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 62 39.087 c -3.411 0 -6.186 -2.775 -6.186 -6.186 c 0 -0.829 0.672 -1.5 1.5 -1.5 s 1.5 0.671 1.5 1.5 c 0 1.757 1.429 3.186 3.186 3.186 s 3.186 -1.429 3.186 -3.186 c 0 -0.829 0.672 -1.5 1.5 -1.5 s 1.5 0.671 1.5 1.5 C 68.186 36.313 65.411 39.087 62 39.087 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 74.026 23.342 c -0.497 0 -0.983 -0.247 -1.269 -0.698 C 68.339 15.656 57.185 10.96 45 10.96 s -23.339 4.695 -27.757 11.684 c -0.442 0.7 -1.368 0.909 -2.07 0.466 c -0.7 -0.443 -0.909 -1.37 -0.466 -2.07 C 19.73 13.095 31.621 7.96 45 7.96 s 25.27 5.134 30.293 13.08 c 0.443 0.7 0.234 1.627 -0.466 2.07 C 74.578 23.268 74.301 23.342 74.026 23.342 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 9.911 21.253 c -0.613 0 -1.189 -0.379 -1.41 -0.99 c -0.764 -2.109 -1.572 -4.785 -1.775 -8.647 c -0.024 -0.469 0.172 -0.922 0.53 -1.225 c 0.359 -0.303 0.837 -0.421 1.296 -0.317 c 4.62 1.037 9.001 3.699 11.72 7.122 c 0.515 0.649 0.407 1.592 -0.242 2.108 c -0.649 0.514 -1.592 0.406 -2.108 -0.242 c -1.911 -2.406 -4.812 -4.374 -8.011 -5.485 c 0.307 2.375 0.87 4.176 1.409 5.665 c 0.282 0.779 -0.121 1.639 -0.899 1.921 C 10.253 21.224 10.081 21.253 9.911 21.253 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 45 87.649 c -20.147 0 -37.622 -12.647 -43.482 -31.471 c -0.123 -0.396 -0.077 -0.825 0.127 -1.186 s 0.548 -0.621 0.951 -0.719 c 2.255 -0.547 3.658 -1.226 5.13 -2.627 c -2.288 -0.957 -4.281 -2.481 -5.946 -4.554 c -0.485 -0.604 -0.431 -1.479 0.127 -2.018 c 3.249 -3.141 5.216 -6.354 4.948 -12.548 C 2.662 25.473 0.418 16.164 0.001 4.089 c -0.027 -0.782 0.552 -1.454 1.33 -1.542 c 9.814 -1.117 17.926 2.583 24.114 10.996 c 0.491 0.667 0.348 1.606 -0.32 2.097 c -0.666 0.49 -1.605 0.348 -2.097 -0.32 C 17.742 8.135 11.203 4.877 3.057 5.404 c 0.526 11.04 2.676 19.52 6.559 25.893 c 0.128 0.21 0.203 0.45 0.217 0.696 c 0.386 6.861 -1.604 10.792 -4.831 14.219 c 1.617 1.654 3.545 2.752 5.749 3.271 c 0.506 0.119 0.914 0.491 1.079 0.983 c 0.165 0.493 0.063 1.036 -0.269 1.436 c -2.164 2.604 -3.989 3.959 -6.694 4.847 c 5.899 16.753 21.833 27.9 40.133 27.9 c 18.3 0 34.233 -11.147 40.133 -27.9 c -2.705 -0.888 -4.53 -2.243 -6.694 -4.847 c -0.332 -0.399 -0.434 -0.942 -0.27 -1.436 c 0.165 -0.492 0.573 -0.864 1.079 -0.983 c 2.204 -0.52 4.134 -1.617 5.75 -3.271 c -3.228 -3.427 -5.217 -7.357 -4.831 -14.219 c 0.015 -0.246 0.089 -0.485 0.217 -0.696 c 3.883 -6.374 6.033 -14.855 6.559 -25.893 c -8.15 -0.524 -14.686 2.731 -19.97 9.916 c -0.491 0.667 -1.43 0.811 -2.097 0.32 c -0.667 -0.491 -0.811 -1.43 -0.319 -2.097 C 70.743 5.13 78.851 1.427 88.67 2.547 c 0.777 0.088 1.356 0.76 1.329 1.542 c -0.417 12.074 -2.659 21.382 -6.854 28.439 c -0.268 6.193 1.699 9.406 4.948 12.548 c 0.557 0.539 0.612 1.413 0.126 2.018 c -1.664 2.072 -3.657 3.597 -5.945 4.554 c 1.473 1.402 2.876 2.08 5.13 2.627 c 0.403 0.098 0.747 0.358 0.951 0.719 c 0.205 0.36 0.251 0.789 0.128 1.186 C 82.622 75.002 65.147 87.649 45 87.649 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 80.089 21.253 c -0.17 0 -0.343 -0.029 -0.511 -0.09 c -0.779 -0.282 -1.182 -1.143 -0.899 -1.921 c 0.539 -1.487 1.103 -3.287 1.409 -5.664 c -3.199 1.111 -6.101 3.079 -8.011 5.484 c -0.515 0.65 -1.46 0.757 -2.107 0.242 c -0.649 -0.515 -0.757 -1.459 -0.242 -2.107 c 2.718 -3.423 7.1 -6.085 11.721 -7.122 c 0.456 -0.103 0.938 0.014 1.296 0.317 c 0.358 0.303 0.555 0.756 0.53 1.225 c -0.203 3.865 -1.012 6.54 -1.775 8.647 C 81.278 20.874 80.702 21.253 80.089 21.253 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>';

  const getContent = () => {
    return (
      <View style={style.view}>
        {Stores && hasStores(Stores) && (
          <Text style={style.title}>Enjoy The Best Food .</Text>
        )}
        {Stores && hasStores(Stores) ? (
          <ScrollView>
            <StoresGrid
              title="New On HomeDelivery"
              displayStores={Stores?.Open}
            />
            <StoresGrid title="Closed Stores" displayStores={Stores?.Closed} />
          </ScrollView>
        ) : !loading ? (
          Stores !== undefined && (
            <Text
              style={[
                {
                  textAlign: "center",
                  fontSize: 19,
                  padding: 20,
                  width: windowWidth,
                },
                style.titleError,
              ]}
            >
              Oops, Looks Like At This Moment{"\n"}
              There Is No Stores Delivering{"\n"}
              To Your Location {"\n"}
              <View
                style={{
                  width: windowWidth,
                  justifyContent: "center",
                  flexDirection: "row",
                  padding: 0,
                  margin: 0,
                }}
              >
                <SvgXml
                  style={{ height: 120, width: 120, marginTop: 60 }}
                  xml={sadSVG}
                />
              </View>
            </Text>
          )
        ) : (
          <StoresSkeleton />
        )}
      </View>
    );
  };

  return getContent();
};

const style = StyleSheet.create({
  view: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    flexDirection: "row",
  },

  title: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    color: "grey",
    fontWeight: "bold",
    position: "absolute",
  },
  titleError: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 10,
    color: "green",
    position: "absolute",
  },
});

export default HomeMadeStoresScreen;
