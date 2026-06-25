import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaViewBase, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Haptics from "expo-haptics";
import { Accelerometer } from 'expo-sensors';

export default function App() {

  const [opcao, setOpcao] = useState(''); //gerencia a entrada de texto
  const [listaOpcoes, setListaOpcoes] = useState([]); //gerencia a lista de opcoes
  const [resultado, setResultado] = useState(null); //gerencia os resultados

  //função para adicionar uma nova opcao na lista
  const adicionarOpcao = () => {
    if (opcao.trim === '') return;
    setListaOpcoes([...listaOpcoes, opcao.trim()]);
    setOpcao(''); //limpa o campo de texto
  }

  //função que faz o sorteio 
  const sortear = () => {
    if (listaOpcoes < 2){
      Alert.alert('Adicione pelo menos duas opcoes para sortear');
      return;
    }
    // faz uma vibração para avisar que o sorteio aconteceu
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    //lógica para escolher um indice aleatorio da lista
    const indiceAleatorio = Math.floor(Math.random() * listaOpcoes.length);
    setResultado(listaOpcoes[indiceAleatorio]);
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
