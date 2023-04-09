import { StyleSheet, Text, View, ScrollView, RefreshControl  } from 'react-native';
import React, {useEffect, useState} from 'react'
import { availableStores, LocationObject, Order, Pages, Store, store_category } from '../../interfaces';
import { storeActions } from '../../network_services/stores';
import StoresGrid from '../../components/store/stores_grid';


interface Props {
    location:LocationObject;
    foodStores:availableStores | null | undefined;
    setFoodStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    refreshing:boolean;
    setSavedOrder:React.Dispatch<React.SetStateAction<Order | undefined | null>>;
    setSelectedProductUnits:React.Dispatch<React.SetStateAction<number>>;
    selectedProductUnits:number;

  }

const FoodStores = (props:Props) => {
    const [loading, setLoading] = useState(true);

    const load = async () => {
        props.setFoodStores(await storeActions.GetStores(props.location, store_category.food));
    }


    useEffect(() => {
        
        load();
        if (props.foodStores)
        {
            setLoading(false);
        }
    }, [])

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
             <StoresGrid setSelectedProductUnits={props.setSelectedProductUnits} selectedProductUnits={props.selectedProductUnits} setSavedOrder={props.setSavedOrder} thelocation={props.location} setSelectedStore={props.setSelectedStore}  title='New On HomeDelivery' displayStores={props.foodStores?.Open} />
             <StoresGrid setSelectedProductUnits={props.setSelectedProductUnits} selectedProductUnits={props.selectedProductUnits} setSavedOrder={props.setSavedOrder} thelocation={props.location} setSelectedStore={props.setSelectedStore}  title='Closed Stores' displayStores={props.foodStores?.Closed} />
             
            
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