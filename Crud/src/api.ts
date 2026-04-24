// api.ts - Configuração centralizada de APIs
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000'  // Emulador Android
  : 'http://192.168.1.100:3000';  // IP da máquina local na rede (ajuste conforme necessário)

export const API_URL = API_BASE_URL;