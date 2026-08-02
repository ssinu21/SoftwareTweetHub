package com.example.softwaretweethub.service;

import com.example.softwaretweethub.model.User;
import com.example.softwaretweethub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {

        Optional<User> existingUser =
                userRepository.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            return null;
        }

        return userRepository.save(user);
    }

    public User login(String username, String password) {

        Optional<User> user =
                userRepository.findByUsername(username);

        if (user.isPresent()
                && user.get().getPassword().equals(password)) {

            return user.get();
        }

        return null;
    }
}
