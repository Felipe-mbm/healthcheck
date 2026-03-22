package com.example.health_check.controller;

import com.example.health_check.dto.UserDto;
import com.example.health_check.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDto.Response> create(@RequestBody @Valid UserDto.CreateRequest request) {
        UserDto.Response newUser = userService.register(request);
        return ResponseEntity.created(URI.create("/users/" + newUser.id())).body(newUser);
    }

    @GetMapping
    public ResponseEntity<List<UserDto.Response>> list() {
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable String id, @Valid @RequestBody UserDto.UpdateRequest request){
        userService.update(id, request);
        return ResponseEntity.noContent().build();
    }
}
