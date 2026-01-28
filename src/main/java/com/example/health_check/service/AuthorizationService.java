package com.example.health_check.service;

import com.example.health_check.model.entity.User;
import com.example.health_check.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class AuthorizationService implements UserDetailsService {

    private final UserRepository repository;

    public AuthorizationService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userDetails = repository.findByEmail(email);
        if (userDetails == null)
            throw new UsernameNotFoundException("User not found");
        return null;
    }

}
