package com.example.expenseTracker.DTOs;

import java.math.BigDecimal;
import java.util.UUID;

public class SavingsRequest {//DTO data transfert object used for APIs requests
    private BigDecimal goal_amount;
    private BigDecimal current_amount;
    private String description;
    private UUID user_id;
    public BigDecimal getGoal_amount() {
        return goal_amount;
    }
    public void setGoal_amount(BigDecimal goal_amount) {
        this.goal_amount = goal_amount;
    }
    public BigDecimal getCurrent_amount() {
        return current_amount;
    }
    public void setCurrent_amount(BigDecimal current_amount) {
        this.current_amount = current_amount;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public UUID getUser_id() {
        return user_id;
    }
    public void setUser_id(UUID user_id) {
        this.user_id = user_id;
    }

    

    
}
