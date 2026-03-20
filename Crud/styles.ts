// styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

    // =======================================================
    // 📱 ESTILOS DO App.tsx (Estrutura Principal e Footer)
    // =======================================================
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

    // =======================================================
    // 🟢 ESTILOS DO Header.tsx (Cabeçalho Verde)
    // =======================================================
    headerContainer: {
        width: '100%',
        height: 100, 
        paddingBottom: 15,
        backgroundColor: colors.verdeColheita, 
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4, 
    },
    headerSide: {
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1, 
        alignItems: 'flex-start', 
        justifyContent: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20, 
    },
    headerTitle: {
        fontSize: 22, 
        fontWeight: 'bold',
        color: colors.branco,
    },
    iconButton: {
        padding: 5, 
    },

    //  (Barra de Pesquisa)
    // Container que segura a Seta de Voltar e a Barra de Texto Lado a Lado
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },

    // A Barra de Pesquisa Branca Arredondada
    searchInputFieldContainer: {
        flex: 1, 
        height: 40, 
        backgroundColor: colors.branco, 
        borderRadius: 20, 
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15, 
    },

    // O componente TextInput real onde o usuário vai digitar
    searchInput: {
        flex: 1, // Estica para ocupar o máximo dentro da barra branca
        color: colors.cinzaTecnico, // Cor do texto quando o usuário digita
        fontSize: 16,
        padding: 0, // Importante para zerar os paddings padrão do Android
    }
});

export default styles;