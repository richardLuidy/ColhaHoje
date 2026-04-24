# Configuração da API Key do Google Maps

## Passos para configurar:

### 1. Criar projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS

### 2. Criar credenciais (API Key)
1. No menu lateral, vá para "APIs e Serviços" > "Credenciais"
2. Clique em "Criar credenciais" > "Chave de API"
3. Copie a chave gerada

### 3. Restringir a API Key (Recomendado)
1. Na página de credenciais, clique na chave criada
2. Em "Restrições de aplicativo":
   - Selecione "Aplicativos Android" e adicione o package name: `com.richardluidy.ColhaHoje`
   - Selecione "Aplicativos iOS" e adicione o bundle ID: `com.richardluidy.ColhaHoje`
3. Em "Restrições de API":
   - Selecione "Maps SDK for Android" e "Maps SDK for iOS"

### 4. Configurar no app.json
Substitua `YOUR_API_KEY_HERE` pela sua chave real em ambos os locais:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "SUA_CHAVE_AQUI"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "SUA_CHAVE_AQUI"
        }
      }
    }
  }
}
```

### 5. Testar a configuração
Execute o app e verifique se o mapa carrega corretamente.

## Observações importantes:
- A API key é gratuita para uso básico (até 28.000 carregamentos de mapa por mês)
- Para produção, considere configurar faturamento no Google Cloud
- Mantenha a chave restrita para evitar uso não autorizado