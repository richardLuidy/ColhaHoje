// src/components/Header.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../colors';
import styles from '../../styles'; 
import { useCart } from '../contexts/CartContext';

// =======================================================
// 🗂️ TIPAGEM E CONFIGURAÇÃO
// =======================================================
type TabKey = 'mapa' | 'ofertas' | 'inicio' | 'pedidos' | 'carrinho' | 'perfil' | 'login' | 'cadastro';

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
    carrinho: { title: 'ColhaHoje', showBack: false, showActions: false },
    perfil: { title: 'ColhaHoje', showBack: false, showActions: false },
    login: { title: '' },
    cadastro: { title: '' },
};

interface HeaderProps {
    activeTab: TabKey;
    onBackPress?: () => void;
    forceShowBack?: boolean;
    onSearchPress?: () => void;
    onCartPress?: () => void;
}

// =======================================================
// 🚀 COMPONENTE HEADER
// =======================================================
export default function Header({ activeTab, onBackPress, forceShowBack, onSearchPress, onCartPress }: HeaderProps) {
    const { totalItems } = useCart();

    if (activeTab === 'login' || activeTab === 'cadastro') return null;
    
    const currentHeader = headerConfig[activeTab];

    const showBackButton = currentHeader.showBack || forceShowBack;

    // ==========================================
    // 🟢 MODO NORMAL (Logo e Ícones)
    // ==========================================
    return (
        <View style={styles.headerContainer}>

            {/* Lado Esquerdo (Seta no Perfil): Aumentada para 28 */}
            <View style={styles.headerSide}>
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
                            onPress={onSearchPress}
                        >
                            {/* Lupa Branca: Aumentada para 28 */}
                            <SvgUri width={28} height={28} uri={icons.lupaBranca} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
                            {/* Sacola Branca: Aumentada para 28 */}
                            <SvgUri width={28} height={28} uri={icons.sacola} />
                            {totalItems > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{totalItems}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>

        </View>
    );
}