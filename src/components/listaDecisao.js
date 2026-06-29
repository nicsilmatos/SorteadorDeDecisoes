import React from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export function DecisionList({ data, onRemove }) {
  return (
    <FlatList
      data={data} //passa a lista de dados para a FlatList inteirar
      //keyExtractor: Gera um identificador único para cada item da lista na renderização
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.texto}>{item}</Text>
          <TouchableOpacity style={styles.botaoRemover} 
          onPress={() => onRemove(index)}
          accessible={true}
          accessibilityLabel={`Remoção do item ${item}`}
          accessibilityRole='button'>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(246, 219, 192, 0.08)', 
  },
  texto: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  botaoRemover: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  textoBotaoRemover: {
    color: 'rgba(248, 244, 233, 0.3)', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  listaVazia: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic',
  },
});