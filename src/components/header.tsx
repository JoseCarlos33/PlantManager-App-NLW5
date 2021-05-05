import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Image,
    Text,
    StatusBar,
    View
} from 'react-native'
import colors from '../styles/colors';
import userImg from '../assets/foto.jpg'
import fonts from '../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Header(){
    const [userName, setuserName] = useState<string>();

    useEffect(()=>{
        async function loadStorageUserName() {
            const user = await AsyncStorage.getItem('@plantManager: user');
            setuserName(user || '');
        }

        loadStorageUserName();


    },[userName])//[userName] -> sempre que o userName for alterado o useEffect é ativado novamente

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá, </Text>
                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>
            <Image source={userImg} style={styles.image}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection:'row',
        paddingVertical:20,
        marginTop: StatusBar.currentHeight,
    },
    image:{
        width: 80,
        height: 80,
        borderRadius: 40
    },
    greeting:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight:40
    }
})