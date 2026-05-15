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
    // 🏷️ ESTILOS DO CONTADOR (BADGE) DA SACOLA NO HEADER
    // =======================================================

    // Círculo vermelho que fica sobreposto ao ícone da sacola
    badgeSacola: {
        position: 'absolute',
        right: -2,                // Ajuste fino para não cortar o ícone
        top: -2,                  // Alinhado ao topo do ícone
        backgroundColor: '#FF4444', // Vermelho vibrante para destaque
        borderRadius: 10,         // Deixa o fundo redondo
        minWidth: 18,             // Largura mínima para números com 1 dígito
        height: 18,               // Altura fixa para manter o círculo
        justifyContent: 'center', // Centraliza o número verticalmente
        alignItems: 'center',     // Centraliza o número horizontalmente
        paddingHorizontal: 4,     // Espaço lateral para números maiores (ex: 10)
        borderWidth: 1.5,         // Borda para destacar do fundo do header
        borderColor: colors.verdeColheita, // Cor do header para dar efeito de recorte
        zIndex: 10,               // Garante que fique em cima de tudo
    },

    // Texto com a quantidade total de itens dentro do badge
    badgeText: {
        color: '#FFFFFF',         // Branco para contraste no fundo vermelho
        fontSize: 10,             // Tamanho pequeno para caber no círculo
        fontWeight: 'bold',       // Negrito para facilitar a leitura rápida
    },


    // =======================================================
    // 🏷️ ESTILOS DA TELA DE CARRINHO (MODAL)
    // =======================================================

    // Item individual na lista da sacola
    itemCarrinhoSério: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
    },

    // Miniatura da imagem do produto no carrinho
    imagemItemCarrinhoSério: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },

    // Container do resumo de valores no rodapé do modal
    footerCarrinhoSério: {
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 15,
        marginTop: 10,
    },

    // Botão grande de finalizar pedido
    btnFinalizarCarrinhoSério: {
        backgroundColor: colors.verdeColheita,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 15,
    },

    // =======================================================
    // 🔑 ESTILOS DAS TELAS DE LOGIN E DADOS PESSOAIS (Login.tsx, DadosPessoais.tsx)
    // =======================================================

    // Container principal da tela de Login / Dados Pessoais
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
    // 🏠 ESTILOS DA TELA INÍCIO.tsx
    // =======================================================

    containerHomeSério: {
        flex: 1,
        backgroundColor: '#F8F9FA', 
    },

    contentContainerHomeSério: {
        padding: 20, 
        paddingBottom: 100,
    },

    centerHomeSério: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    tituloSecaoSério: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 25,
        marginBottom: 15,
        letterSpacing: -0.5, 
    },
// =======================================================
    // ⚡ ESTILOS DO BANNER OFERTA RELÂMPAGO CORRIGIDOS
    // =======================================================
    bannerDestaqueSério: {
        width: '100%', 
        height: 230, // 🟢 A SOLUÇÃO ESTÁ AQUI! Altura fixa para não esticar!
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFF', 
        flexDirection: 'row', 
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 15,
    },
    bannerEsquerdaSério: {
        flex: 1.4, 
        padding: 15,
        justifyContent: 'space-between',
    },
    bannerDireitaSério: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    bannerImageSério: {
        width: '100%',
        height: '100%',
    },

    bannerOverlaySério: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    },

    bannerHeaderSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    badgeRelampagoSério: {
        backgroundColor: colors.verdeColheita, // 🎨 Cor da paleta
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    badgeTimerSério: {
        backgroundColor: colors.laranjaAlerta, // 🎨 Cor da paleta
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 6,
    },

    badgeTextBrancoSério: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },

    bannerInfoSério: {
        marginTop: 10,
    },
    bannerPorApenasSério: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },

    bannerBotaoAdicionarSério: {
        backgroundColor: colors.verdeColheita, // 🎨 Cor da paleta
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8, // 🟢 Ajustado para não cortar
        borderRadius: 8,
        width: '100%',
        marginTop: 5, // 🟢 Margem menor para caber bonito
    },
    // =======================================================
    // 🛒 ESTILOS DO CATÁLOGO DE PRODUTOS (Inicio.tsx)
    // =======================================================

    gridProdutosSério: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Joga um card para cada ponta
        width: '100%',
    },


    cardProdutoSério: {
        width: '48%',
        backgroundColor: colors.branco,
        borderRadius: 24,
        marginBottom: 20, // Mais espaço entre as linhas para não embolar
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: colors.backGroundPage,
    },

    cardCatalogueImageContainerSério: {
        height: 160,
        width: '100%',
        backgroundColor: colors.backGroundPage,
        overflow: 'hidden',
    },
    cardCatalogueImageSério: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    badgeOrganicoSério: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: colors.verdeColheita,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },

    badgeOrganicoTextSério: {
        color: colors.branco, // Texto em verde escuro para contraste
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    // Container de informações (Nome, Produtor, Preço)
    cardCatalogueInfoSério: {
        padding: 12,
    },

    cardCatalogueNameSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
        marginBottom: 2,
    },

    cardCatalogueVendorSério: {
        fontSize: 12,
        color: colors.placeholder,
        marginBottom: 8,
    },

    cardCataloguePriceRowSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardCataloguePriceSério: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.cinzaTecnico,
    },

    // Botão de adicionar - Verde oficial da marca
    btnAddCardNewSério: {
        backgroundColor: colors.verdeColheita,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },

    // =======================================================
    // 🌊 ESTILOS DA SPLASH SCREEN
    // =======================================================

    // Container principal da splash
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.verdeColheita, // Fundo verde da marca
    },

    // Logo da aplicação
    splashLogo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },

    // Texto principal "ColhaHoje"
    splashText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.branco,
        marginBottom: 10,
    },

    // Subtítulo descritivo
    splashSubtitle: {
        fontSize: 16,
        color: colors.branco,
        textAlign: 'center',
        opacity: 0.8,
    },

   // =======================================================
    // 📦 ESTILOS DA TELA DE PEDIDOS 
    // =======================================================

    pedidosTabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.branco,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0', 
    },
    pedidosTabButton: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0,
    },
    pedidosTabActive: {
        borderBottomWidth: 3,
        borderColor: colors.verdeColheita,
        marginBottom: -1, 
    },
    pedidosTabActiveIndicator: {
        borderBottomWidth: 3,
        borderColor: colors.verdeColheita,
        marginBottom: -1, 
    },
    pedidosTabText: {
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    pedidosEmptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },

    // 🟢 ESTILOS DO NOVO CARD DO FIGMA
    pedidoCardFigma: {
        backgroundColor: colors.branco,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'stretch',
        marginHorizontal: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        borderWidth: 1.5,
        borderColor: '#2F5233', 
    },
    pedidoHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
    },
    pedidoIdText: {
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#374151' 
    },
    pedidoBadgeStatus: {
        flexDirection: 'row', 
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pedidoBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    
    // LINHA DO TEMPO (STEPPER)
    pedidoStepperContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    pedidoStep: {
        alignItems: 'center', 
        flex: 1 
    },
    pedidoStepCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    pedidoStepLine: {
        height: 2,
        flex: 1,
        position: 'relative',
        top: -8, 
        marginHorizontal: -15, 
        zIndex: 1,
    },
    pedidoStepLabel: {
        fontSize: 10,
        marginTop: 6,
        textAlign: 'center',
    },
    pedidoDivisor: {
        height: 1, 
        backgroundColor: '#F3F4F6', 
        marginBottom: 16 
    },

    // INFO DO PRODUTO ORIGINAL (Mantido para compatibilidade, mas o layout novo usa as classes abaixo)
    pedidoProdutoContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    pedidoIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pedidoProdutoImagem: {
        width: '100%', 
        height: '100%', 
        borderRadius: 8 
    },
    pedidoInfoContainer: {
        flex: 1,
        marginLeft: 15,
    },
    pedidoProdutoTitulo: {
        fontWeight: 'bold', 
        fontSize: 14, 
        color: '#111827' 
    },
    pedidoProdutoSub: {
        color: '#6B7280', 
        fontSize: 12, 
        marginTop: 2 
    },

    // PREVISÃO
    pedidoPrevisaoContainer: {
        marginBottom: 16 
    },
    pedidoPrevisaoLabel: {
        fontSize: 14, 
        color: '#F59E0B' 
    },
    pedidoPrevisaoData: {
        fontSize: 14, 
        color: '#F59E0B', 
        fontWeight: 'bold' 
    },

    // BOTÕES DE AÇÃO
    pedidoBotoesContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    pedidoBtnRastrear: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2F5233',
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    pedidoBtnRastrearTexto: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 6,
    },
    pedidoBtnFalar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    pedidoBtnFalarTexto: {
        color: '#4B5563',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 6,
    },

// =======================================================
    // 🏛️ ESTILOS DO HISTÓRICO (VISUAL COMPACTO)
    // =======================================================
    cardHistorico: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    historicoHeaderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 10,
    },
    historicoDataText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    historicoBadgeStatus: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historicoConteudo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    historicoImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    historicoInfoText: {
        flex: 1,
        marginLeft: 15,
    },
    historicoTituloProduto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    historicoFornecedor: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    historicoTotal: {
        fontSize: 14,
        color: '#1F2937',
        marginTop: 5,
    },
    historicoRowBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    btnHistoricoDetalhes: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.verdeColheita,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    btnHistoricoRefazer: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.verdeColheita,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // ==========================================
    // 🆕 NOVOS ESTILOS (LISTA DE ITENS E ENDEREÇO)
    // ==========================================
    
    pedidoSecaoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    pedidoSecaoTitulo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginLeft: 8,
    },
    pedidoListaItens: {
        marginBottom: 8,
    },
    pedidoItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    pedidoItemIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', 
    },
    pedidoItemInfoCenter: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    pedidoItemInfoRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    pedidoItemQtdBadge: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginBottom: 4,
    },
    pedidoItemQtdText: {
        fontSize: 10,
        color: '#4B5563',
        fontWeight: '600',
    },
    pedidoItemTotalText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    
    // INFO FORNECEDOR
    pedidoFornecedorContainer: {
        marginBottom: 12,
        paddingLeft: 4,
    },
    pedidoFornecedorLabel: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 6,
        fontWeight: '600',
    },
    pedidoFornecedorNome: {
        color: '#2F5233', 
    },
    pedidoEnderecoLinha: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    pedidoEnderecoTexto: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 6,
        flex: 1,
    },
    pedidoEnderecoTextoSemIcone: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 20, 
        marginBottom: 2,
    },

    // =======================================================
    // 💳 ESTILOS DA TELA DE CONFIRMAR PEDIDO
    // =======================================================

    // Container principal que envolve a tela de revisão
    confirmarPedidoContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: 20,
    },

    // Títulos de seção (Revisão, Forma de Pagamento)
    confirmarPedidoTitulo: {
        fontSize: 20, 
        fontWeight: 'bold', 
        color: colors.cinzaTecnico,
        marginBottom: 15,
        marginTop: 10,
    },

    // Card que lista os produtos selecionados
    cardRevisaoItens: {
        backgroundColor: colors.branco,
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },

    // Linha de cada produto dentro da revisão
    linhaProdutoRevisao: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 5,
    },

    // Botão de seleção de método de pagamento (Pix, Cartão, etc)
    metodoPagamentoBotao: {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
        backgroundColor: colors.branco, 
        borderRadius: 12, 
        marginBottom: 12,
        elevation: 2,
        borderWidth: 2, // Usado para destacar o selecionado via lógica no arquivo .tsx
    },

    // Texto descritivo do método de pagamento
    metodoPagamentoTexto: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
        color: colors.cinzaTecnico,
    },

    // Rodapé fixo ou final da tela com o valor total
    totalConfirmacaoContainer: {
        borderTopWidth: 1, 
        borderColor: '#EEE', 
        paddingTop: 15, 
        marginTop: 10,
        alignItems: 'flex-end',
    },

    // Texto do valor total em destaque
    totalConfirmacaoValor: {
        fontWeight: 'bold', 
        fontSize: 22, 
        color: colors.verdeColheita,
    },

    // =======================================================
    // 🏷️ ESTILOS DA TELA "MINHAS OFERTAS" (CORREÇÃO TOTAL PROFISSIONAL)
    // =======================================================

    // Container principal de fundo da tela
    containerMinhasOfertasSério: {
        flex: 1,
        backgroundColor: colors.branco,
    },

    // Header fixo no topo com sombra suave e borda
    headerMinhasOfertasSério: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60, // Respiro para a barra de status do celular
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.backGroundPage,
        elevation: 3, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    // Card principal da oferta (O segredo do alinhamento está aqui)
    cardOfertaGerenciamentoSério: {
        flexDirection: 'row', // FORÇA alinhamento horizontal (Imagem | Texto | Lixeira)
        backgroundColor: '#FFF',
        borderRadius: 20, // Bordas bem arredondadas estilo Figma
        marginBottom: 16,
        padding: 12,
        alignItems: 'center', // Centraliza os itens verticalmente dentro do card
        justifyContent: 'space-between', // Empurra a lixeira para o final
        width: '100%',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderLeftWidth: 6,
        borderLeftColor: colors.laranjaAlerta, // Destaque lateral da promoção
    },

    // Imagem do produto no card (Tamanho fixo para não quebrar)
    imagemOfertaGerenciamentoSério: {
        width: 75,
        height: 75,
        borderRadius: 12,
        backgroundColor: colors.backGroundPage,
    },

    // Container de informações (flex: 1 para ocupar o meio e empurrar a lixeira)
    infoOfertaGerenciamentoSério: {
        flex: 1, // Crucial: este bloco ocupa todo o espaço do meio
        marginLeft: 15,
        marginRight: 10, // Espaço para não encostar na lixeira
        justifyContent: 'center',
    },

    // 🟢 Etiqueta de Status Antiga (Mantida para o "Esgotando")
    badgeStatusOfertaSério: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 4,
    },

    // 🟢 Texto da Etiqueta Antiga
    badgeStatusTextoOfertaSério: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
        textTransform: 'uppercase',
    },

    // Título do produto (Limpíssimo)
    tituloOfertaGerenciamentoSério: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.cinzaTecnico,
        marginBottom: 3,
    },

    // Container para alinhar os dois preços na horizontal
    rowPrecosOfertaSério: {
        flexDirection: 'row',
        alignItems: 'baseline', // Alinha os preços pela base do texto
    },

    // Preço original riscado (Discreto)
    precoAntigoOfertaSério: {
        fontSize: 12,
        color: colors.placeholder,
        textDecorationLine: 'line-through',
        marginRight: 8,
    },

    // Preço promocional (Destaque Laranja oficial)
    precoNovoOfertaSério: {
        fontSize: 19,
        fontWeight: '900', // Bem negrito
        color: colors.laranjaAlerta,
    },

    // Badge de tempo restante (Fundo suave)
    timerBadgeOfertaSério: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        backgroundColor: '#FFF5E6', // Laranja bem clarinho de fundo para contraste
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start', // Não deixa o fundo ocupar a largura toda
    },

    // Texto dentro do badge de tempo
    timerTextOfertaSério: {
        fontSize: 11,
        color: colors.laranjaAlerta,
        fontWeight: '700',
        marginLeft: 4,
    },

    // Botão de excluir oferta (A lixeira vermelha sutil)
    btnRemoverOfertaSério: {
        width: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)', // Fundo vermelho bem clarinho
        borderRadius: 12,
        alignSelf: 'flex-end',
    },

    // ==========================================
    // 🟢 NOVOS: ETIQUETA DO CANTO DIREITO
    // ==========================================
    badgeStatusTopRightSério: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dotStatusSério: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    badgeStatusTextoTopRightSério: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    
    // =======================================================
    // 💳 ESTILOS DA TELA "MÉTODOS DE PAGAMENTO"
    // =======================================================

    containerPagamentoSério: {
        flex: 1,
        backgroundColor: colors.branco,
    },
    headerPagamentoSério: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.backGroundPage,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cartaoCreditoSério: {
        width: '100%',
        height: 190,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
        marginBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    linhaTopCartaoSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textoBandeiraSério: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    numeroCartaoSério: {
        color: '#FFF',
        fontSize: 22,
        letterSpacing: 3,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'monospace', // Dá aquela cara de número de cartão
    },
    linhaBottomCartaoSério: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    blocoTextoCartaoSério: {
        flexDirection: 'column',
    },
    textoLabelCartaoSério: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    textoValorCartaoSério: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnAdicionarCartaoSério: {
        backgroundColor: colors.verdeColheita,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 30,
    },
    btnRemoverCartaoSério: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#FFE5E5',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    // =======================================================
    // 📦 ESTILOS DA TELA DE HISTÓRICO DE PEDIDOS (HistoricoPedidos.tsx)
    // =======================================================
    historicoHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    historicoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    cardPedido: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 3, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardTopPedido: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerEsquerdaPedido: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBoxPedido: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E8F5E9', // Fundo verde clarinho
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    pedidoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    produtorNomePedido: {
        fontSize: 13,
        color: '#555',
        marginTop: 2,
    },
    totalTextoPedido: {
        fontSize: 16,
        fontWeight: '900',
        color: '#2E7D32', // Verde escuro destaque
    },
    dataTextoPedido: {
        fontSize: 12,
        color: '#888',
        marginTop: 10,
        marginBottom: 12,
    },
    // Caixa cinza clara que agrupa as fotos e itens
    itensContainerPedido: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    itemRowPedido: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemImagePedido: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    itemTextPedido: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    footerPedido: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badgeStatusPedido: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    badgeTextoPedido: {
        marginLeft: 6,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    btnAcompanharPedido: {
        backgroundColor: '#2D6A4F', // Fundo Verde Sólido do Figma
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnAcompanharTextoPedido: {
        color: '#FFF', // Texto Branco
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5,
    },
   // =======================================================
    // ⚙️ TELA DE CONFIGURAÇÕES (VISUAL PREMIUM DA IA)
    // =======================================================
    headerConfigContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    headerConfigTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    headerConfigSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    headerConfigIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0FDF4', // Verde bem clarinho
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10,
        paddingHorizontal: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.verdeColheita,
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    cardConfig: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1, // Sombra suave no Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    itemRowConfig: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    itemLeftConfig: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBoxConfig: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#F0FDF4', 
        borderWidth: 1,
        borderColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainerConfig: {
        marginLeft: 15,
        flex: 1,
    },
    itemTitleConfig: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    itemSubtitleConfig: {
        fontSize: 12,
        color: '#888',
    },
    dividerConfig: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginLeft: 55, // Faz a linha começar depois do ícone
    },
    deleteCardConfig: {
        backgroundColor: '#FEF2F2', // Vermelho bem clarinho
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 25,
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deleteIconBoxConfig: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#FECACA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteTitleConfig: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#DC2626', // Vermelho forte
        marginBottom: 2,
    },
    deleteSubtitleConfig: {
        fontSize: 12,
        color: '#DC2626',
        opacity: 0.8,
    },
    footerTextConfig: {
        textAlign: 'center',
        color: '#BBB',
        fontSize: 12,
        marginTop: 30,
        marginBottom: 40,
    },


    // =======================================================
    // ⚡ ESTILOS EXCLUSIVOS: ABA OFERTAS (VISUAL FIGMA)
    // =======================================================
    gridOfertasFigma: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        width: '100%',
    },
    cardOfertaFigma: {
        width: '48%', // Garante dois cards por linha
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    containerImagemOfertaFigma: {
        width: '100%',
        height: 130, 
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    imagemOfertaFigma: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badgeTempoOfertaFigma: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFB800', 
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    textoTempoOfertaFigma: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 3,
    },
    btnFavoritoOfertaFigma: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFF',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 2,
    },
    badgeEstoqueOfertaFigma: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#FFF5E6', 
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 10,
    },
    textoEstoqueOfertaFigma: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#B78103', 
    },
    infoOfertaFigma: {
        padding: 10,
    },
    nomeProdutoOfertaFigma: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    linhaPrecoOfertaFigma: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    precoPromoOfertaFigma: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2E7D32', 
    },
    precoOriginalOfertaFigma: {
        fontSize: 11,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    btnAdicionarOfertaFigma: {
        backgroundColor: '#2E7D32',
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    textoBtnAdicionarOfertaFigma: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5,
    },

    // =======================================================
    // 👑 TELA DO PAINEL ADMIN (PainelAdmin.tsx)
    // =======================================================
    adminContainer: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
    adminHeader: {
        backgroundColor: '#1E1E1E', // Fundo escuro premium
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    adminBtnVoltar: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    adminHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    adminHeaderSubtitle: {
        fontSize: 13,
        color: '#D4AF37', // Dourado
        marginTop: 2,
    },
    adminLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminAlertBox: {
        backgroundColor: '#FFFDF0',
        borderColor: '#FBEB8D',
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    adminAlertText: {
        flex: 1,
        marginLeft: 15,
        color: '#8A6D3B',
        fontSize: 13,
    },
    adminSectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 12,
        marginLeft: 5,
        letterSpacing: 0.5,
    },
    adminRowCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    adminKpiCard: {
        backgroundColor: '#FFF',
        width: '31%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    adminIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    adminKpiValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    adminKpiLabel: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    adminHeaderList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 5,
    },
    adminListContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    adminListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    adminItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    adminItemIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    adminItemName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    adminItemCategory: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    adminItemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.verdeColheita,
    },
    adminItemUnit: {
        fontSize: 11,
        color: '#999',
    },
    adminEmptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
    },
    adminBtnRelatorio: {
        backgroundColor: '#1E1E1E',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 25,
    },
    adminBtnRelatorioText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
});


export default styles;