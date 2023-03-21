import { StyleSheet, Text, View  } from 'react-native';
import * as React from 'react'
import { availableStores, LocationObject, Pages } from '../../interfaces';

interface Props {
    location:LocationObject;
    Stores:availableStores | null | undefined;
  }

const Search = ({navigation}:any) => {
return (
    <View>
        <Text>this is search screen</Text>
    </View>
);
}

export default Search;