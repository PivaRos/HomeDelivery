import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Order, RootStackParamList, Store } from "../../interfaces";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

interface CheckoutPops {
    order:Order;
    setOrder:React.Dispatch<React.SetStateAction<Order | null | undefined>>
    selectedStore:Store| undefined
    setFullCoords:React.Dispatch<React.SetStateAction<Location.LocationObjectCoords | undefined>>
    fullCoords:Location.LocationObjectCoords | undefined
}


export const ViewCheckout = ({order, setOrder, selectedStore, fullCoords, setFullCoords}:CheckoutPops) => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const BackPress = () => {
        navigation.navigate("ViewOrder", {id:4})
    }


    return (<ScrollView>
        <View style={{backgroundColor:'white', width:'100%', height:50, justifyContent:'center'}}>
        <Pressable style={styles.backButton} onPress={BackPress}><Text style={styles.backButtonText}>Back</Text></Pressable>
            <Text style={{textAlign:'center', width:"100%", fontSize:16, position:'absolute'}}>{selectedStore?.name}</Text>
        </View>
        <View style={{backgroundColor:"white"}}>
       {fullCoords && <MapView style={{height:250, width:'100%',         
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 3},
            shadowOpacity: 0.2,
            backgroundColor:"white"}}
        initialRegion={{latitude:fullCoords.latitude, longitude:fullCoords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421,}}
        >
       { selectedStore?.location.coordinates && <Marker
        coordinate={{latitude:selectedStore.location.coordinates[0], longitude:selectedStore.location.coordinates[1]}}
        title={selectedStore?.name}
        >
            <View style={{backgroundColor:'white'}}>
                {/* this is Store Marker */}
            </View>
        </Marker> }
         <Marker
        coordinate={{latitude:fullCoords.latitude, longitude:fullCoords.longitude}}
        title={selectedStore?.name}
        >
            
            <View style={{backgroundColor:'lightgreen', height:20, width:20, borderRadius:100, borderColor:'white', borderWidth:2.3}}>
                {/* this is Buyer Marker */}
                

            </View>
        </Marker> 
            </MapView>}
        </View>
    </ScrollView>);
}


const styles = StyleSheet.create({
    ViewOrderButton:{
        flexDirection:'row',
        height:50,
        width:'90%',
        padding:10,
        backgroundColor:"lightgreen",
        textAlign:'center',
        bottom:8,
        borderRadius:10,
        position:'absolute',   
        shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    },
    backButton: {
        zIndex: 3,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: 'lightgreen',
        height: 40,
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    detailsView: {
        display: 'flex',
    },
    detailsText: {
        marginTop:6,
        marginRight: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: 'black'
    },
    Conteintor: {
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    StoreName: {
        fontSize: 18,
    },
    ProductsView: {
        height: 'auto',
        width: '100%',
        backgroundColor: 'red'
    },
    storeInfo: {
        width: "100%",
        padding: 10,
        marginTop: 200,
    },
    imageStyle: {
        position: 'absolute',
        top: 0,
        height: 200,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: '100%'
    }, 
    imageText:{
        padding:5,
        backgroundColor:'lightgreen',
        borderRadius:10,
        marginRight:15
    }
})