import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';

import Logo from '../../assets/logo-screen.svg';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList,
} from './styles';

export function Home(){
  const [cars, setCars] = useState<CarDTO[]>([]); // Armazenar a resposta de API
  const [loading, setLoading] = useState(true)

  const netInfo = useNetInfo();
  const navigation = useNavigation();

  function handleCarDetails(car:CarDTO) {
    navigation.navigate('CarDetails', { car })
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const response = await api.get('/cars');
        if(isMounted){
          setCars(response.data);
        }

      } catch (error) {
        console.log(error);
      }finally {
        if(isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    }
  }, []);

  // Quando a conexão mudar, esse useEffect vai ser disparado novamente.
  useEffect(() => {
    if(netInfo.isConnected) {
      Alert.alert('Você está On-line');
    } else {
      Alert.alert('Você está Offline');
    }
  },[netInfo.isConnected]);

  return(
    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
        <Header>
          <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
            {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
          </ HeaderContent>
        </Header>
        { loading ? <Load /> : 
      <CarList 
        data={cars}
        keyExtractor={item => item.id}
        renderItem={({ item }) => 
          <Car data={item} onPress={() => handleCarDetails(item)}/>
      }
      />
    }
    </Container>
  );
}