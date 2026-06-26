import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ResultadoDisplay({resultado}) {
    if (!resultado) return null;

    return (
    <View style={styles.container}>
      <Text style={styles.label}>A escolha é:</Text>
      <Text style={styles.texto}>{resultado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceAccent,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  texto: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
});
