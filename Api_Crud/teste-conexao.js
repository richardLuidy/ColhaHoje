import mysql from 'mysql2/promise'

async function testConnection() {
  try {
    console.log('Testando conexão MySQL...')
    const connection = await mysql.createConnection({
      host: 'mysql-2c20f33f-colhahoje.a.aivencloud.com',
      port: 14406,
      user: 'avnadmin',
      password: 'AVNS_lvd6YRnV5wqxzuzoj3y',
      database: 'defaultdb',
      ssl: {
        rejectUnauthorized: false
      }
    })

    console.log('Conectado! Testando query...')
    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('Query OK:', rows)

    await connection.end()
    console.log('Conexão fechada com sucesso!')
  } catch (error) {
    console.error('Erro:', error.message)
  }
}

testConnection()