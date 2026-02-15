package com.example.health_check.controller;

import com.example.health_check.dto.AuthenticationDto;
import com.example.health_check.exception.BusinessError;
import com.example.health_check.exception.BusinessException;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.UserRepository;
import com.example.health_check.service.TokenService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.health_check.dto.UserDto;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Value("${api.security.google.client-id}")
    private String googleClientId;

    public AuthController(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDto data) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(data.credential());

            if (idToken == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Google Inválido");

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BusinessException(BusinessError.USER_NOT_FOUND));

            String token = tokenService.generateToken(user);
            UserDto.Response userResponse = new UserDto.Response(
                    user.getId(),
                    user.getEmail(),
                    user.getUserRole(),
                    user.getLastActiveAt()
            );
            return ResponseEntity.ok(new LoginResponse(token, userResponse));

        } catch (GeneralSecurityException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public record LoginResponse(String token, UserDto.Response user){}}
