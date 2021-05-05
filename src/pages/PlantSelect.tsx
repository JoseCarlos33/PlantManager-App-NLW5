import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native'
import { EnviromentButton } from '../components/EnviromentButton';

import { Header } from '../components/header'
import { PlantCardPrimaty } from '../components/PlantCardPrimary';
import api from '../services/api'

import  colors  from '../styles/colors'
import fonts  from '../styles/fonts'
import { Load } from '../components/load'
import { PlantProps } from '../libs/storage';

interface EnviromentProps{
    key: string;
    title: string;
}

export function PlantSelect(){

    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
    const [Plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentsSelected, setEnviromentsSelected] = useState('all');
    const [loading, setloading] = useState(true);

    const [page, setpage] = useState(1);
    const [loadingMore, setloadingMore] = useState(false);

    const navigation = useNavigation();
    

    async function fetchPlants() {
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setloading(true);
        
        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }
        
        setloading(false);
        setloadingMore(false);
    }

    

    function handleEnviromentsSelected(enviroment: string){
        setEnviromentsSelected(enviroment);

        if(enviroment === 'all')
            return setFilteredPlants(Plants);

        const filtered = Plants.filter(plant => 
            plant.environments.includes(enviroment)    
        )

        setFilteredPlants(filtered)
    }

    function handleFetchMore(distance: number){
        if(distance < 1)
            return;
        
        setloadingMore(true);
        setpage(oldValue => oldValue + 1)
        fetchPlants();

    }

    function hanlePlantSelect(plant: PlantProps){
        navigation.navigate('PlantSave', {plant});
    }

    useEffect(()=>{
        async function fetchEnviroment() {
            const { data } = await api
            .get('plants_environments?_sort=title&_order=asc');
            setEnviroments([
                {
                    key:'all',
                    title: 'Todos'
                },
                ...data
            ]);
        }

        fetchEnviroment();
        
    },[])

    useEffect(()=>{
        // async function fetchPlants() {
        //     const { data } = await api
        //     .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        //     if(!data)
        //         return setloading(true);
            
        //     if(page > 1){
        //         setPlants(oldValue => [...oldValue, ...data])
        //         setFilteredPlants(oldValue => [...oldValue, ...data])
        //     }else{
        //         setPlants(data);
        //         setFilteredPlants(data);
        //     }
            
        //     setloading(false);
        //     setloadingMore(false);
        // }

        fetchPlants();
        
    },[])

    if(loading)
        return <Load />
    
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Header/>
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>
            <View>
                <FlatList
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentsSelected}
                            onPress={()=> handleEnviromentsSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem = {({ item }) => (
                        <PlantCardPrimaty 
                            data={item}
                            onPress={() => hanlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    // contentContainerStyle={styles.contentContainerStyle}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => 
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore
                        ? <ActivityIndicator color={colors.green}/>
                        : <></>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: colors.background
    },
    header:{
        paddingHorizontal: 30
    },
    title:{
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight:20,
        marginTop: 15
    },
    subtitle:{
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList:{
        height: 40,
        justifyContent: 'center',
        paddingBottom:5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants:{
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    contentContainerStyle:{

    }
})