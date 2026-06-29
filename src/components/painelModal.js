import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, TextInput, FlatList } from 'react-native';
import { colors } from '../theme/colors';

export function PainelModal({ 
  visible, 
  onClose, 
  nomeTemplate, 
  setNomeTemplate, 
  onSalvar, 
  categoria, 
  carregarCategoria, 
  deletarCategoria, 
  historico, 
  limparHistorico 
}) {
  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalFundo}>

        {/* Cabeçalho do Modal */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>Seu Espaço</Text>
          <TouchableOpacity style={styles.botaoFecharModal} onPress={onClose}>
            <Text style={styles.textoBotaoFecharModal}>✕ Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Card: Salvar Lista */}
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
            <TouchableOpacity style={styles.botaoSalvarModal} onPress={onSalvar}>
              <Text style={styles.textoBotaoSalvarModal}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card: Templates Salvos */}
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
                  <TouchableOpacity 
                    style={styles.toqueCategoria}
                    onPress={() => {
                      carregarCategoria(item);
                      onClose();
                    }}
                  >
                    <Text style={styles.textoNomeCategoria}>{item}</Text>
                    <Text style={styles.textoQtdItens}>{categoria[item].length} itens</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletarCategoria(item)}>
                    <Text style={styles.textoDeletar}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Card: Últimos Sorteados */}
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
  );
}

const styles = StyleSheet.create({
  modalFundo: {
    flex: 1,
    backgroundColor: colors.background,
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