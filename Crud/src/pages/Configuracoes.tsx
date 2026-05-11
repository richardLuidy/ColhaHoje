import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../colors';
import styles from '../../styles'; 

export default function Configuracoes({ onVoltar }: { onVoltar: () => void }) {
    const [notificacoes, setNotificacoes] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometria, setBiometria] = useState(false);

    const handleManutencao = () => {
        Alert.alert("Em breve", "Esta funcionalidade será liberada na próxima atualização da colheita! 🍎");
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* CABEÇALHO GRANDÃO (HERO) */}
                <View style={styles.headerConfigContainer}>
                    <View>
                        <Text style={styles.headerConfigTitle}>Configurações</Text>
                        <Text style={styles.headerConfigSubtitle}>Personalize sua experiência no ColhaHoje</Text>
                    </View>
                    <View style={styles.headerConfigIcon}>
                        <Ionicons name="settings" size={26} color={colors.verdeColheita} />
                    </View>
                </View>

                {/* SESSÃO: PREFERÊNCIAS */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="leaf-outline" size={16} color={colors.verdeColheita} />
                    <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
                </View>
                
                <View style={styles.cardConfig}>
                    <View style={styles.itemRowConfig}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="notifications-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Notificações Push</Text>
                                <Text style={styles.itemSubtitleConfig}>Receba avisos e novidades</Text>
                            </View>
                        </View>
                        <Switch 
                            value={notificacoes} 
                            onValueChange={setNotificacoes} 
                            trackColor={{ false: "#E0E0E0", true: colors.verdeColheita }}
                        />
                    </View>

                    <View style={styles.dividerConfig} />

                    <View style={styles.itemRowConfig}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="moon-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Modo Escuro</Text>
                                <Text style={styles.itemSubtitleConfig}>Tema escuro do aplicativo</Text>
                            </View>
                        </View>
                        <Switch 
                            value={darkMode} 
                            onValueChange={(val) => { setDarkMode(val); handleManutencao(); }} 
                            trackColor={{ false: "#E0E0E0", true: colors.verdeColheita }}
                        />
                    </View>
                </View>

                {/* SESSÃO: SEGURANÇA */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.verdeColheita} />
                    <Text style={styles.sectionTitle}>SEGURANÇA</Text>
                </View>
                
                <View style={styles.cardConfig}>
                    <TouchableOpacity style={styles.itemRowConfig} onPress={handleManutencao}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="lock-closed-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Alterar Senha</Text>
                                <Text style={styles.itemSubtitleConfig}>Altere sua senha de acesso</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={styles.dividerConfig} />

                    <View style={styles.itemRowConfig}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="finger-print-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Usar Biometria</Text>
                                <Text style={styles.itemSubtitleConfig}>Acesse com impressão digital</Text>
                            </View>
                        </View>
                        <Switch 
                            value={biometria} 
                            onValueChange={setBiometria} 
                            trackColor={{ false: "#E0E0E0", true: colors.verdeColheita }}
                        />
                    </View>
                </View>

                {/* SESSÃO: SUPORTE */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="headset-outline" size={16} color={colors.verdeColheita} />
                    <Text style={styles.sectionTitle}>SUPORTE</Text>
                </View>
                
                <View style={styles.cardConfig}>
                    <TouchableOpacity style={styles.itemRowConfig} onPress={handleManutencao}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="help-circle-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Central de Ajuda</Text>
                                <Text style={styles.itemSubtitleConfig}>Tire dúvidas e encontre soluções</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={styles.dividerConfig} />

                    <TouchableOpacity style={styles.itemRowConfig} onPress={handleManutencao}>
                        <View style={styles.itemLeftConfig}>
                            <View style={styles.iconBoxConfig}>
                                <Ionicons name="document-text-outline" size={20} color={colors.verdeColheita} />
                            </View>
                            <View style={styles.textContainerConfig}>
                                <Text style={styles.itemTitleConfig}>Termos de Privacidade</Text>
                                <Text style={styles.itemSubtitleConfig}>Leia nossos termos e políticas</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </TouchableOpacity>
                </View>

                {/* BOTÃO EXCLUIR CONTA */}
                <TouchableOpacity 
                    style={styles.deleteCardConfig}
                    onPress={() => Alert.alert("Atenção", "Deseja mesmo excluir sua conta? Esta ação é irreversível.")}
                >
                    <View style={styles.itemLeftConfig}>
                        <View style={styles.deleteIconBoxConfig}>
                            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                        </View>
                        <View style={styles.textContainerConfig}>
                            <Text style={styles.deleteTitleConfig}>Excluir minha conta permanentemente</Text>
                            <Text style={styles.deleteSubtitleConfig}>Todos os seus dados serão apagados</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#DC2626" />
                </TouchableOpacity>

                <Text style={styles.footerTextConfig}>ColhaHoje v1.0.2 • Registro/SP</Text>

            </ScrollView>
        </View>
    );
}