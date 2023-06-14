import { StyleSheet, Text, View, ScrollView, RefreshControl  } from 'react-native';
import React, {useEffect, useState} from 'react'
import { availableStores, Order, Pages, Store, store_category } from '../../interfaces';
import { storeActions } from '../../network_services/stores';
import StoresGrid from '../../components/store/stores_grid';
import * as Location from 'expo-location';


interface Props {
    deliveryLocation:Location.LocationObject;
    foodStores:availableStores | null | undefined;
    setFoodStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    refreshing:boolean;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    savedOrder:Order| undefined| null;
  }

const FoodStores = (props:Props) => {
    const [loading, setLoading] = useState(true);

    const load = async () => {
        props.setFoodStores(await storeActions.GetStores(props.deliveryLocation, store_category.food));
    }


    useEffect(() => {
        setLoading(true);
        load();
        if (props.foodStores)
        {
            setLoading(false);
        }
    }, [props.deliveryLocation])

    useEffect(() => {
        if (props.refreshing)
        {
         setLoading(true);
         props.setFoodStores(null);
         load();
        }
        else
        {
            setLoading(false);
        }
    }, [props.refreshing]) 

    const getContent = () => {

        return ( <View style={style.view}>
            <Text style={style.title}>Enjoy The Best Food .</Text>
            <ScrollView>
             <StoresGrid savedOrder={props.savedOrder}  setSavedOrder={props.setSavedOrder} thelocation={props.deliveryLocation} setSelectedStore={props.setSelectedStore}  title='New On HomeDelivery' displayStores={props.foodStores?.Open} />
             <StoresGrid savedOrder={props.savedOrder} setSavedOrder={props.setSavedOrder} thelocation={props.deliveryLocation} setSelectedStore={props.setSelectedStore}  title='Closed Stores' displayStores={props.foodStores?.Closed} />
             
            
            </ScrollView>
            </View>)
    }

return (
    getContent()
);
}

const style = StyleSheet.create({
    view:{
        width:'100%',
        height:'100%',
        
    },

    title:{
        fontSize:22 ,
        marginLeft:10,
        marginTop:10,
        fontFamily:'AmericanTypewriter',
        fontWeight:'bold'
        
    }
})

export default FoodStores;