package com.example.expenseTracker.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expenseTracker.DTOs.CodeVerificationRequest;
import com.example.expenseTracker.DTOs.LoginRequest;
import com.example.expenseTracker.DTOs.RegisterRequest;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Service.UserService;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> user = userService.getUserByUserNameAndPassword(
            request.getName(), request.getPassword()
        );

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        User user = userService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUserByUserNameAndPassword(@RequestParam String name, @RequestParam String password) {
        Optional<User> userOpt = userService.getUserByUserNameAndPassword(name, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Generate & send code
            userService.generateAndSaveVerificationCode(user.getId());

            // Return only the user ID for now
            return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "message", "Verification code sent to your email"
            ));
        } else {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verify2FACode(@RequestBody CodeVerificationRequest request) {
        boolean isValid = userService.verifyCode(request.getUserId(), request.getCode());

        if (isValid) {
            Optional<User> user = userService.getUserById(request.getUserId());
            return ResponseEntity.ok(user.get());
        } else {
            return new ResponseEntity<>("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }
    }
}
