fetch('http://localhost:3000/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João do ColhaHoje',
    email: 'joao@email.com',
    senha: '123',
    tipo_usuario: 'PRODUTOR',
    whatsapp: '13999999999',
    url_foto: 'foto_joao.jpg'
  })
})
.then(res => res.text())
.then(corpo => console.log("Resposta do Servidor:", corpo))
.catch(err => console.error("Erro no teste:", err));