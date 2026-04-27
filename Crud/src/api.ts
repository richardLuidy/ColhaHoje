import axios from 'axios';

// 🟢 Use o IP que aparece no seu terminal do Expo
const API_BASE_URL = 'http://10.138.48.37:3000'; 

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Isso aqui vai fazer o Login e o Cadastro voltarem a funcionar
export const API_URL = API_BASE_URL;

// Isso aqui vai fazer a tela de Pedidos funcionar
export default api;