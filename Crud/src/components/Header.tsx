// src/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../colors';
import styles from '../../styles';

// Importar SVGs diretamente
import LupaBranca from '../../src/assets/Lupa_Branca.svg';
import LupaPreta from '../../src/assets/Lupa_Preta.svg';
import SacolaBranca from '../../src/assets/Sacola_Branca.svg';
import SetaVoltarBranca from '../../src/assets/Seta_Voltar_Branca.svg';

// 🟢 Definindo o tipo TabKey para matar o erro do VS Code
type TabKey = 'inicio' | 'mapa' | 'ofertas' | 'pedidos' | 'perfil' | 'login' | 'cadastro';

const headerConfig: Record<TabKey, { title: string; showBack?: boolean; showActions?: boolean }> = {
    inicio: { title: 'ColhaHoje', showActions: true },
    mapa: { title: 'ColhaHoje', showActions: true },
    ofertas: { title: 'ColhaHoje', showActions: true },
    pedidos: { title: 'ColhaHoje', showActions: true },
    perfil: { title: 'ColhaHoje', showBack: false, showActions: false },
    login: { title: '' },
    cadastro: { title: '' },
};

interface HeaderProps {
    activeTab: TabKey;
    onBackPress?: () => void;
    forceShowBack?: boolean;
    esconderSetaForçado?: boolean; // 🟢 Nova prop para sumir com a seta quando quisermos
}

export default function Header({ activeTab, onBackPress, forceShowBack, esconderSetaForçado }: HeaderProps) {
    const [isSearching, setIsSearching] = useState(false);

    // Se for login ou cadastro, o header nem aparece
    if (activeTab === 'login' || activeTab === 'cadastro') return null;
    
    const currentHeader = headerConfig[activeTab];

    // 🟢 Lógica de botão de voltar: se 'esconderSetaForçado' for true, a seta NUNCA aparece
    const showBackButton = esconderSetaForçado ? false : (currentHeader?.showBack || forceShowBack);

    if (isSearching) {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={() => setIsSearching(false)} style={styles.iconButton}>
                        <SetaVoltarBranca width={28} height={28} />
                    </TouchableOpacity>

                    <View style={styles.searchInputFieldContainer}>
                        <View style={{ marginRight: 10 }}>
                            <LupaPreta width={24} height={24} />
                        </View>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Morangos"
                            placeholderTextColor={colors.placeholder}
                            autoFocus={true} 
                        />
                    </View>

                    <TouchableOpacity style={styles.iconButton}>
                        <SacolaBranca width={28} height={28} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerSide}>
                {showBackButton && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
                        <SetaVoltarBranca width={28} height={28} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{currentHeader?.title || 'ColhaHoje'}</Text>
            </View>

            <View style={[styles.headerSide, styles.actionsContainer]}>
                {currentHeader?.showActions && (
                    <>
                        <TouchableOpacity style={styles.iconButton} onPress={() => setIsSearching(true)}>
                            <LupaBranca width={28} height={28} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            <SacolaBranca width={28} height={28} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}