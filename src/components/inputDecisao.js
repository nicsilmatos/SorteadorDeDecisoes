import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { colors } from '../theme/colors';

export function DecisionInput({ value, onChangeText, onAdd }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ex: Filme de Terror, Pizzaria..."
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.botao} onPress={onAdd}>
        <Text style={styles.textoBotao}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 10,
  },
  botao: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    borderRadius: 12,
  },
  textoBotao: {
    color: colors.background,
    fontSize: 28,
    fontWeight: 'bold',
  },
});