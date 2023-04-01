import { StyleSheet, Text, View, ScrollView, RefreshControl  } from 'react-native';
import React, {useEffect, useState} from 'react'
import { availableStores, LocationObject, Pages, Store } from '../../interfaces';
import StoresGrid from '../../components/stores_grid';
import { storeActions } from '../../hooks/stores';
import { StoresPlacaHolderGrid } from '../../components/stores_placeHolderGrid';


interface Props {
    location:LocationObject;
    Stores:availableStores | null | undefined;
    setAvailableStores:React.Dispatch<React.SetStateAction<availableStores | null | undefined>>;
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>;
    refreshing:boolean;
  }

const Stores = (props:Props) => {
    const [loading, setLoading] = useState(true);

    const load = async () => {
        props.setAvailableStores(await storeActions.GetStores(props.location));
    }


    useEffect(() => {
        
        load();
        if (props.Stores)
        {
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        if (props.refreshing)
        {
         setLoading(true);
         props.setAvailableStores(null);
         load();
        }
        else
        {
            setLoading(false);
        }
    }, [props.refreshing]) 

    const getContent = () => {

        return ( <View style={style.view}>
            <Text style={style.title}>The Way For Delivery {"(:"}</Text>
            <ScrollView>
             <StoresGrid setSelectedStore={props.setSelectedStore}  title='Available Stores' displayStores={props.Stores?.Open} />
             <StoresGrid setSelectedStore={props.setSelectedStore}  title='Closed Stores' displayStores={props.Stores?.Closed} />
             
            
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
        fontSize:19 ,
        textAlign:'center',
        marginTop:5,
        fontFamily:"Inter-Black"
    }
})

export default Stores;