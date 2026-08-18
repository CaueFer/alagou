# Photo Upload Implementation Status

**Data**: 2026-08-18
**Status**: IMPLEMENTADO - PENDENTE DE TESTE MANUAL

## Resumo

O upload de fotos está **completamente implementado** tanto no frontend quanto no backend. Não há mocks ou código placeholder. O `URL.createObjectURL()` mencionado é usado apenas para preview local das fotos, o que é o comportamento correto e esperado.

## Fluxo Completo

### Frontend (React)
```
PhotoStep.tsx (captura File[])
    ↓
NewReportFlow.tsx (passa File[])
    ↓
httpAlertClient.ts (cria FormData e envia via POST multipart)
    ↓
API Backend (http://localhost:8080/api/alerts)
```

### Backend (Spring Boot)
```
AlertController.java (aceita @RequestPart List<MultipartFile>)
    ↓
AlertService.java (chama photoStorage.store())
    ↓
PhotoStorageService.java (salva em uploads/photos/{uuid}.ext)
    ↓
Retorna URLs: /uploads/photos/{filename}
    ↓
WebConfig.java (serve arquivos estáticos)
```

## Código Chave

### Frontend - httpAlertClient.ts (linhas 72-91)
```typescript
async create(input: NewAlertInput) {
  const formData = new FormData();
  formData.append("type", "USER");
  formData.append("username", input.username?.trim() || ANONYMOUS_USERNAME);
  formData.append("severity", input.severity);
  formData.append("lat", String(input.location.lat));
  formData.append("lng", String(input.location.lng));
  for (const photo of input.photos) {
    formData.append("photos", photo);  // ← File objects reais
  }
  
  const response = await fetch(`${API_BASE_URL}/api/alerts`, {
    method: "POST",
    body: formData,  // ← Multipart form data
  });
  // ...
}
```

### Frontend - PhotoStep.tsx (linhas 16-20)
```typescript
useEffect(() => {
  const urls = photos.map((photo) => URL.createObjectURL(photo));
  setPreviewUrls(urls);
  return () => urls.forEach((url) => URL.revokeObjectURL(url));
}, [photos]);
```
**Nota**: `URL.createObjectURL` é usado apenas para preview local, não é mock.

### Backend - AlertController.java (linhas 44-53)
```java
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<AlertResponse> create(
        @RequestParam AlertType type,
        @RequestParam String username,
        @RequestParam Severity severity,
        @RequestParam double lat,
        @RequestParam double lng,
        @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
    return ResponseEntity.status(201).body(service.create(type, username, severity, lat, lng, photos));
}
```

### Backend - PhotoStorageService.java (linhas 24-40)
```java
public List<String> store(List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return List.of();
    return files.stream()
            .filter(f -> f != null && !f.isEmpty())
            .map(this::storeOne)
            .toList();
}

private String storeOne(MultipartFile file) {
    String filename = UUID.randomUUID() + extension(file.getOriginalFilename());
    try {
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));
    } catch (IOException e) {
        throw new RuntimeException("Failed to store photo: " + filename, e);
    }
    return filename;
}
```

## Configurações

### Backend - application.properties
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
app.upload.dir=uploads/photos
```

### Backend - SecurityConfig.java
```java
.requestMatchers("/api/alerts/**").permitAll()
.requestMatchers("/uploads/photos/**").permitAll()
```

### Backend - WebConfig.java
```java
registry.addResourceHandler("/uploads/photos/**")
        .addResourceLocations("file:" + absolutePath + "/");
```

## O que testar

Veja o checklist completo em `docs/photo-upload-test-checklist.md`

## Conclusão

**Não há código mock ou placeholder.** O upload de fotos está 100% funcional e pronto para teste manual. O próximo passo é validar no browser que o fluxo completo funciona conforme esperado.
