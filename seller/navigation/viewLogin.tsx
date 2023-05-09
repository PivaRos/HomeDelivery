import { useRef, useState } from "react"
import { View, StyleSheet, Text, TextInput, ScrollView, Pressable, Animated } from "react-native"
import { useKeyboard } from "../hooks/useKeyborad";
import { uri } from "../envVars";
import { DataObject } from "../interfaces";



export const ViewLogin = () => {

    let scrollViewRef = useRef<ScrollView>();
    let keyboradHeight = useKeyboard()

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const Login = async () => {
        try{
            const result = await fetch(uri+"/authorization/account", {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    username:username,
                    password:password
                })
            })
            const json:DataObject = await result.json();
            if (json.err) throw new Error(json.msg);
            
            //set sessionid
            console.log(json.data.sessionid);
            //redirect to other page
        
        }
        catch(e:any){
            //display error message
            console.log(e.message)
        }
    }


    return (
        <ScrollView contentContainerStyle={{height:'100%', width:'100%', backgroundColor:'white'}} scrollEnabled={false} scrollEventThrottle={16} ref={(ref:ScrollView) => {scrollViewRef.current = ref}}>
            <View style={{
            justifyContent:'center',
            flexDirection:'row',
            height:'100%'
                    }}>
            <View style={styles.loginView}>
            <TextInput onChangeText={(v) => {
                setUsername(v)
            }} placeholder="Username" style={styles.TextInputStyle}/>
            <TextInput onChangeText={(v) => {
                setPassword(v)
            }} placeholder="Password" secureTextEntry={true} style={styles.TextInputStyle}/>
            </View>
            
            <Pressable onPress={() => Login()} style={{position:'absolute', bottom:keyboradHeight, backgroundColor:'lightgreen', width:'85%', borderRadius:10, height:50, justifyContent:'center', flexDirection:'row'}}><Text style={{marginTop:13, fontSize:19}}>Login to Store</Text></Pressable>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    mainView:{
        backgroundColor:'red',
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column'
    }, 
    loginView:{
        height:'100%',
        top:200
    },
    TextInputStyle: {
        height:50, 
        width:250, 
        backgroundColor:'lightgreen', 
        padding:10, 
        fontSize:18, 
        margin:10
    }

})