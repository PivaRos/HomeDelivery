import { View, Text, Pressable,StyleSheet, ScrollView } from "react-native"
import { Account, Store } from "../interfaces"
import { useEffect, useState } from "react"
import { useScrollToTop } from "@react-navigation/native"
import { uri } from "../envVars"



interface ViewAppProps {
    sessionid:string
    setSessionid:React.Dispatch<React.SetStateAction<string>>
    user:Account | undefined
    Store:Store
}

export const ViewStore = ({setSessionid, user, sessionid, Store}:ViewAppProps) => {

    const imageUri = uri + "data/file/";




    return (<View style={{}}>
        <ScrollView style={{height:'100%'}}>
        <View style={{padding:5}}>
            <Text>{Store.name}</Text>
        </View>
        </ScrollView>
    </View>)


}

const styles = StyleSheet.create({
    topView:{
        width:'100%',
        backgroundColor:'lightgreen',
        height:60,
        justifyContent:'center',
        flexDirection:'row'
    }
})