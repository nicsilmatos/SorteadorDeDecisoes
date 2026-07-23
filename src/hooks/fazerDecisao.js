import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, LayoutAnimation} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obterSugestoesIA } from '../services/api';

const CONFIG = {
    STORAGE_KEYS: {
    LISTA: '@SorteadorDeDecisoes:lista',
    HISTORICO: '@SorteadorDeDecisoes:historico',
    CATEGORIAS: '@SorteadorDeDecisoes:categorias',
},
    LIMITES: {
    MAX_HISTORICOS: 5,
    MIN_ITENS_SORTEIO: 2,
},
    SENSORES: {
    INTERVALO_MS: 100,
    FORCA_CHACOALHO: 2.6,
    DEBOUNCE_MS: 1500,
    },
}

const API_URL = "https://sorteador-backend.nicsilmatos.workers.dev";

export function useDecisionEngine(){
    const [opcao, setOpcao] = useState(''); //gerencia a entrada de texto
    const [listaOpcoes, setListaOpcoes] = useState([]); //gerencia a lista de opcoes
    const [resultado, setResultado] = useState(null); //gerencia os resultados
    const [historico, setHistorico] = useState([]) //armazena uma array simples com as ultimas strings sorteaadas
    const [categoria, setCategoria] = useState({}) //armazena um objeto onde cada chave é o nome de uma lista e valores 

    useEffect(() => {
        AsyncStorage.getItem(CONFIG.STORAGE_KEYS.LISTA)
        .then ((dadosSalvos) => {
            if (dadosSalvos !== null){
                const listaConvertida = JSON.parse(dadosSalvos);

                if (Array.isArray(listaConvertida)) {
                    const listaLimpa =  listaConvertida.filter(item => item !== undefined);
                    setListaOpcoes(listaLimpa);
                }
            }
        })  
        .catch((error) => console.error('Erro ao carregar a lista', error));

        //Recupera o historico dos sorteios salvos
        AsyncStorage.getItem(CONFIG.STORAGE_KEYS.HISTORICO)
        .then((dados) => {
            if (dados) setHistorico(JSON.parse(dados)); 
        }) .catch(() => {});

        //recupera as categorias/templates criados pelo usuário
        AsyncStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIAS)
        .then((dados) => {
            if (dados) setCategoria(JSON.parse(dados));
        }) .catch(() => {});
    }, []);  
    
    // salvar os dados sempre que a lista mudar
    useEffect(() => {
        async function salvarLista() {
            try {
                await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.LISTA, JSON.stringify(listaOpcoes));
            } catch (error) {
                console.error("Erro ao salvar a lista", error);
            }
        }
        salvarLista();
    }, [listaOpcoes]);

    //sincroniza o historico com o armazenamento local sempre que um novo item entra
    useEffect(() => {
        AsyncStorage.setItem(CONFIG.STORAGE_KEYS.HISTORICO, JSON.stringify(historico)).catch(() => {});
    }, [historico]);

    //sincroniza o dicionario de categorias com o armazenamento sempre que uma nova lista for adicionada ou excluida
    useEffect(() => {
        AsyncStorage.setItem(CONFIG.STORAGE_KEYS.CATEGORIAS, JSON.stringify(categoria)).catch(() => {})
    }, [categoria])


    //função para adicionar uma nova opcao na lista
    const adicionarOpcao = useCallback(() => { 
        //useCallback: Memoriza a função para evitar que ela seja recriada na memória a cada 
        // letra que o usuário digitar no input
        if (opcao.trim() === '') return;
        //evitar duplicatas
        if (listaOpcoes.includes(opcao.trim())){
            Alert.alert('Opção repetida', 'Você ja adicionou essa opção na lista');
            return;
        }
        // Atualiza o estado da lista usando uma função de retorno (prev) garantindo 
        // que pegue o estado mais recente da lista.
        setListaOpcoes((prev) => [...prev, opcao.trim()]);
        setOpcao(''); //limpa o campo de texto
    }, [opcao, listaOpcoes]);

    //função que faz o sorteio 
      const sortear = useCallback(()=> {
        //validação se tem pelo menos 2 itens na lista pr   a sortear
        if (listaOpcoes.length < CONFIG.LIMITES.MIN_ITENS_SORTEIO){
          Alert.alert(`Adicione pelo menos ${CONFIG.LIMITES.MIN_ITENS_SORTEIO} opções`);
          return;
        }
        // faz uma vibração para avisar que o sorteio aconteceu
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        //lógica para escolher um indice aleatorio da lista
        const indiceAleatorio = Math.floor(Math.random() * listaOpcoes.length);
        const opcaoEscolhida = listaOpcoes[indiceAleatorio]

        if (opcaoEscolhida) {
            setResultado(opcaoEscolhida);
            setHistorico((prev) => [opcaoEscolhida, ...prev].slice(0, CONFIG.LIMITES.MAX_HISTORICOS)); //salva no historico, slice garante o limite de 5 itens no painel e o spread [...] coloca o novo item no topo
        }
      }, [listaOpcoes]); //Atualiza a lógica de sorteio sempre que a lista de opções mudar

      //funçaõ que pega os itens da tela e salva dentro de uma chave de texto
      const salvarListaComoCategoria = useCallback((nomeCategoria) => {
        const nomeTrim = nomeCategoria.trim();
        if (nomeTrim === '') return;
        if (listaOpcoes.length === 0) {
            Alert.alert('Lista Vazia', 'Sua lista atual precisa de itens para ser salva.');
            return;
        }

        setCategoria((prev) => ({
            ...prev,
            [nomeTrim]: [...listaOpcoes]
        }));
        Alert.alert('Sucesso', `Template "${nomeTrim}" criado com sucesso!`);
    }, [listaOpcoes]);

    // função que substitui a lista de opções atual pelos itens gravados na categoria escolhida
    const carregarCategoria = useCallback((nomeCategoria) => {
        if (categoria[nomeCategoria]) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setListaOpcoes(categoria[nomeCategoria]);
            setResultado(null); // Reseta o card de resultado anterior para evitar confusão visual
        }
    }, [categoria]);

    // função que deleta a categoria inteira através do 'delete'
    const deletarCategoria = useCallback((nomeCategoria) => {
            Alert.alert(
            "Remover categoria",
            `Tem certeza que deseja apagar a categoria ${nomeCategoria}?`, [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Apagar",
                    onPress: () => {
                        setCategoria((prev) => {
                            const copia = {...prev};
                            delete copia[nomeCategoria];
                            return copia;
                        });
                    }, 
                    style: "destructive"
                }
            ]
        );   
    }, []);

    const limparTudo = useCallback(() => { //reseta tudo
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setListaOpcoes([]);
        setResultado(null);
        AsyncStorage.removeItem(CONFIG.STORAGE_KEYS.LISTA).catch(() => {}) // Limpa a memória física do celular  
    }, []);

    const limparHistorico = useCallback(() => {
        Alert.alert(
            "Apagar Histórico",
            `Tem certeza que deseja deletar o histórico?`, [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Apagar",
                    onPress: () => {
                        setHistorico([]);
                        return;
                    },
                    style: "destructive"
                }
            ]
        )
        
    }, [])

    //remover individualmente baseado no index
    const removerOpcao = useCallback((indexParaRemover) => {
        const itemNome = listaOpcoes[indexParaRemover];

        Alert.alert(
            "Remover opção",
            `Tem certeza que deseja apagar ${itemNome}?`, [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Apagar",
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); //animação suave de remoção
                        setListaOpcoes((prev) => prev.filter((_, index) => index !== indexParaRemover));
                    }, 
                    style: "destructive"
                }
            ]
        )
    }, [listaOpcoes]);


    useEffect(() => {
        // Referência para controlar se o sorteio está bloqueado (aguardando o tempo passar)
        let execultandoSorteio = false;

        Accelerometer.setUpdateInterval(CONFIG.SENSORES.INTERVALO_MS); 

        const assinatura = Accelerometer.addListener(({ x, y, z}) => {
        // CÁLCULO VETORIAL: O sensor devolve a aceleração nos eixos X, Y e Z baseados na gravidade 
        // Usa a fórmula da Magnitude do Vetor Tridimensional (Teorema de Pitágoras em 3D)
            const aceleracaoTotal = Math.sqrt(x * x + y * y + z * z);
            // Se o valor ultrapassar 2.6, significa que uma força externa (o chacoalho) foi aplicada
            // Se ultrapassar o limite E não estiver no meio do tempo de espera
            if (aceleracaoTotal > CONFIG.SENSORES.FORCA_CHACOALHO && !execultandoSorteio) {
                execultandoSorteio = true;
                sortear();

                // Trava por 1.5 segundos antes de permitir chacoalhar de novo
                setTimeout(() => {
                    execultandoSorteio = false;
                }, CONFIG.SENSORES.DEBOUNCE_MS);
            }
        });
        return () => assinatura && assinatura.remove(); //limpeza para evitar memory leak
    }, [sortear]); // O efeito depende da função sortear atualizada com a lista atual

    const [carregando, setCarregando] = useState(false);

    const gerarSugestoesIA = useCallback(async () => {
    if (opcao.trim() === '') {
        Alert.alert('Digite uma categoria', 'Exemplo: Filme de terror, Restaurante...');
        return;
    }

    setCarregando(true);
    try {
        const sugestoes = await obterSugestoesIA(opcao.trim());
        if (sugestoes && sugestoes.length > 0) {
        // Adiciona as sugestões retornadas pela IA à sua lista atual sem duplicar
        setListaOpcoes((prev) => Array.from(new Set([...prev, ...sugestoes])));
        setOpcao(''); // Limpa o input
        } else {
        Alert.alert('Aviso', 'A IA não retornou sugestões para essa categoria.');
        }
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível gerar sugestões com a IA.');
    } finally {
        setCarregando(false);
    }

    try {
    console.log("Enviando requisição para:", API_URL);
    const sugestoes = await obterSugestoesIA(opcao.trim());
    console.log("Sugestões recebidas:", sugestoes);
    // ... resto do código
    } catch (error) {
    console.error("Erro detalhado no fetch:", error); // <--- Veja a mensagem no terminal do Expo
    Alert.alert('Erro', `Falha ao gerar: ${error.message}`);
    }

    }, [opcao]);

    return {opcao, setOpcao, listaOpcoes, resultado, adicionarOpcao, sortear, limparTudo, removerOpcao, historico, categoria, salvarListaComoCategoria, carregarCategoria, deletarCategoria, limparHistorico, gerarSugestoesIA, carregando};
}