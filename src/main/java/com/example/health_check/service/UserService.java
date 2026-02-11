package com.example.health_check.service;

import com.example.health_check.dto.UserDto;
import com.example.health_check.exception.BusinessError;
import com.example.health_check.exception.BusinessException;
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
        if (userRepository.findByEmail(request.email()).isPresent())
            throw new BusinessException(BusinessError.EMAIL_ALREADY_REGISTERED);

        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }

    public void delete(String id) {
        if (!userRepository.existsById(id))
            throw new BusinessException(BusinessError.USER_NOT_FOUND);
        userRepository.deleteById(id);
    }

    public List<UserDto.Response> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public void update(String id, UserDto.UpdateRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(BusinessError.USER_NOT_FOUND));
        if(request.email() != null && !request.email().equals(user.getEmail())){
            if(userRepository.findByEmail(request.email()).isPresent()) {
                throw new BusinessException(BusinessError.EMAIL_ALREADY_REGISTERED);
            }
            user.setEmail(request.email());
        }
        if (request.role() != null){
            user.setUserRole(request.role());
        }
        userRepository.save(user);
    }
}

