package com.example.expenseTracker.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expenseTracker.Entity.Category;
import com.example.expenseTracker.Entity.Expense;
import com.example.expenseTracker.Entity.User;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUser(User user);
    List<Expense> findByCategory(Category category);
    List<Expense> findByUserId(UUID userId);
}
