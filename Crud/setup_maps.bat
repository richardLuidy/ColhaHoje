@echo off
echo Configuracao da API Key do Google Maps para ColhaHoje
echo.
echo Este script ira configurar sua API key no app.json
echo.
set /p API_KEY="Digite sua Google Maps API Key: "

if "%API_KEY%"=="" (
    echo Erro: API Key nao pode ser vazia
    pause
    exit /b 1
)

echo Configurando API key no app.json...
powershell -Command "(Get-Content 'app.json') -replace 'YOUR_API_KEY_HERE', '%API_KEY%' | Set-Content 'app.json'"

echo.
echo API Key configurada com sucesso!
echo.
echo Proximos passos:
echo 1. Execute: npm install
echo 2. Execute: npx expo start --clear
echo 3. Teste o mapa no dispositivo/simulador
echo.
pause