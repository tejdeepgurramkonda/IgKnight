package com.example.IgKnight.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.IgKnight.dto.AuthResponse;
import com.example.IgKnight.dto.SignInRequest;
import com.example.IgKnight.dto.SignUpRequest;
import com.example.IgKnight.entity.User;
import com.example.IgKnight.exception.AuthenticationException;
import com.example.IgKnight.exception.ResourceAlreadyExistsException;
import com.example.IgKnight.repository.UserRepository;
import com.example.IgKnight.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCountry(request.getCountry());
        user.setProvider("local");
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }

    public AuthResponse signIn(SignInRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

        // Check if user is OAuth user
        if (user.getProvider() != null && !user.getProvider().equals("local")) {
            throw new AuthenticationException("Please sign in with " + user.getProvider());
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthenticationException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new AuthenticationException("Account is inactive");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }
}
