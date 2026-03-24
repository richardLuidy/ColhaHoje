import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Mapa() {
    return (
        <View >
            <Text style={styles.title}>Aqui vai ser a Tela de Mapa!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEBEB', // Aquele cinza claro de fundo do Figma
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32', // Verde Colheita
    }
});