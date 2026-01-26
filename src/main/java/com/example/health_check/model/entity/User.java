package com.example.health_check.model.entity;

import com.example.health_check.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public UserRole userRole = UserRole.USER;

    @Column(name = "email")
    private String email;

    @Column(name = "checked_interval")
    private Integer checkInterval = 1;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;
}
