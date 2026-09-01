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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    // bcrypt hash of a discarded random value; matched against on the failure path so a missing or
    // Google-only account costs the same wall-clock time as a wrong password (no user enumeration).
    private static final String DUMMY_BCRYPT_HASH = "$2b$10$RuHOtmI676mjFjyQPKAd/u0WZrp4VI7i8IlT9ipcPbVeE7sYkvgXC";

    private final GoogleIdTokenVerifierService googleIdTokenVerifierService;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            GoogleIdTokenVerifierService googleIdTokenVerifierService,
            UsuarioRepository usuarioRepository,
            JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder
    ) {
        this.googleIdTokenVerifierService = googleIdTokenVerifierService;
        this.usuarioRepository = usuarioRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse loginWithGoogle(String idToken) {
        GoogleUserInfo googleUserInfo = googleIdTokenVerifierService.verify(idToken);

        Usuario usuario = usuarioRepository.findByGoogleId(googleUserInfo.googleId())
                .orElseGet(() -> linkOrCreateGoogleAccount(googleUserInfo));

        return authResponse(usuario);
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessRuleException("Este e-mail já está cadastrado");
        }

        Usuario usuario = usuarioRepository.save(new Usuario(
                request.email(),
                request.name(),
                passwordEncoder.encode(request.password())
        ));

        return authResponse(usuario);
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email()).orElse(null);
        String passwordHash = (usuario != null && usuario.getPasswordHash() != null)
                ? usuario.getPasswordHash()
                : DUMMY_BCRYPT_HASH;

        boolean passwordMatches = passwordEncoder.matches(request.password(), passwordHash);

        if (usuario == null || usuario.getPasswordHash() == null || !passwordMatches) {
            throw new InvalidCredentialsException("E-mail ou senha inválidos");
        }

        return authResponse(usuario);
    }

    private Usuario linkOrCreateGoogleAccount(GoogleUserInfo googleUserInfo) {
        // Reached only after GoogleIdTokenVerifierService has asserted the Google e-mail is verified,
        // so linking onto an existing password account here cannot be driven by an unverified address.
        Usuario usuario = usuarioRepository.findByEmail(googleUserInfo.email())
                .orElseGet(() -> new Usuario(
                        googleUserInfo.email(),
                        googleUserInfo.name(),
                        null,
                        null
                ));
        usuario.linkGoogleAccount(googleUserInfo.googleId(), googleUserInfo.pictureUrl());
        return usuarioRepository.save(usuario);
    }

    private AuthResponse authResponse(Usuario usuario) {
        String token = jwtTokenProvider.generateToken(usuario.getId(), usuario.getEmail(), usuario.getRole());
        return new AuthResponse(token, usuario.getId(), usuario.getEmail(), usuario.getName(), usuario.getPictureUrl(), usuario.getRole());
    }
}
