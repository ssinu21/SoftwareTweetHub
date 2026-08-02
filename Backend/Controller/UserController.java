package com.example.softwaretweethub.controller;

import com.example.softwaretweethub.model.User;
import com.example.softwaretweethub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User registeredUser = userService.register(user);

        if (registeredUser == null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already taken");
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User loggedInUser = userService.login(
                user.getUsername(),
                user.getPassword()
        );

        if (loggedInUser == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect username or password");
        }

        return ResponseEntity.ok(loggedInUser);
    }
}
