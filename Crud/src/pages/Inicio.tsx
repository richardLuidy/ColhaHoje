import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Inicio() {
    return (
        <View >
            <Text style={styles.title}>Aqui vai ser a Tela de Início!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
   
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32', // Verde Colheita
    }
});