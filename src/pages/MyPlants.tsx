import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Header } from '../components/header';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png'
import { loadPlant, PlantProps, removePlant, StoragePlantProps } from '../libs/storage';
import { pt } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { FlatList } from 'react-native-gesture-handler';
import fonts from '../styles/fonts';
import { PlantCardSecundary } from '../components/PlantCardSecundary';
import { Load } from '../components/load';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function MyPlants(){

    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWatered] = useState<string>();


    function handleRemove(plant: PlantProps){
        Alert.alert('Remover', `Deseja remover a ${plant.name}`,[
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text: 'Sim',
                onPress: async() => {
                    try {
                        await removePlant(plant.id)

                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id != plant.id)
                        ) ;
                    } catch (error) {
                        Alert.alert('Não foi possível remover!')
                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStorage = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStorage[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                {locale: pt}
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStorage[0].name} à ${nextTime} horas`
            )
            
            setMyPlants(plantsStorage);
            setLoading(false);

        }

        loadStorageData();
    }, [])

    if(loading)
        return <Load/>

    
    return(
        <View style={styles.container}>
            <Header/>

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item)=> String(item.id)}
                    renderItem={({item})=> (
                        <PlantCardSecundary
                            data={item}
                            handleRemove={() => handleRemove(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{flex:1}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    spotlight:{
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius:20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage:{
        width: 60,
        height: 60
    },
    spotlightText:{
        flex:1,
        color: colors.blue,
        paddingHorizontal: 20,
       
    },
    plants:{
        flex: 1,
        width: '100%'
    },
    plantsTitle:{
        fontSize:24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }

});