import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import { colors } from '../theme/colors';

export function DecisionInput({ value, onChangeText, onAdd, onGerarIA, carregando }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ex: Filme de Terror, Pizzaria..."
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />

      {/* Botão para chamar a IA */}
      <TouchableOpacity 
        style={[styles.botao, styles.botaoIA]} 
        onPress={onGerarIA}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color={colors.textPrimary} size="small" />
        ) : (
          <Text style={styles.textoBotaoIA}>✨</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={onAdd} disabled={carregando}>
        <Text style={styles.textoBotao}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 25, 
    fontSize: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  botao: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    height: 52,
    borderRadius: 26, 
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botaoIA: {
    backgroundColor: colors.primary,   
  },
  textoBotao: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: 'normal',
    marginTop: -3, 
  },
});