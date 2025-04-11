package com.example.expenseTracker.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class BudgetRequest {
    private BigDecimal amount;
    private LocalDate start_date;
    private LocalDate end_date;
    private UUID user_id;
    private UUID category_id;
    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public LocalDate getStart_date() {
        return start_date;
    }
    public void setStart_date(LocalDate start_date) {
        this.start_date = start_date;
    }
    public LocalDate getEnd_date() {
        return end_date;
    }
    public void setEnd_date(LocalDate end_date) {
        this.end_date = end_date;
    }
    public UUID getUser_id() {
        return user_id;
    }
    public void setUser_id(UUID user_id) {
        this.user_id = user_id;
    }
    public UUID getCategory_id() {
        return category_id;
    }
    public void setCategory_id(UUID category_id) {
        this.category_id = category_id;
    }

    
}
