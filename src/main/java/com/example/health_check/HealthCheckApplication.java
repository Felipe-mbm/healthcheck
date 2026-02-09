package com.example.health_check;

import com.example.health_check.model.entity.User;
import com.example.health_check.model.enums.UserRole;
import com.example.health_check.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class HealthCheckApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthCheckApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String email = "admin@system.com";

			// Se NÃO encontrar o e-mail, cria um novo
			if (userRepository.findByEmail(email) == null) {
				User admin = new User();
				// Remova o setId manual para evitar o conflito de transação
				admin.setEmail(email);
				admin.setUserRole(UserRole.ADMIN);

				userRepository.save(admin);
				System.out.println(">>> Usuário ADMIN criado com sucesso via Código.");
			} else {
				System.out.println(">>> Usuário ADMIN já existe. O sistema vai subir normalmente.");
			}
		};
	}
}