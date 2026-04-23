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
        borderWidth: 1,
        borderColor: '#E0E0E0', 
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
    // 🏠 ESTILOS DA TELA DE MEUS ENDEREÇOS (Enderecos.tsx)
    // =======================================================

    // Container principal que permite rolagem e define o fundo branco
    containerEnderecoCentral: {
        flexGrow: 1,
        backgroundColor: colors.branco,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },

    // Bloco que centraliza o título no topo da tela
    headerEndereco: {
        marginBottom: 30,
        alignItems: 'center',
    },

    // Título principal "Meus Endereços" em verde
    tituloEndereco: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.verdeColheita,
    },

    // Texto informativo acima de cada caixa de entrada
    labelEndereco: {
        marginBottom: 5,
        paddingLeft: 5,
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },

    // Estilo interno do campo de texto (onde o usuário digita)
    inputFieldEndereco: {
        flex: 1,
        height: 50,
        paddingLeft: 15,
        color: '#333',
        fontSize: 16,
    },

    // Container para colocar dois inputs lado a lado na mesma linha
    rowEndereco: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    // Botão arredondado para salvar os dados com sombra
    btnSalvarEndereco: {
        backgroundColor: colors.verdeColheita,
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
        elevation: 4, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },


// =======================================================
    // 🏪 ESTILOS DA TELA QUERO VENDER (QueroVender.tsx)
    // =======================================================

    containerQueroVenderSério: {
        padding: 20,
        backgroundColor: colors.branco,
    },
    tituloSessaoItalicoSério: {
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#000',
        marginBottom: 15,
    },
    tituloSessaoSério: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.verdeColheita,
    },
    rowCardsSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardPequenoSério: {
        backgroundColor: colors.branco,
        width: '48%',
        padding: 15,
        borderRadius: 15,
        elevation: 3,
        alignItems: 'center',
    },
    cardLabelSério: {
        fontSize: 14,
        color: colors.cinzaTecnico,
    },
    cardValorSério: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
    },
    areaInfoVendasSério: {
        alignItems: 'center', 
        marginTop: 10,
    },
    areaGreyDotsSério: {
        flexDirection: 'row', 
        gap: 2, 
        marginVertical: 5,
    },
    greyDotSério: {
        width: 6, 
        height: 6, 
        borderRadius: 3, 
        backgroundColor: '#ccc',
    },
    badgeVerdeSério: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 5,
    },
    badgeTextoSério: {
        color: colors.verdeColheita,
        fontSize: 12,
        fontWeight: 'bold',
    },
    areaPlantIconsSério: {
        flexDirection: 'row', 
        marginTop: 10, 
        gap: 4, 
        justifyContent: 'center',
    },
    
    // 🟠 OFERTA RELÂMPAGO
    cardDestaqueBrancaoSério: {
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
    headerDestaqueSério: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    cardMenorLaranjadoSério: {
        borderRadius: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#FFA000', 
        marginBottom: 15,
    },
    tituloOfertaLaranjaItalicoSério: {
        color: '#FF8F00',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    areaDestaqueConteudoSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    areaDestaqueEsquerdaSério: {
        width: '55%',
    },
    areaImagemPlaceholderGrandeSério: {
        backgroundColor: '#EEEEEE',
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    areaDestaqueDireitaSério: {
        width: '42%',
        alignItems: 'flex-end',
    },
    textoPrecoNormalZeradoDetalheSério: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    textoPrecoDestaqueZeradoGrandeSério: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.verdeColheita,
        marginTop: 2,
        marginBottom: 10,
    },
    textoTimerLabelZeradoSério: {
        fontSize: 12,
        color: '#333',
    },
    textoTimerZeradoGrandeSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    tituloProdutoOfertaGeralSério: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    descProdutoOfertaGeralSério: {
        fontSize: 10,
        color: colors.cinzaTecnico,
        marginTop: 3,
    },
    btnVerPedidosOuterSério: {
        backgroundColor: colors.verdeColheita,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    btnRedondoFlutuanteSério: {
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
    textoIconeFlutuanteSério: {
        color: colors.branco, 
        fontSize: 11, 
        fontWeight: 'bold',
        marginTop: 4,
    },

    // 🟢 ESTOQUE MODO LISTA (GERENCIAR ESTOQUE)
    cardCadastrarNovoSério: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
    },
    infoEstoqueSério: {
        flex: 1,
        marginLeft: 15,
    },
    tituloEstoqueSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
    },
    descEstoqueSério: {
        fontSize: 12,
        color: colors.placeholder,
    },
    cardEstoqueSério: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    imagemEstoqueSério: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 12,
    },
    quadradoPlaceholderSério: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoEstoqueListSério: {
        flex: 1,
    },
    linhaCategoriaBadgeSério: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: -5,
    },
    badgeCategoriaRealSério: {
        backgroundColor: colors.verdeColheita,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeCategoriaTextRealSério: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tituloEstoqueListSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
    },
    linhaPrecoQuantidadeSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    precoEstoqueSério: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
    },
    unidadeEstoqueSério: {
        fontSize: 11,
        color: colors.placeholder,
    },
    quantidadeEstoqueSério: {
        fontSize: 11,
        color: colors.laranjaAlerta,
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontWeight: 'bold',
    },
    btnOpcoesEstoqueSério: {
        padding: 5,
        marginLeft: 5,
    },
    textoBtnBrancoSério: {
        color: colors.branco, 
        fontSize: 12, 
        fontWeight: 'bold',
    },

    // =======================================================
    // 📦 ESTILOS DA TELA DE CADASTRAR PRODUTO (CadastrarProduto.tsx)
    // =======================================================

    // Fundo principal de toda a tela
    telaTodaCadastrar: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    // Header verde no topo com o botão de voltar e título
    headerVerdeCadastrar: {
        backgroundColor: colors.verdeColheita,
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 5,
    },

    // Margem do botão de voltar para não colar no texto
    btnVoltarCadastrar: {
        marginRight: 15,
    },

    // Título "ColhaHoje" dentro do header verde
    tituloHeaderCadastrar: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: 'bold',
    },

    // Container que permite rolagem (ScrollView) e dá o espaçamento nas laterais
    containerScrollCadastrar: {
        padding: 20,
    },

    // Título principal preto da página
    tituloPaginaCadastrar: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },

    // Área que engloba o quadrado de adicionar fotos
    areaFotosCadastrar: {
        marginBottom: 20,
        alignItems: 'center',
    },

    // Quadrado cinza tracejado para enviar a imagem do produto
    fotoPrincipalCadastrar: {
        backgroundColor: '#E0E0E0',
        width: '100%',
        height: 180,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderStyle: 'dashed',
    },

    // Texto descritivo embaixo do ícone de câmera
    textoFotoCadastrar: {
        color: colors.cinzaTecnico,
        marginTop: 10,
        fontWeight: '500',
    },

    // Texto fixo acima de cada campo de input
    labelGeralCadastrar: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 18,
        marginBottom: 8,
        color: '#333',
    },

    // Caixa de input branca padrão
    inputGeralCadastrar: {
        backgroundColor: colors.branco,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#000',
        elevation: 1,
    },

    // Caixa de input bloqueada (quando o sistema preenche sozinho)
    inputDesativadoCadastrar: {
        backgroundColor: '#F0F0F0',
        color: '#000000',
    },

    // Texto fixo acima das opções de categoria
    labelCategoriaCadastrar: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 12,
        color: '#333',
    },

    // Container que organiza os botões (chips) de categorias lado a lado
    categoriaContainerCadastrar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    // Molde base arredondado para cada botão de categoria
    chipBaseCadastrar: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        borderWidth: 1.5,
    },

    // Estilo do botão de categoria quando NÃO está clicado (Borda verde, fundo transparente)
    chipInativoCadastrar: {
        backgroundColor: 'transparent',
        borderColor: colors.verdeColheita,
    },

    // Estilo do botão de categoria quando ESTÁ clicado (Fundo verde preenchido)
    chipAtivoCadastrar: {
        backgroundColor: colors.verdeColheita,
        borderColor: colors.verdeColheita,
    },

    // Cor do texto quando a categoria NÃO está selecionada
    textoChipInativoCadastrar: {
        color: colors.verdeColheita,
        fontWeight: '500',
    },

    // Cor do texto quando a categoria ESTÁ selecionada
    textoChipAtivoCadastrar: {
        color: colors.branco,
        fontWeight: 'bold',
    },

    // Container que divide a tela em duas colunas (Para Preço e Unidade)
    linhaDuplaCadastrar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    // Coluna da esquerda (Preço)
    colunaEsquerdaCadastrar: {
        width: '47%',
    },

    // Coluna da direita (Unidade)
    colunaDireitaCadastrar: {
        width: '48%',
    },

    // Caixa branca que engloba o símbolo R$ e o input numérico
    inputPrecoBoxCadastrar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.branco,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 55,
        elevation: 1,
    },

    // O textinho "R$:" travado no lado esquerdo do input
    moedaTextCadastrar: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.verdeColheita,
        marginRight: 5,
    },

    // Onde o usuário de fato digita o preço
    inputPrecoCadastrar: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },

    // Caixa branca que envolve o menu dropdown (Picker)
    pickerBoxCadastrar: {
        backgroundColor: colors.branco,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        justifyContent: 'center',
        height: 55,
        elevation: 1,
        overflow: 'hidden',
    },

    // O menu dropdown em si
    pickerCadastrar: {
        width: '100%',
        color: '#000',
    },

    // Container cinza principal do seletor de Quantidade (+ e -)
    quantidadeContainerCadastrar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        width: 160,
        height: 55,
        marginTop: 10,
        elevation: 2,
    },

    // Área clicável dos símbolos de + e -
    btnQtdCadastrar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    // A fonte grande verde dos símbolos + e -
    btnQtdTextoCadastrar: {
        fontSize: 28,
        color: colors.verdeColheita,
        fontWeight: '300',
    },

    // O quadrado branco no meio que exibe o número atual da quantidade
    numeroBoxCadastrar: {
        width: 60,
        backgroundColor: colors.branco,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#CCC',
    },

    // O texto do número da quantidade em si
    numeroTextoCadastrar: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },

    // Botão final "Cadastrar Produto" no final da página
    btnCadastrarFinal: {
        backgroundColor: colors.verdeColheita,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 50,
        elevation: 3,
    },

    // Texto branco do botão de envio final
    textoBtnCadastrarFinal: {
        color: colors.branco,
        fontSize: 18,
        fontWeight: 'bold',
    },

 // =======================================================
    // ⚡ ESTILOS DO MODAL DE OFERTA RELÂMPAGO (OfertaRelampago.tsx)
    // =======================================================

    // Fundo escuro que começa logo abaixo do Header
    modalFundoEscuro: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        justifyContent: 'flex-end',
        // 🟢 IMPORTANTE: Se o seu Header tiver, por exemplo, 100px de altura,
        // você pode ajustar este marginTop para bater com a linha do verde.
        marginTop: 100, 
    },
    
    // A caixa branca com contorno fino e SEM a sombra explosiva do Android
    modalConteudoBranco: {
        backgroundColor: '#ffffff', 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 40,
        
        // 🟢 TRUQUE DO FIGMA: Borda fina em vez de elevation
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)', 
        borderBottomWidth: 0, // Garante que a borda não apareça na base da tela

        elevation: 0, // Zera para o contorno ficar limpo igual ao Figma

        // Shadow para iOS/Simuladores
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    
    // O pequeno traço cinza no topo do modal
    tracinhoModal: {
        width: 40,
        height: 5,
        backgroundColor: colors.placeholder,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 20,
    },
    
    // O texto de título laranja
    tituloModalOferta: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.laranjaAlerta,
        textAlign: 'center',
        marginBottom: 20,
    },

    // =======================================================
    // 🏷️ ESTILOS DA CAIXA DE PREÇO AUTOMÁTICO (Círculo Azul)
    // =======================================================
    boxPrecoAutomatico: {
        backgroundColor: colors.branco,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    textoPrecoRiscado: {
        fontSize: 14,
        color: colors.cinzaTecnico,
        textDecorationLine: 'line-through',
        marginBottom: 5,
    },
    textoPrecoDesconto: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },

    // =======================================================
    // ⏱️ ESTILOS DO CONTADOR DE TEMPO E BOTÃO FINAL
    // =======================================================
    containerTempoOferta: {
        flexDirection: 'row',
        backgroundColor: '#E6E6E6',
        borderRadius: 12,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    btnTempoBase: {
        width: 45,
        height: 45,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2, 
    },
    btnTempoAtivo: {
        backgroundColor: colors.verdeColheita,
    },
    textoTempoOferta: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
    },
    btnAtivarOfertaAgora: {
        backgroundColor: colors.verdeColheita,
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBtnAtivarOferta: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

// =======================================================
    // 🏠 ESTILOS DA TELA INÍCIO / HOME (Inicio.tsx) - VISUAL SÉRIO
    // =======================================================

    // Fundo principal de toda a tela, um cinza bem clarinho e suave
    containerHomeSério: {
        flex: 1,
        backgroundColor: '#F5F5F7', 
    },

    // Espaçamento interno de todo o conteúdo para não colar nas bordas
    contentContainerHomeSério: {
        padding: 16,
        paddingBottom: 90, // Espaço extra no final para não cobrir o último card
    },

    // Centralizador para o ActivityIndicator (Carregamento)
    centerHomeSério: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Título principal "Ofertas Fresquinhas" (Catálogo)
    tituloSecaoSério: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
        marginTop: 24,
        marginBottom: 16,
    },

    // =======================================================
    // ⚡ DESTAQUE BANNER (OFERTA RELÂMPAGO) - ESTILO HIGH-FIDELITY
    // =======================================================
    
    // Caixa principal do banner de destaque, usando a imagem inteira
    bannerDestaqueSério: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden', // Essencial para que a imagem siga as bordas arredondadas
        marginBottom: 10,
        elevation: 5, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    
    // O ImageBackground que preenche todo o banner
    bannerImageBackgroundSério: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    
    // Faixa no topo para o título e o timer
    bannerTopOverlaySério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    
    // Título "OFERTA RELÂMPAGO!" com sombra para dar leitura em cima da foto
    bannerTitleOverSério: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    
    // O blockzinho branco semi-transparente do cronômetro
    bannerTimerBlockSério: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    
    // O texto do cronômetro dentro do blockzinho
    bannerTimerTextSério: {
        color: colors.cinzaTecnico,
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    // Faixa inferior escura e transparente para o nome do produto e preço
    bannerBottomInfoOverlaySério: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 12,
    },
    
    // Nome do produto no destaque (Ex: Morango Orgânico)
    bannerBottomNameSério: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    
    // Area para alinhar os dois preços
    bannerBottomPricesSério: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    // Preço original riscado
    bannerBottomPriceRiscadoSério: {
        color: '#CCC',
        textDecorationLine: 'line-through',
        marginRight: 8,
        fontSize: 12,
    },
    
    // Preço promocional em destaque (Laranja Alerta)
    bannerBottomPriceNovoSério: {
        color: colors.laranjaAlerta, 
        fontWeight: 'bold',
        fontSize: 18,
    },

    // =======================================================
    // 🛒 CATÁLOGO DE PRODUTOS (CARDS PROFISSIONAIS)
    // =======================================================
    
    // Grid para alinhar os cards (2 por linha)
    gridProdutosSério: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    
    // Card individual do produto, mais limpo e profissional
    cardProdutoSério: {
        width: '48%', // Garante dois por linha
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden', 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    
    // Caixa para a foto do catálogo (Preenche todo o topo do card)
    cardCatalogueImageContainerSério: {
        height: 120,
        width: '100%',
        backgroundColor: colors.backGroundPage,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // A foto real do produto no catálogo
    cardCatalogueImageSério: {
        width: '100%',
        height: '100%',
    },
    
    // Badge de "Orgânico" em verde forte no card
    badgeOrganicoSério: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: colors.verdeColheita,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    
    // Texto do Badge (Orgânico)
    badgeOrganicoTextSério: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    
    // Container das informações de texto do card, com mais padding
    cardCatalogueInfoSério: {
        padding: 12,
    },
    
    // Título do produto no cardzinho (Ex: Banana Prata)
    cardCatalogueNameSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
        marginBottom: 2,
    },
    
    // Nome do produtor no cardzinho (Ex: richard.richard)
    cardCatalogueVendorSério: {
        fontSize: 12,
        color: colors.placeholder,
        marginBottom: 8,
    },
    
    // Area inferior do card para alinhar preço e botão
    cardCataloguePriceRowSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    // Preço final do produto no cardzinho
    cardCataloguePriceSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
    },
    
    // Botão verde redondo com o "Add"
    btnAddCardNewSério: {
        backgroundColor: colors.verdeColheita,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;