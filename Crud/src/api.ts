import axios from 'axios';

// Substitui o IP abaixo pelo teu IPv4 (vê no terminal com 'ipconfig')
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000'
});

export default api;