import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useDecisionEngine } from './src/hooks/fazerDecisao';
import { ResultadoDisplay } from './src/components/resultadoDisplay';
import { DecisionInput } from './src/components/inputDecisao';
import { DecisionList } from './src/components/listaDecisao';
import { PainelModal } from './src/components/painelModal';
import { colors } from './src/theme/colors'
import { Platform, UIManager } from 'react-native'; //Para que a animação de remoção funcione em dispositivos Android antigos 
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {

  const {opcao, setOpcao, listaOpcoes, resultado, adicionarOpcao, sortear, limparTudo, removerOpcao, historico, categoria, salvarListaComoCategoria, carregarCategoria, deletarCategoria, limparHistorico} = useDecisionEngine();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeTemplate, setNomeTemplate] = useState('');

  // Validador local que impede a criação de listas sem título antes de acionar a regra do hook
  const lidarComSalvar = () => {
    if (nomeTemplate.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite um nome para o seu template.');
      return;
    }
    salvarListaComoCategoria(nomeTemplate);
    setNomeTemplate(''); // Reseta o input da pagina após salvar
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPrincipal}>
          <Text style={styles.titulo}>Sorteador de Decisões</Text>
          <TouchableOpacity 
          style={styles.botaoAbrirModal} 
          onPress={() => setModalVisivel(true)}
          accessible={true}
          accessibilityLabel='Abrir menu de templates e histórico'
          accessibilityRole='button'>
          <Text style={styles.textoBotaoAbrirModal}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <ResultadoDisplay resultado={resultado}/>

      <DecisionInput
      value={opcao}
      onChangeText={setOpcao}
      onAdd={adicionarOpcao}
      />

      <DecisionList 
      data={listaOpcoes}
      onRemove={removerOpcao}
      />

      <View style={styles.containerAcoes}>
        <TouchableOpacity style={styles.botaoSortear} onPress={sortear}>
          <Text style={styles.textoBotaoSortear}>Sortear (ou chacoalhe)</Text>
        </TouchableOpacity>

        {/* O botao de limpar so aparece quando a lista tem mais de 0 itens */}
        {listaOpcoes.length > 0 && (
          <TouchableOpacity style={styles.botaoLimpar} onPress={limparTudo}>
            <Text style={styles.textoBotaoLimpar}>Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      <PainelModal
      visible={modalVisivel}
      onClose={() => setModalVisivel(false)}
      nomeTemplate={nomeTemplate}
      setNomeTemplate={setNomeTemplate}
      onSalvar={lidarComSalvar}
      categoria={categoria}
      carregarCategoria={carregarCategoria}
      deletarCategoria={deletarCategoria}
      historico={historico}
      limparHistorico={limparHistorico}
      />
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: colors.background, 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    padding: 30,
    textAlign: 'center',
  },
  containerAcoes: {
    gap: 10, 
    marginTop: 20,
  },
  botaoSortear: {
    backgroundColor: colors.secondary, 
    padding: 18, 
    borderRadius: 12,
    alignItems: 'center', 
  },
  textoBotaoSortear: {
    color: colors.background, 
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoLimpar: {
    padding: 12,
    alignItems: 'center',
  },
  textoBotaoLimpar: {
    color: colors.error,
    fontSize: 16,
  },
  headerPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  textoBotaoAbrirModal: {
    color: colors.textSecondary,
    fontSize: 35,
    padding: 10,
    fontWeight: '600',
  },
});
