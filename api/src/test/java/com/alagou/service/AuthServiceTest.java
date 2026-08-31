package com.alagou.service;

import com.alagou.domain.Usuario;
import com.alagou.dto.AuthResponse;
import com.alagou.dto.LoginRequest;
import com.alagou.dto.RegisterRequest;
import com.alagou.exception.BusinessRuleException;
import com.alagou.exception.InvalidCredentialsException;
import com.alagou.repository.UsuarioRepository;
import com.alagou.security.GoogleIdTokenVerifierService;
import com.alagou.security.GoogleUserInfo;
import com.alagou.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private GoogleIdTokenVerifierService googleIdTokenVerifierService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(googleIdTokenVerifierService, usuarioRepository, jwtTokenProvider, passwordEncoder);
    }

    @Test
    void registersNewAccountWithHashedPassword() {
        RegisterRequest request = new RegisterRequest("Citizen", "citizen@example.com", "password123");
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.generateToken(any(), anyString())).thenReturn("token");

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.email()).isEqualTo("citizen@example.com");

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        assertThat(captor.getValue().getPasswordHash()).isEqualTo("hashed");
        assertThat(captor.getValue().getGoogleId()).isNull();
    }

    @Test
    void rejectsRegistrationWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Citizen", "citizen@example.com", "password123");
        when(usuarioRepository.findByEmail("citizen@example.com"))
                .thenReturn(Optional.of(mock(Usuario.class)));

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void logsInWithValidCredentials() {
        Usuario usuario = new Usuario("citizen@example.com", "Citizen", "hashed");
        LoginRequest request = new LoginRequest("citizen@example.com", "password123");
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtTokenProvider.generateToken(any(), anyString())).thenReturn("token");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("token");
    }

    @Test
    void rejectsLoginWithWrongPassword() {
        Usuario usuario = new Usuario("citizen@example.com", "Citizen", "hashed");
        LoginRequest request = new LoginRequest("citizen@example.com", "wrong");
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void rejectsLoginForGoogleOnlyAccount() {
        Usuario usuario = new Usuario("citizen@example.com", "Citizen", "google-id", "pic-url");
        LoginRequest request = new LoginRequest("citizen@example.com", "anything");
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void linksGoogleAccountToExistingManualAccountWithSameEmail() {
        Usuario existing = new Usuario("citizen@example.com", "Citizen", "hashed");
        GoogleUserInfo googleUserInfo = new GoogleUserInfo("google-id", "citizen@example.com", "Citizen", "pic-url");
        when(googleIdTokenVerifierService.verify("id-token")).thenReturn(googleUserInfo);
        when(usuarioRepository.findByGoogleId("google-id")).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.of(existing));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.generateToken(any(), anyString())).thenReturn("token");

        authService.loginWithGoogle("id-token");

        assertThat(existing.getGoogleId()).isEqualTo("google-id");
        assertThat(existing.getPasswordHash()).isEqualTo("hashed");
    }

    @Test
    void spendsPasswordHashComparisonEvenWhenUserDoesNotExist() {
        LoginRequest request = new LoginRequest("ghost@example.com", "secret123");
        when(usuarioRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("E-mail ou senha inválidos");

        verify(passwordEncoder).matches(eq("secret123"), anyString());
    }

    @Test
    void usesTheSameGenericMessageForGoogleOnlyAccounts() {
        Usuario usuario = new Usuario("citizen@example.com", "Citizen", "google-id", "pic-url");
        LoginRequest request = new LoginRequest("citizen@example.com", "anything");
        when(usuarioRepository.findByEmail("citizen@example.com")).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("E-mail ou senha inválidos");

        verify(passwordEncoder).matches(eq("anything"), anyString());
    }

    @Test
    void propagatesRejectionWhenGoogleEmailIsNotVerified() {
        when(googleIdTokenVerifierService.verify("id-token"))
                .thenThrow(new InvalidCredentialsException("E-mail do Google não verificado"));

        assertThatThrownBy(() -> authService.loginWithGoogle("id-token"))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
