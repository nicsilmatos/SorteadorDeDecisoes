import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useDecisionEngine } from './src/hooks/fazerDecisao';
import { ResultadoDisplay } from './src/components/resultadoDisplay';
import { DecisionInput } from './src/components/inputDecisao';
import { DecisionList } from './src/components/listaDecisao';
import { colors } from './src/theme/colors'

export default function App() {

  // Desestrutura todas as ferramentas necessárias do hook 
  const {opcao, setOpcao, listaOpcoes, resultado, adicionarOpcao, sortear, limparTudo, removerOpcao} = useDecisionEngine();
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.titulo}>Sorteador de Decisões</Text>

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
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20, 
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
});
