import React from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export function DecisionList({ data, onRemove }) {
  return (
    <FlatList
      data={data} //passa a lista de dados para a FlatList inteirar
      //keyExtractor: Gera um identificador único para cada item da lista na renderização
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.texto}>{item}</Text>
          <TouchableOpacity style={styles.botaoRemover} onPress={() => onRemove(index)}>
            <Text style={styles.textoBotaoRemover}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      style={styles.lista}
      //ListEmptyComponent: Se o array fornecido em "data" estiver completamente vazio, ela renderiza automaticamente
      //o componente visual passando aqui ao inves da lista
      ListEmptyComponent={
        <Text style={styles.listaVazia}>Sua lista está vazia. Adicione opções acima</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  item: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  texto: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  botaoRemover: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  textoBotaoRemover: {
    color: colors.error, 
    fontSize: 16,
    fontWeight: 'bold',
  },
  listaVazia: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});