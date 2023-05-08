import { StyleSheet, Text, View, StatusBar, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ViewLogin } from './navigation/viewLogin';




export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, fullScreenGestureEnabled: true }}>
          <Stack.Screen  name='ViewLogin' children={() => <ViewLogin/>}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
