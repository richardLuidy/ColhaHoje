import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles'; // 🟢 Usando o seu styles global

export default function Configuracoes({ onVoltar }: { onVoltar: () => void }) {
    const [notificacoes, setNotificacoes] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometria, setBiometria] = useState(false);

    const handleManutencao = () => {
        Alert.alert("Em breve", "Esta funcionalidade será liberada na próxima atualização da colheita! 🍎");
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            
            {/* Título centralizado sem a seta interna (já existe no Header global) */}
            <View style={{ padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.cinzaTecnico }}>Configurações</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 15 }}>
                
                <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
                
                <View style={styles.cardConfig}>
                    <View style={styles.itemRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="notifications-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Notificações Push</Text>
                        </View>
                        <Switch 
                            value={notificacoes} 
                            onValueChange={setNotificacoes} 
                            trackColor={{ false: "#767577", true: colors.verdeColheita }}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.itemRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="moon-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Modo Escuro</Text>
                        </View>
                        <Switch 
                            value={darkMode} 
                            onValueChange={(val) => { setDarkMode(val); handleManutencao(); }} 
                            trackColor={{ false: "#767577", true: colors.verdeColheita }}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>SEGURANÇA</Text>
                
                <View style={styles.cardConfig}>
                    <TouchableOpacity style={styles.itemRow} onPress={handleManutencao}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="lock-closed-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Alterar Senha</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.itemRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="finger-print-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Usar Biometria</Text>
                        </View>
                        <Switch 
                            value={biometria} 
                            onValueChange={setBiometria} 
                            trackColor={{ false: "#767577", true: colors.verdeColheita }}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>SUPORTE</Text>
                
                <View style={styles.cardConfig}>
                    <TouchableOpacity style={styles.itemRow} onPress={handleManutencao}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="help-circle-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Central de Ajuda</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.itemRow} onPress={handleManutencao}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="document-text-outline" size={22} color={colors.verdeColheita} />
                            <Text style={styles.itemText}>Termos de Privacidade</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.cardConfig, { marginTop: 20, alignItems: 'center', paddingVertical: 15 }]}
                    onPress={() => Alert.alert("Atenção", "Deseja mesmo excluir sua conta? Esta ação é irreversível.")}
                >
                    <Text style={{ color: '#FF4444', fontSize: 13, fontWeight: '500' }}>Excluir minha conta permanentemente</Text>
                </TouchableOpacity>

                <Text style={{ textAlign: 'center', color: '#CCC', fontSize: 11, marginTop: 15 }}>ColhaHoje v1.0.2 • Registro/SP</Text>

            </ScrollView>
        </View>
    );
}