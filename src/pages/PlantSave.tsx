import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    Platform,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker'

import waterdrop from '../assets/waterdrop.png'
import { Button } from '../components/button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { format, isBefore } from 'date-fns';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { PlantProps, savePlant } from '../libs/storage'



interface Params{
    plant: PlantProps;
}

export function PlantSave(){
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const navigation = useNavigation();

    const route = useRoute();
    const { plant } = route.params as Params;
    
    function handleOpenDateTimePickerForAndroid(){
        setShowDatePicker(oldState => !oldState)
    }


    async function handleSave(){
        try{
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            })

            navigation.navigate('Confirmation', {
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar de sua plantinha com muito cuidado',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hub',
                nextScreen: 'MyPlants'
            })
        } catch {
            Alert.alert('Não foi possivel salvar.');
        }
    }

    function handleChangeTime(event: Event, dateTime: Date | undefined){
        if(Platform.OS === 'android'){
            setShowDatePicker(oldState => !oldState)
        }

        if(dateTime && isBefore(dateTime, new Date())){
            setSelectedDateTime(new Date());
            return (Alert.alert('Escolha uma hora no futuro!'))
        }

        if(dateTime)
            setSelectedDateTime(dateTime)
    }

    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri= {plant.photo}
                        height={150}
                        width={150}
                    />
                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>
                    
                    {showDatePicker &&
                        <DateTimePicker
                            value={selectedDateTime}
                            mode="time"
                            display="spinner"
                            onChange={handleChangeTime}
                        />
                    }

                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                style={styles.dateTimePickerTextButtom}
                                onPress={handleOpenDateTimePickerForAndroid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar ${format(selectedDateTime, 'HH:mm')}`} 
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button
                        title="Cadastrar planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape,
        paddingHorizontal: 30,
        paddingVertical:50
    },
    plantName:{
        fontFamily: fonts.heading,
        fontSize:24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout:{
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginVertical: 10
    },
    controller:{
        backgroundColor: colors.white,
        paddingHorizontal:20,
        paddingTop: 20,
        paddingBottom: 20
    },
    tipContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        width: '100%',
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage:{
        width: 56,
        height: 56
    },
    tipText:{
        flex:1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel:{
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 16,
        marginBottom: 5
    },
    dateTimePickerText:{
        // paddingLeft: '30%',
        // flexDirection: 'row',
        alignItems: 'center',
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text 
    },
    dateTimePickerTextButtom:{
        textAlign: 'center',
        // width: '100%',
        alignItems: 'center',
        paddingVertical: 40
    }
})