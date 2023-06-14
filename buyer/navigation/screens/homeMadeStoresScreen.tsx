import { ScrollView, StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { availableStores, Order, Pages, Store, store_category } from '../../interfaces';
import StoresGrid from '../../components/store/stores_grid';
import { useEffect, useState } from 'react';
import { storeActions } from '../../network_services/stores';
import * as Location from 'expo-location';


interface Props {
    deliveryLocation:Location.LocationObject;
    homeMadeStores:availableStores | null | undefined;
    setHomeMadeStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    refreshing:boolean;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    savedOrder:Order| undefined| null;
  }
const HomeMadeStores = (props:Props) => {

    const [loading, setLoading] = useState(true);

    const load = async () => {
        props.setHomeMadeStores(await storeActions.GetStores(props.deliveryLocation, store_category.homeMade));
    }


    useEffect(() => {
        
        load();
        if (props.homeMadeStores)
        {
            setLoading(false);
        }
    }, [])
    
    useEffect(() => {
        if (props.refreshing)
        {
         setLoading(true);
         props.setHomeMadeStores(null);
         load();
        }
        else
        {
            setLoading(false);
        }
    }, [props.refreshing]) 

    const getContent = () => {

        return ( <View style={style.view}>
            <Text style={style.title}>Creativity Place .</Text>
            <ScrollView>
             <StoresGrid savedOrder={props.savedOrder} setSavedOrder={props.setSavedOrder} thelocation={props.deliveryLocation} setSelectedStore={props.setSelectedStore}  title='New On HomeDelivery' displayStores={props.homeMadeStores?.Open} />
             <StoresGrid  savedOrder={props.savedOrder} setSavedOrder={props.setSavedOrder} thelocation={props.deliveryLocation} setSelectedStore={props.setSelectedStore}  title='Closed Stores' displayStores={props.homeMadeStores?.Closed} />
             
            
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

export default HomeMadeStores;