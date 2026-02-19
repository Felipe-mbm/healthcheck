package com.example.health_check.controller;

import com.example.health_check.dto.AuthenticationDto;
import com.example.health_check.dto.UserDto;
import com.example.health_check.model.entity.User;
import com.example.health_check.model.enums.UserRole;
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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
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
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid AuthenticationDto data) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(data.credential());

            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> registerNewUser(email));

            user.setLastActiveAt(LocalDateTime.now());
            userRepository.save(user);

            String token = tokenService.generateToken(user);

            UserDto.Response userResponse = new UserDto.Response(
                    user.getId(),
                    user.getEmail(),
                    user.getUserRole(),
                    user.getLastActiveAt()
            );

            return ResponseEntity.ok(new LoginResponse(token, userResponse));

        } catch (GeneralSecurityException | IOException e) {
            throw new RuntimeException("Erro ao processar login Google", e);
        }
    }

    private User registerNewUser(String email) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUserRole(UserRole.USER);
        newUser.setLastActiveAt(LocalDateTime.now());
        return userRepository.save(newUser);
    }

    public record LoginResponse(String token, UserDto.Response user) {}
}