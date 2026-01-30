package com.example.health_check.service;

import com.example.health_check.dto.UserDto;
import com.example.health_check.mapper.UserMapper;
import com.example.health_check.model.entity.User;
import com.example.health_check.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserDto.Response register(UserDto.CreateRequest request) {
        if (userRepository.findAll().stream().anyMatch(u -> u.getEmail().equals(request.email())))
            throw new RuntimeException("Email already registered!");
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }

    public void delete(String id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("User not found");
        userRepository.deleteById(id);
    }

    public List<UserDto.Response> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }
}
