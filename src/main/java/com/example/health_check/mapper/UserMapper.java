package com.example.health_check.mapper;

import com.example.health_check.dto.UserDto;
import com.example.health_check.model.entity.User;
import com.example.health_check.model.enums.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserDto.CreateRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setUserRole(request.role() != null ? request.role() : UserRole.USER);
        return user;
    }

    public UserDto.Response toResponse(User entity) {
        return new UserDto.Response(
                entity.getId(),
                entity.getEmail(),
                entity.getUserRole(),
                entity.getLastActiveAt()
        );
    }
}
