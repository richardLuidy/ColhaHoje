// styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

    // =======================================================
    // 📱 ESTILOS DO App.tsx (Estrutura Principal e Footer)
    // =======================================================

    // Container principal do aplicativo
    container: {
        flex: 1,
        backgroundColor: colors.branco,
    },

    // Área de conteúdo central das telas
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Título principal das telas
    screenTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.verdeColheita,
    },

    // Subtítulo descritivo abaixo do título
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: colors.cinzaTecnico,
    },

    // Barra de navegação inferior (Rodapé)
    footer: {
        width: width,
        borderTopWidth: 1,
        borderTopColor: colors.placeholder,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.branco,
        paddingVertical: 8,
    },

    // Botão de cada aba no footer
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    // Texto da aba quando está inativa
    tabLabel: {
        marginTop: 4,
        fontSize: 12,
        color: colors.cinzaTecnico,
    },

    // Texto da aba quando está selecionada
    tabLabelActive: {
        color: colors.verdeColheita,
        fontWeight: '700',
    },

    // =======================================================
    // 🟢 ESTILOS DO Header.tsx (Cabeçalho Verde)
    // =======================================================

    // Container principal do cabeçalho superior
    headerContainer: {
        width: '100%',
        height: 100,
        paddingTop: 50,
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

    // Lado esquerdo do header (geralmente vazio ou botão voltar)
    headerSide: {
        justifyContent: 'center',
    },

    // Parte central do header onde fica o título
    headerCenter: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    // Container de ações do lado direito (Lupa, Perfil)
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20,
    },

    // Texto "ColhaHoje" no cabeçalho
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.branco,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },

    // Botão de ícone clicável
    iconButton: {
        padding: 5,
    },

    // Container que segura a busca e a seta de voltar
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

    // O campo real de digitação da pesquisa
    searchInput: {
        flex: 1,
        color: colors.cinzaTecnico,
        fontSize: 16,
        padding: 0,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },

   // =======================================================
    // 🔑 ESTILOS DA TELA DE LOGIN (Login.tsx) - LIMPO E CENTRALIZADO
    // =======================================================

    // Container principal da tela de Login
    containerLogin: {
        flexGrow: 1, // Permite centralizar o conteúdo no meio da tela
        backgroundColor: colors.branco,
        alignItems: 'center',
        justifyContent: 'center', // Centraliza tudo na vertical
        paddingVertical: 40,
    },

    // Container que segura o menu "Login / Cadastre-se"
    navContainer: {
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 40,
    },

    // Texto da aba selecionada (Login)
    navTextActive: {
        fontSize: 18,
        color: colors.verdeColheita,
        fontWeight: 'bold',
    },

    // Texto da aba não selecionada (Cadastre-se)
    navTextInactive: {
        fontSize: 18,
        color: colors.cinzaTecnico,
        fontWeight: '500',
    },

    // O separador "/" entre os textos do menu
    navTextSeparator: {
        fontSize: 18,
        color: colors.cinzaTecnico,
        marginHorizontal: 5,
    },

   // Container branco arredondado dos Inputs (Email e Senha)
    inputContainer: {
        width: width * 0.85,
        height: 60,
        backgroundColor: colors.branco,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,

        // 🟢 SOLUÇÃO DEFINITIVA DO SOMBREADO:
        // Zeramos o elevation para sumir com o rastro quadrado do Android
        elevation: 0, 
        
        // Usamos uma borda sutil para dar definição ao campo
        borderWidth: 1,
        borderColor: '#E0E0E0', 

        // Sombra suave (funciona bem em iOS e versões novas de Android)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },

    // Texto fixo dentro do input (ex: Email:)
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
        marginLeft: 10,
        marginRight: 5,
    },

    // Área de digitação do usuário
    inputField: {
        flex: 1,
        fontSize: 16,
        color: colors.cinzaTecnico,
    },

    // Botão verde de ação principal
    buttonPrimary: {
        width: width * 0.65,
        height: 55,
        backgroundColor: colors.verdeColheita,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },

    // Texto branco dentro do botão
    buttonText: {
        color: colors.branco,
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Link para recuperação de senha
    forgotPasswordText: {
        marginTop: 15,
        color: colors.cinzaTecnico,
        fontSize: 14,
        textDecorationLine: 'underline',
    },

    // Mensagem de erro embaixo do input
    errorText: {
        color: 'red',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: -15, 
        marginBottom: 10,
        textAlign: 'center',
    },


   // =======================================================
    // ESTILOS DO PERFIL (Perfil.tsx)
    // =======================================================

    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.verdeColheita,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.cinzaTecnico,
        marginBottom: 31,
    },

    // 🟢 CLASSE NOVA: Base com sombreado para os botões do Perfil
    profileMenuButton: {
        width: '85%', // Mesma largura que os inputs usavam
        height: 60,
        backgroundColor: '#FFFFFF', // Fundo branco obrigatório para a sombra funcionar
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        // A MÁGICA DA SOMBRA:
        elevation: 6, // Para o Android
        shadowColor: '#000', // Para o iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },

    buttonSeller: {
        borderColor: colors.verdeColheita,
        borderWidth: 1.5,
        marginTop: 10,
        // 🟢 Sombra adicionada no Quero Vender também!
        backgroundColor: '#FFFFFF',
        elevation: 6, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    inputLabelSeller: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.verdeColheita,
        marginLeft: 10,
        flex: 1, 
    },
    iconChevron: {
        marginLeft: 'auto',
    },
    logoutButton: {
        marginTop: 30, 
        height: 50, 
        borderWidth: 1.5,
        borderColor: '#FF4444', 
        borderRadius: 25, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%', 
        alignSelf: 'center', 
    },
    logoutText: {
        color: '#FF4444',
        fontWeight: 'bold',
        fontSize: 16,
    },

// =======================================================
    // 🏪 ESTILOS DA TELA QUERO VENDER (QueroVender.tsx)
    // =======================================================

    containerQueroVender: {
        padding: 20,
        backgroundColor: colors.branco,
    },
    tituloSessaoItalico: {
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000',
        marginBottom: 15,
    },
    tituloSessao: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.verdeColheita,
    },
    rowCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardPequeno: {
        backgroundColor: colors.branco,
        width: '48%',
        padding: 15,
        borderRadius: 15,
        elevation: 3,
        alignItems: 'center',
    },
    cardLabel: {
        fontSize: 14,
        color: colors.cinzaTecnico,
    },
    cardValor: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    areaInfoVendas: {
        alignItems: 'center', 
        marginTop: 10,
    },
    areaGreyDots: {
        flexDirection: 'row', 
        gap: 2, 
        marginVertical: 5,
    },
    greyDot: {
        width: 6, 
        height: 6, 
        borderRadius: 3, 
        backgroundColor: '#ccc',
    },
    badgeVerde: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 5,
    },
    badgeTexto: {
        color: colors.verdeColheita,
        fontSize: 12,
        fontWeight: 'bold',
    },
    areaPlantIcons: {
        flexDirection: 'row', 
        marginTop: 10, 
        gap: 4, 
        justifyContent: 'center',
    },
    
    // 🟢 OFERTA RELÂMPAGO (ESTRUTURA FIEL AO FIGMA: 2 CARDS)
    
    // 1º CARD (Brancão de fundo com sombra)
    cardDestaqueBrancao: {
        backgroundColor: colors.branco,
        borderRadius: 20,
        padding: 15,
        elevation: 4, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        position: 'relative',
        marginTop: 20,
        marginBottom: 10,
    },
    headerDestaque: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    
    // 2º CARD (Laranjado por dentro)
    cardMenorLaranjado: {
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#FFA000', // Borda Laranja
        marginBottom: 15,
    },
    tituloOfertaLaranjaItalico: {
        color: '#FF8F00',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    areaDestaqueConteudo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    areaDestaqueEsquerda: {
        width: '55%',
    },
    areaImagemPlaceholderGrande: {
        backgroundColor: '#EEEEEE',
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    areaDestaqueDireita: {
        width: '42%',
        alignItems: 'flex-end',
    },
    textoPrecoNormalZeradoDetalhe: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    textoPrecoDestaqueZeradoGrande: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.verdeColheita,
        marginTop: 2,
        marginBottom: 10,
    },
    textoTimerLabelZerado: {
        fontSize: 12,
        color: '#333',
    },
    textoTimerZeradoGrande: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    
    // Textos que ficam no Card Brancão, abaixo do Laranjado
    tituloProdutoOfertaGeral: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    descProdutoOfertaGeral: {
        fontSize: 10,
        color: colors.cinzaTecnico,
        marginTop: 3,
    },
    btnVerPedidosOuter: {
        backgroundColor: colors.verdeColheita,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
   btnRedondoFlutuante: {
        backgroundColor: colors.verdeColheita,
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -20,
        right: 0,    
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    textoIconeFlutuante: {
        color: colors.branco, 
        fontSize: 11, 
        fontWeight: 'bold',
        marginTop: 4,
    },

    // 🟢 ESTOQUE
    cardEstoque: {
        backgroundColor: colors.branco,
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        elevation: 3,
        alignItems: 'center',
    },
    quadradoAdicionarCentral: {
        backgroundColor: '#E0E0E0',
        width: 80,
        height: 80,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoEstoque: {
        flex: 1,
    },
    tituloEstoque: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    descEstoque: {
        fontSize: 11,
        color: colors.cinzaTecnico,
        marginTop: 3,
        marginBottom: 10,
    },
    btnCadastrar: {
        backgroundColor: colors.verdeColheita,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    textoBtnBranco: {
        color: colors.branco, 
        fontSize: 12, 
        fontWeight: 'bold',
    },
});

export default styles;