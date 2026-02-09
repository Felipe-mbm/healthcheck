package com.example.health_check.service;

import com.example.health_check.model.entity.User;
import com.example.health_check.model.enums.UserRole;
import com.example.health_check.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String email = "admin@system.com";

        if (userRepository.findByEmail(email) == null) {
            User admin = new User();
            admin.setEmail(email);
            admin.setUserRole(UserRole.ADMIN);

            userRepository.save(admin);
            System.out.println(">>> Usuário ADMIN criado via DatabaseSeeder.");
        } else {
            System.out.println(">>> Usuário ADMIN já existe no banco.");
        }
    }
}