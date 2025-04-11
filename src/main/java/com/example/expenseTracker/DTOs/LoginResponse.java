package com.example.expenseTracker.DTOs;

import java.util.UUID;

import lombok.Data;

@Data
public class LoginResponse {
    private UUID id;
    private String email;
    private String name;
}