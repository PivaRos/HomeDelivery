import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react'
import { availableStores, Pages } from '../../interfaces';

interface Props {
    Stores: availableStores | null | undefined;
}

const Account = ({ navigation }: any) => {
    return (
        <View>
            <Text>this is account screen</Text>
        </View>
    );
}

export default Account;