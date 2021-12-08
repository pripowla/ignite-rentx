import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';
import { Input } from '../../../components/Input';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';

import {
   Container,
   Header,
   Steps,
   Title,
   Subtitle,
   Form,
   FormTitle,
} from './styles';
import { useAuth } from '../../../hooks/auth';

export function SignUpFirstStep(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  const navigation = useNavigation();
  const { user } = useAuth();
  console.log("USUÁRIO AUTENTICADO", user);

  /* Retorna a tela */
  function handleBack() {
    navigation.goBack();
  }

  /* Chama a próxima tela */
  async function handleNextStep() {
    try{
      const schema = Yup.object().shape({
        driverLicense: Yup.string()
        .required('CNH é obrigatória'),
        email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
        name: Yup.string()
        .required('Nome é obrigatório'),
      });
      /* Armazenando os dados do usuário na variável */
      const data = {name, email, driverLicense}
      await schema.validate(data); // Aguarda a validação

      //@ts-ignore
      navigation.navigate('SignUpSecondStep', { user: data })
    } catch(error) {
      if(error instanceof Yup.ValidationError){
        return Alert.alert('Opa', error.message);
      }
    }
  }

  return(
  <KeyboardAvoidingView behavior="position" enabled>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
      <Header>
        <BackButton onPress={handleBack}/>
        <Steps>
          <Bullet active />
          <Bullet />
        </Steps>
      </Header>

      <Title>
        Crie sua {'\n'}conta
      </Title>
      <Subtitle>
        Faça seu cadastro de {'\n'}
        forma rápida e fácil
      </Subtitle>

      <Form>
        <FormTitle>1. Dados</FormTitle>
        <Input 
          iconName="user"
          placeholder="Nome"
          onChangeText={setName}
          value={name}
        />
        <Input 
          iconName="mail"
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <Input 
          iconName="credit-card"
          placeholder="CNH"
          keyboardType="numeric"
          onChangeText={setDriverLicense}
          value={driverLicense}
        />
      </Form>

      <Button
        title="Próximo"
        onPress={handleNextStep}
      />

    </Container>  
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}