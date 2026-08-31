package com.alagou.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void genericHandlerNeverLeaksExceptionMessage() {
        RuntimeException leaky = new RuntimeException(
                "ERROR: relation \"usuario\" violates constraint uq_usuario_email; SQL state 23505");

        ResponseEntity<ErrorResponse> response = handler.handleGeneric(leaky);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().detail()).isEqualTo("Erro interno. Tente novamente mais tarde.");
        assertThat(response.getBody().detail()).doesNotContain("usuario", "SQL", "constraint", "23505");
        assertThat(response.getBody().error()).doesNotContain("usuario", "SQL");
    }

    @Test
    void uploadTooLargeMapsTo413WithoutDetail() {
        ResponseEntity<ErrorResponse> response = handler.handleUploadTooLarge(new MaxUploadSizeExceededException(5_242_880L));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().detail()).doesNotContainIgnoringCase("byte");
    }

    @Test
    void typeMismatchMapsTo400Generic() {
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "not-a-number", Double.class, "lat", null, new NumberFormatException("For input string: \"not-a-number\""));

        ResponseEntity<ErrorResponse> response = handler.handleMalformedRequest(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().detail()).isEqualTo("Requisição inválida.");
    }
}
