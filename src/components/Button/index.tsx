import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
   Container,
   Title
} from './styles';

interface Props extends RectButtonProps { // Propriedades do Button que vamos usar nos componentes
    title: string;
    color?: string;
    loading?: boolean;
    light?: boolean;
}

export function Button({
    title,
    color,
    onPress,
    enabled = true,
    loading = false,
    light = false, // Faz com que o texto fique escuro, inicia como false
}:Props){
  const theme = useTheme();

  return(
    <Container 
    color={color ? color : theme.colors.main} 
    onPress={onPress}
    enabled={enabled}
    style={{ opacity: (enabled === false || loading  === true) ? .5 : 1 }}
    >
      {
        loading 
        ? <ActivityIndicator color={theme.colors.shape} />
        : <Title light={light}>{title}</Title>
      }
    </Container>
  );
}