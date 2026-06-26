import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated ,View } from 'react-native';
import { colors } from '../theme/colors';

export function ResultadoDisplay({resultado}) {
    // referências para os valores da animação
    // escala 0 (invisível) e opacidade 0
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (resultado) {
        // reseta a animação para o estado inicial toda vez que o resultado muda
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);

    // sequência de animação em paralelo
        Animated.parallel([
            // Efeito de Mola (Spring) para a escala (faz o "pulo")
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4, // Controle de resistência (menor = mais balanço)
                tension: 40, // Velocidade da mola
                useNativeDriver: true, // Melhora a performance
            }),
            // Efeito de Surgimento suave (Fade-in)
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }
    }, [resultado]);

    if (!resultado) return <View style={styles.containerVazio}/>

    return (
      <Animated.View style={[
        styles.container, {
          opacity: opacityAnim,
          transform: [{scale: scaleAnim}]
        }
      ]}>
          <Text style={styles.label}>O escolhido foi: </Text>
          <Text style={styles.texto}>{resultado}</Text>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceAccent,
        paddingVertical: 28,
        paddingHorizontal: 20,
        borderRadius: 28,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    containerVazio: {
        height: 120, 
        marginBottom: 24,
    },
    label: {
        color: colors.textMuted,
        fontSize: 13,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 2, 
    },
    texto: {
        color: colors.secondary, 
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});
