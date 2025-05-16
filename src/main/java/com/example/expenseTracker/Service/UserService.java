package com.example.expenseTracker.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.expenseTracker.DTOs.LoginRequest;
import com.example.expenseTracker.DTOs.LoginResponse;
import com.example.expenseTracker.DTOs.RegisterRequest;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User register(RegisterRequest registerRequest) {
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setName(registerRequest.getName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Encrypt password
        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        generateAndSaveVerificationCode(user.getId());

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setId(user.getId());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setName(user.getName());
        return loginResponse;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(UUID id, User user) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return null;
        }
        user.setId(id);
        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByUserNameAndPassword(String name, String password) {
        return userRepository.findByNameAndPassword(name, password);
    }

    public void generateAndSaveVerificationCode(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        userOpt.ifPresent(user -> {
            String code = String.format("%06d", new Random().nextInt(999999));
            user.setVerificationCode(code);
            user.setCodeExpirationTime(LocalDateTime.now().plusMinutes(5)); // expires in 5 mins
            userRepository.save(user);

            //his will send the code and prints it in case i'm broke and has no data
            System.out.println("2FA code for " + user.getEmail() + ": " + code);
            emailService.send2FACode(user.getEmail(), code);
            System.out.println("2FA code for " + user.getEmail() + ": " + code);
        });
    }

    public boolean verifyCode(UUID userId, String code) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        boolean isValid = user.getVerificationCode() != null
                && user.getVerificationCode().equals(code)
                && user.getCodeExpirationTime() != null
                && user.getCodeExpirationTime().isAfter(LocalDateTime.now());

        if (isValid) {
            user.setVerificationCode(null); // clear after use
            user.setCodeExpirationTime(null);
            userRepository.save(user);
        }

        return isValid;
    }
}
