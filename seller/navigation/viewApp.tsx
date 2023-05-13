import { View, Text, Pressable,StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { Account, RootStackParamList, Store } from "../interfaces"
import React, { useCallback, useEffect, useState } from "react"
import { useNavigation, useScrollToTop } from "@react-navigation/native"
import { uri } from "../envVars"
import { StackNavigationProp } from "@react-navigation/stack";




interface ViewAppProps {
    sessionid:string
    setSessionid:React.Dispatch<React.SetStateAction<string>>
    user:Account | undefined
    setSelectedStore:React.Dispatch<React.SetStateAction<Store | undefined>>
    refreshing:boolean, 
    setRefreshing:React.Dispatch<React.SetStateAction<boolean>>
    CheckAccount:() => void;
}

export const ViewApp = ({ CheckAccount, setSessionid, user, sessionid, setSelectedStore, refreshing, setRefreshing}:ViewAppProps) => {

    const [Stores, setStores ] = useState<Store[]>();
    const imageUri = uri + "data/file/";

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const Logout = () => {
        setSessionid("");
    }

    const getStores = async () => {
        try{
        const result  = await fetch(uri+"/seller/stores", {
            method:'GET',
            headers:{
                "Content-Type":"application/json",
                "authorization":sessionid
            },
            
        })
        if (result.status !== 200) throw new Error(result.status.toString());
            const data = await result.json();
            setStores(data.Stores)
        }catch{
        }
    }

    useEffect(() => {
        getStores();
    }, [])

    useEffect(() => {
        if (refreshing)
        {
            CheckAccount();
            setStores([]);
            getStores();
        }
    }, [refreshing])


    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false)
        }, 1500)
      }, []);
    
    return (<View style={{}}>
        <View style={styles.topView}>
            <View style={{justifyContent:'center', height:'100%', position:'absolute', left:5}}>
            <Pressable style={{borderRadius:10, backgroundColor:"white", width:60, justifyContent:'center', marginLeft:5}} onPress={() => Logout()}>
                <Text style={{color:'black', padding:5, textAlign:'center', width:'100%'}}>Logout</Text>
            </Pressable>
            </View>
        </View>
        <ScrollView refreshControl={<RefreshControl colors={['#2874ed']} title='Refresh' refreshing={refreshing} onRefresh={onRefresh} />} style={{height:'100%'}}>
        <Text>Welcome Back {user?.username}</Text>
        <View style={{padding:5}}>
        <Text style={{fontWeight:'bold', fontSize:16, marginBottom:5}}>My Stores</Text>
        {Stores && Stores.map((store, index) => {
                return (<Pressable onPress={async () => {
                await setSelectedStore(store);
                    navigation.navigate("ViewStore", {id:2});
                }} key={index} style={{
                width:'100%',
                justifyContent:'center', 
                flexDirection:'column', 
                padding:10, 
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor:'white',
                marginBottom:5,
                height:50,
                 }} >
                    
                    {store.active && <View style={{height:15, width:15, borderRadius:50, backgroundColor:'#89fc7e', position:'absolute', right:15}}></View>}
                    {!store.active && <View style={{height:15, width:15, borderRadius:50, backgroundColor:'#f76a6f', position:'absolute', right:15}}></View>}
                    <Text style={{textAlign:'center', width:'100%'}}>{store.name}</Text>
            </Pressable>)
            })}
        {!Stores && <Text>Loadin...</Text> }
        </View>
        <View style={{padding:5}}>
            
        </View>
        </ScrollView>
    </View>)


}

const styles = StyleSheet.create({
    topView:{
        width:'100%',
        backgroundColor:'lightgreen',
        height:40,
        justifyContent:'center',
        flexDirection:'row'
        }
})