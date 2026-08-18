# Photo Upload - Test Checklist

## Status: PENDENTE DE TESTE MANUAL

O upload de fotos está implementado e deve funcionar ponta a ponta. Este checklist documenta os passos para validar o funcionamento correto.

## Fluxo Implementado

### Frontend
1. `PhotoStep.tsx` captura fotos reais como `File[]` via input file
2. `URL.createObjectURL` usado apenas para preview local (não é mock)
3. `NewReportFlow.tsx` passa os `File[]` para `onSubmit`
4. `httpAlertClient.ts` cria `FormData` e envia via POST multipart

### Backend
1. `AlertController.java` aceita `@RequestPart List<MultipartFile> photos`
2. `AlertService.java` chama `photoStorage.store(photos)`
3. `PhotoStorageService.java` salva os arquivos em disco (`uploads/photos/`)
4. `WebConfig.java` configura resource handler para servir `/uploads/photos/**`
5. `SecurityConfig.java` permite acesso público às fotos

## Passos de Teste Manual

### 1. Preparação
- [ ] Backend rodando em `http://localhost:8080`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] Banco de dados PostgreSQL/PostGIS rodando via Docker
- [ ] Diretório `uploads/photos/` criado automaticamente pelo backend

### 2. Teste de Criação de Alerta com Fotos
- [ ] Abrir o app no browser (preferencialmente mobile ou modo responsivo)
- [ ] Clicar em "Reportar alagamento"
- [ ] Selecionar localização no mapa
- [ ] Inserir nome de usuário (ou deixar anônimo)
- [ ] **Passo crítico**: Adicionar 1-3 fotos usando o botão "Adicionar foto"
- [ ] Verificar que as fotos aparecem como preview (thumbnails)
- [ ] Selecionar severidade (MODERATE, SEVERE ou CRITICAL)
- [ ] Clicar em "Reportar"

### 3. Validação no Backend
- [ ] Verificar nos logs do Spring Boot que o request foi recebido
- [ ] Confirmar que não há erros de parsing multipart
- [ ] Verificar que os arquivos foram salvos em `api/uploads/photos/`
- [ ] Confirmar que os nomes dos arquivos seguem o padrão `UUID.extensão`

### 4. Validação no Frontend
- [ ] Verificar que o alerta foi criado com sucesso (toast de sucesso)
- [ ] Confirmar que o alerta aparece no mapa
- [ ] Clicar no alerta para abrir o detalhe
- [ ] **Passo crítico**: Verificar que as fotos são carregadas corretamente
- [ ] Confirmar que as URLs das fotos apontam para `http://localhost:8080/uploads/photos/{filename}`

### 5. Teste de Acesso Direto às Fotos
- [ ] Copiar a URL de uma foto do alerta
- [ ] Abrir em nova aba do browser
- [ ] Confirmar que a imagem é exibida corretamente
- [ ] Verificar que o Content-Type está correto (image/jpeg, image/png, etc.)

### 6. Casos de Borda
- [ ] Testar criação de alerta SEM fotos (deve funcionar)
- [ ] Testar com fotos de tamanhos diferentes (pequenas, médias, grandes)
- [ ] Testar com diferentes formatos (JPEG, PNG, HEIC se suportado)
- [ ] Testar com o máximo de fotos (3 fotos)
- [ ] Testar upload de foto muito grande (>5MB) - deve funcionar até 10MB
- [ ] Testar upload de arquivo não-imagem - deve ser rejeitado ou tratado

## Possíveis Problemas e Soluções

### Problema: Fotos não aparecem no alerta criado
**Causa possível**: CORS não configurado corretamente
**Solução**: Verificar `app.security.cors.allowed-origins` no `.env`

### Problema: Erro 413 Payload Too Large
**Causa possível**: Limite de upload excedido
**Solução**: Ajustar `spring.servlet.multipart.max-file-size` e `max-request-size` no `application.properties`

### Problema: Fotos salvas mas não acessíveis
**Causa possível**: Resource handler não configurado
**Solução**: Verificar `WebConfig.java` e permissões do diretório `uploads/photos/`

### Problema: Preview funciona mas upload falha
**Causa possível**: FormData não está sendo construído corretamente
**Solução**: Verificar console do browser para erros de rede e payload da requisição

## Evidências de Sucesso

Após completar os testes, documentar:
- [ ] Screenshot do alerta criado com fotos visíveis
- [ ] Screenshot do diretório `uploads/photos/` com os arquivos salvos
- [ ] Log do backend mostrando o request multipart bem-sucedido
- [ ] Network tab do browser mostrando o POST com status 201

## Data do Teste

- **Testado em**: _PREENCHER APÓS TESTE_
- **Testado por**: _PREENCHER APÓS TESTE_
- **Resultado**: _PREENCHER APÓS TESTE_
- **Observações**: _PREENCHER APÓS TESTE_
