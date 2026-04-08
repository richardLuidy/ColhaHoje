// src/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../colors';
import styles from '../../styles'; 

// =======================================================
// 🗂️ TIPAGEM E CONFIGURAÇÃO
// =======================================================
type TabKey = 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'perfil' | 'login' | 'cadastro';

const icons = {
    lupaBranca: Image.resolveAssetSource(require('../../src/assets/Lupa_Branca.svg')).uri,
    lupaPreta: Image.resolveAssetSource(require('../../src/assets/Lupa_Preta.svg')).uri, 
    sacola: Image.resolveAssetSource(require('../../src/assets/Sacola_Branca.svg')).uri,
    voltar: Image.resolveAssetSource(require('../../src/assets/Seta_Voltar_Branca.svg')).uri,
};

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
}

// =======================================================
// 🚀 COMPONENTE HEADER
// =======================================================
export default function Header({ activeTab, onBackPress, forceShowBack }: HeaderProps) {
    const [isSearching, setIsSearching] = useState(false);

    if (activeTab === 'login' || activeTab === 'cadastro') return null;
    
    const currentHeader = headerConfig[activeTab];

    // ==========================================
    // 🔍 MODO PESQUISA (Barra Branca Ativa)
    // ==========================================
    if (isSearching) {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>

                    {/* Seta de voltar: Aumentada para 28 */}
                    <TouchableOpacity onPress={() => setIsSearching(false)} style={styles.iconButton}>
                        <SvgUri width={28} height={28} uri={icons.voltar} />
                    </TouchableOpacity>

                    {/* Campo de Entrada Branco */}
                    <View style={styles.searchInputFieldContainer}>
                        <View style={{ marginRight: 10 }}>
                            {/* Lupa Preta: Aumentada para 24 para destacar na barra */}
                            <SvgUri width={24} height={24} uri={icons.lupaPreta} />
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Morangos"
                            placeholderTextColor={colors.placeholder}
                            autoFocus={true} 
                        />
                    </View>

                    {/* Sacola: Aumentada para 28 */}
                    <TouchableOpacity style={styles.iconButton}>
                        <SvgUri width={28} height={28} uri={icons.sacola} />
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
    
    // 🟢 AQUI ESTÁ A VARIÁVEL QUE VOCÊ CRIOU
    const showBackButton = currentHeader.showBack || forceShowBack;

    // ==========================================
    // 🟢 MODO NORMAL (Logo e Ícones)
    // ==========================================
    return (
        <View style={styles.headerContainer}>

            {/* Lado Esquerdo (Seta no Perfil): Aumentada para 28 */}
            <View style={styles.headerSide}>
                {/* 🟢A MUDANÇA ESTÁ AQUI: Troquei 'currentHeader.showBack' por 'showBackButton' */}
                {showBackButton && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
                        <SvgUri width={28} height={28} uri={icons.voltar} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Centro: Título Logo */}
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{currentHeader.title}</Text>
            </View>

            {/* Lado Direito: Ações */}
            <View style={[styles.headerSide, styles.actionsContainer]}>
                {currentHeader.showActions && (
                    <>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setIsSearching(true)}
                        >
                            {/* Lupa Branca: Aumentada para 28 */}
                            <SvgUri width={28} height={28} uri={icons.lupaBranca} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton}>
                            {/* Sacola Branca: Aumentada para 28 */}
                            <SvgUri width={28} height={28} uri={icons.sacola} />
                        </TouchableOpacity>
                    </>
                )}
            </View>

        </View>
    );
}