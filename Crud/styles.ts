// styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backGroundPage, // Usando o fundo cinza claro das imagens
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.verdeColheita, // Título com o verde principal
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: colors.cinzaTecnico, // Subtítulo com o cinza técnico
    },
    footer: {
        width: width,
        borderTopWidth: 1,
        borderTopColor: colors.placeholder,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.branco, // Footer com o fundo branco oficial
        paddingVertical: 8,
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    tabLabel: {
        marginTop: 4,
        fontSize: 12,
        color: colors.cinzaTecnico, // Texto inativo
    },
    tabLabelActive: {
        color: colors.verdeColheita, // Texto ativo com o verde da colheita
        fontWeight: '700',
    },
});

export default styles;