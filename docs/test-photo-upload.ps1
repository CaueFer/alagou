# Script de teste para upload de fotos via PowerShell
# Uso: .\test-photo-upload.ps1

$API_URL = "http://localhost:8080/api/alerts"

Write-Host "=== Teste de Upload de Fotos ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script cria um alerta de teste com fotos."
Write-Host "Certifique-se de que o backend está rodando em $API_URL"
Write-Host ""

# Cria imagens de teste simples (1x1 pixel JPEG)
$testPhoto1 = "test-photo-1.jpg"
$testPhoto2 = "test-photo-2.jpg"

if (-not (Test-Path $testPhoto1)) {
    Write-Host "Criando imagens de teste..." -ForegroundColor Yellow
    # Cria um JPEG mínimo válido
    $bytes = [byte[]]@(255,216,255,224,0,16,74,70,73,70,0,1,1,0,0,1,0,1,0,0,255,219,0,67,0,8,6,6,7,6,5,8,7,7,7,9,9,8,10,12,20,13,12,11,11,12,25,18,19,15,20,29,26,31,30,29,26,28,28,32,36,46,39,32,34,44,35,28,28,40,55,41,44,48,49,52,52,52,31,39,57,61,56,50,60,46,51,52,50,255,192,0,11,8,0,1,0,1,1,1,17,0,255,196,0,31,0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,255,196,0,181,16,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125,1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,8,20,50,129,145,161,9,35,66,177,193,21,82,209,240,22,51,98,114,130,10,11,21,22,23,24,25,26,37,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,83,84,85,86,87,88,99,100,101,102,103,104,115,116,117,118,119,120,131,132,133,134,135,136,146,147,148,149,150,151,162,163,164,165,166,167,178,179,180,181,182,183,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250,255,218,0,8,1,1,0,0,63,0,251,210,138,40,3,255,217)
    [System.IO.File]::WriteAllBytes($testPhoto1, $bytes)
    Copy-Item $testPhoto1 $testPhoto2
    Write-Host "Imagens de teste criadas." -ForegroundColor Green
}

Write-Host ""
Write-Host "Enviando alerta com 2 fotos..." -ForegroundColor Yellow
Write-Host ""

try {
    # Prepara o multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"type`"$LF",
        "USER",
        "--$boundary",
        "Content-Disposition: form-data; name=`"username`"$LF",
        "test_user",
        "--$boundary",
        "Content-Disposition: form-data; name=`"severity`"$LF",
        "MODERATE",
        "--$boundary",
        "Content-Disposition: form-data; name=`"lat`"$LF",
        "-26.3049",
        "--$boundary",
        "Content-Disposition: form-data; name=`"lng`"$LF",
        "-48.8484",
        "--$boundary"
    ) -join $LF
    
    # Adiciona as fotos
    $photo1Bytes = [System.IO.File]::ReadAllBytes($testPhoto1)
    $photo2Bytes = [System.IO.File]::ReadAllBytes($testPhoto2)
    
    $photo1Header = "Content-Disposition: form-data; name=`"photos`"; filename=`"$testPhoto1`"$LF" + "Content-Type: image/jpeg$LF$LF"
    $photo2Header = "Content-Disposition: form-data; name=`"photos`"; filename=`"$testPhoto2`"$LF" + "Content-Type: image/jpeg$LF$LF"
    
    $body = [System.Text.Encoding]::UTF8.GetBytes($bodyLines + $LF + $photo1Header) + $photo1Bytes + [System.Text.Encoding]::UTF8.GetBytes($LF + "--$boundary$LF" + $photo2Header) + $photo2Bytes + [System.Text.Encoding]::UTF8.GetBytes("$LF--$boundary--$LF")
    
    $headers = @{
        "Content-Type" = "multipart/form-data; boundary=$boundary"
    }
    
    $response = Invoke-RestMethod -Uri $API_URL -Method POST -Headers $headers -Body $body -ErrorAction Stop
    
    Write-Host "Alerta criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "ID do alerta: $($response.id)" -ForegroundColor Cyan
    Write-Host "URLs das fotos:" -ForegroundColor Cyan
    $response.photoUrls | ForEach-Object { Write-Host "  - http://localhost:8080$_" }
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Yellow
    Write-Host "1. Verificar se as fotos foram salvas em api/uploads/photos/"
    Write-Host "2. Acessar as URLs das fotos no browser para confirmar que estão acessíveis"
    
} catch {
    Write-Host "Erro ao criar alerta:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails
    }
}

Write-Host ""
Write-Host "=== Fim do Teste ===" -ForegroundColor Cyan
