package com.alagou.service;

import com.alagou.domain.Usuario;
import com.alagou.dto.AuthResponse;
import com.alagou.repository.UsuarioRepository;
import com.alagou.security.GoogleIdTokenVerifierService;
import com.alagou.security.GoogleUserInfo;
import com.alagou.security.JwtTokenProvider;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final GoogleIdTokenVerifierService googleIdTokenVerifierService;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            GoogleIdTokenVerifierService googleIdTokenVerifierService,
            UsuarioRepository usuarioRepository,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.googleIdTokenVerifierService = googleIdTokenVerifierService;
        this.usuarioRepository = usuarioRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse loginWithGoogle(String idToken) {
        GoogleUserInfo googleUserInfo = googleIdTokenVerifierService.verify(idToken);

        Usuario usuario = usuarioRepository.findByGoogleId(googleUserInfo.googleId())
                .orElseGet(() -> usuarioRepository.save(new Usuario(
                        googleUserInfo.email(),
                        googleUserInfo.name(),
                        googleUserInfo.googleId(),
                        googleUserInfo.pictureUrl()
                )));

        String token = jwtTokenProvider.generateToken(usuario.getId(), usuario.getEmail());

        return new AuthResponse(token, usuario.getId(), usuario.getEmail(), usuario.getName(), usuario.getPictureUrl());
    }
}
