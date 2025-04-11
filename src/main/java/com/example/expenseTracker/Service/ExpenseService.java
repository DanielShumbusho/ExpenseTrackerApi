package com.example.expenseTracker.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expenseTracker.DTOs.ExpenseRequest;
import com.example.expenseTracker.Entity.Category;
import com.example.expenseTracker.Entity.Expense;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Repository.CategoryRepository;
import com.example.expenseTracker.Repository.ExpenseRepository;
import com.example.expenseTracker.Repository.UserRepository;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(UUID id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public List<Expense> getExpensesByUser(UUID userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Expense createExpense(ExpenseRequest expenseRequest) {
        // Fetch the User entity using the provided user_id
        User user = userRepository.findById(expenseRequest.getUser_id())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + expenseRequest.getUser_id()));

        // Fetch the Category entity using the provided category_id
        Category category = categoryRepository.findById(expenseRequest.getCategory_id())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + expenseRequest.getCategory_id()));

        // Create the Expense entity
        Expense expense = new Expense();
        expense.setAmount(expenseRequest.getAmount());
        expense.setDescription(expenseRequest.getDescription());
        expense.setDate(expenseRequest.getDate());
        expense.setUser(user); // Assign the fetched User entity
        expense.setCategory(category); // Assign the fetched Category entity

        // Save the Expense entity
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(UUID id, Expense expense) {
        Expense existingExpense = expenseRepository.findById(id).orElse(null);
        if (existingExpense == null) {
            return null;
        }
        expense.setId(id);
        return expenseRepository.save(expense);
    }
}
