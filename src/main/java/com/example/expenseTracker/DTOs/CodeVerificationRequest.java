package com.example.expenseTracker.DTOs;

import java.util.UUID;

public class CodeVerificationRequest {
    private UUID userId;
    private String code;
    
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
