package com.example.expenseTracker.Entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Savings {//Entity used for the database table
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private BigDecimal goal_amount;
    private BigDecimal current_amount;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
