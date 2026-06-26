import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, TextInput, FlatList, Alert } from 'react-native';
import { useDecisionEngine } from './src/hooks/fazerDecisao';
import { ResultadoDisplay } from './src/components/resultadoDisplay';
import { DecisionInput } from './src/components/inputDecisao';
import { DecisionList } from './src/components/listaDecisao';
import { colors } from './src/theme/colors'

export default function App() {

  const {opcao, setOpcao, listaOpcoes, resultado, adicionarOpcao, sortear, limparTudo, removerOpcao, historico, categoria, salvarListaComoCategoria, carregarCategoria, deletarCategoria, limparHistorico} = useDecisionEngine();

  {/* cabeçalho principal: Alinha o título do app lado a lado com o botão de acesso ao Painel */}
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
      {/* cabeçalho principal: Alinha o título do app lado a lado com o botão de acesso ao Painel */}
      <View style={styles.headerPrincipal}>
          <Text style={styles.titulo}>Sorteador de Decisões</Text>
          <TouchableOpacity style={styles.botaoAbrirModal} onPress={() => setModalVisivel(true)}>
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
      
      <Modal animationType="slide" transparent={true} visible={modalVisivel} onRequestClose={() => setModalVisivel(false)}>
        <SafeAreaView style={styles.modalFundo}>

          {/* Cabeçalho de fechamento do Modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Seu Espaço</Text>
            <TouchableOpacity style={styles.botaoFecharModal} onPress={() => setModalVisivel(false)}>
              <Text style={styles.textoBotaoFecharModal}>✕ Fechar</Text>
            </TouchableOpacity>
          </View>

          {/* criar um novo Template baseado no que está digitado lá na tela inicial */}
          <View style={styles.secaoCard}>
            <Text style={styles.secaoTitulo}>Salvar lista atual</Text>
            <View style={styles.rowInput}>
              <TextInput
                style={styles.inputModal}
                placeholder="Nome da lista (Ex: Filmes)"
                placeholderTextColor={colors.textMuted}
                value={nomeTemplate}
                onChangeText={setNomeTemplate}
              />
              <TouchableOpacity style={styles.botaoSalvarModal} onPress={lidarComSalvar}>
                <Text style={styles.textoBotaoSalvarModal}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*Listagem dinâmica dos templates criados usando Object.keys() para transformar chaves em array */}
          <View style={[styles.secaoCard, { flex: 1 }]}>
            <Text style={styles.secaoTitulo}>Templates Salvos</Text>
            {Object.keys(categoria).length === 0 ? (
              <Text style={styles.textoListaVazia}>Nenhum template cadastrado.</Text>
            ) : (
              <FlatList
                data={Object.keys(categoria)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={styles.itemCategoria}>
                    {/* Ao clicar, carrega os dados e fecha o painel para o usuário ver as opções na home */}
                    <TouchableOpacity 
                      style={styles.toqueCategoria}
                      onPress={() => {
                        carregarCategoria(item);
                        setModalVisivel(false);
                      }}
                    >
                      <Text style={styles.textoNomeCategoria}>{item}</Text>
                      <Text style={styles.textoQtdItens}>{categoria[item].length} itens</Text>
                    </TouchableOpacity>
                    {/* Botão de exclusão da lista */}
                    <TouchableOpacity onPress={() => deletarCategoria(item)}>
                      <Text style={styles.textoDeletar}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>

          {/* Exibição do histórico de sorteios recentes renderizados*/}
          <View style={styles.secaoCard}>
            <View style={styles.rowHistoricoHeader}>
              <Text style={styles.secaoTitulo}>Últimos Sorteados</Text>
              {historico.length > 0 && (
                <TouchableOpacity onPress={limparHistorico}>
                  <Text style={styles.textoLimparHistorico}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>
            {historico.length === 0 ? (
              <Text style={styles.textoListaVazia}>Nenhum sorteio feito recentemente.</Text>
            ) : (
              <View style={styles.containerHistoricoTags}>
                {historico.map((item, index) => (
                  <View key={index} style={styles.tagHistorico}>
                    <Text style={styles.textoTagHistorico}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
  // ESTILO CORRIGIDO AQUI:
  modalFundo: {
    flex: 1,
    backgroundColor: '#160E1F',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  botaoFecharModal: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  textoBotaoFecharModal: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  secaoCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(246, 219, 192, 0.05)',
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputModal: {
    flex: 1,
    backgroundColor: 'rgba(26, 18, 36, 0.5)',
    color: colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  botaoSalvarModal: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  textoBotaoSalvarModal: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  textoListaVazia: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  itemCategoria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 18, 36, 0.4)',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(246, 219, 192, 0.03)',
  },
  toqueCategoria: {
    flex: 1,
  },
  textoNomeCategoria: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  textoQtdItens: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  textoDeletar: {
    color: colors.error,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  rowHistoricoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoLimparHistorico: {
    color: colors.error,
    fontSize: 13,
  },
  containerHistoricoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagHistorico: {
    backgroundColor: 'rgba(147, 80, 115, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(147, 80, 115, 0.3)',
  },
  textoTagHistorico: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
