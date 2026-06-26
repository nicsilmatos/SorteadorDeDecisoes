import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

export function useDecisionEngine(){
    const [opcao, setOpcao] = useState(''); //gerencia a entrada de texto
    const [listaOpcoes, setListaOpcoes] = useState([]); //gerencia a lista de opcoes
    const [resultado, setResultado] = useState(null); //gerencia os resultados

    //função para adicionar uma nova opcao na lista
    const adicionarOpcao = useCallback(() => { 
        //useCallback: Memoriza a função para evitar que ela seja recriada na memória a cada 
        // letra que o usuário digitar no input
        if (opcao.trim() === '') return;
        // Atualiza o estado da lista usando uma função de retorno (prev) garantindo 
        // que pegue o estado mais recente da lista.
        setListaOpcoes((prev) => [...prev, opcao.trim()]);
        setOpcao(''); //limpa o campo de texto
    }, [opcao]);

      //função que faz o sorteio 
      const sortear = useCallback(()=> {
        //validação se tem pelo menos 2 itens na lista pr   a sortear
        if (listaOpcoes.length < 2){
          Alert.alert('Adicione pelo menos duas opcoes para sortear');
          return;
        }
        // faz uma vibração para avisar que o sorteio aconteceu
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        //lógica para escolher um indice aleatorio da lista
        const indiceAleatorio = Math.floor(Math.random() * listaOpcoes.length);
        setResultado(listaOpcoes[indiceAleatorio]); 
      }, [listaOpcoes]); //Atualiza a lógica de sorteio sempre que a lista de opções mudar

      const limparTudo = useCallback(() => { //reseta tudo
        setListaOpcoes([]);
        setResultado(null);
    }, []);

    useEffect(() => {
        Accelerometer.setUpdateInterval(100); 

        const assinatura = Accelerometer.addListener(({ x, y, z}) => {
        // CÁLCULO VETORIAL: O sensor devolve a aceleração nos eixos X, Y e Z baseados na gravidade 
        // Usa a fórmula da Magnitude do Vetor Tridimensional (Teorema de Pitágoras em 3D)
            const aceleracaoTotal = Math.sqrt(x * x + y * y + z * z);
            // Se o valor ultrapassar 2.6, significa que uma força externa (o chacoalho) foi aplicada
            if (aceleracaoTotal > 2.6) {
                sortear();
            }
        });
        return () => assinatura && assinatura.remove(); //limpeza para evitar memory leak
    }, [sortear]); // O efeito depende da função sortear atualizada com a lista atual

    return {opcao, setOpcao, listaOpcoes, resultado, adicionarOpcao, sortear, limparTudo};
}