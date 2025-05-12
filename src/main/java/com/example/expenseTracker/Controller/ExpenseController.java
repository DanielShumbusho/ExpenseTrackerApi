package com.example.expenseTracker.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expenseTracker.DTOs.ExpenseRequest;
import com.example.expenseTracker.Entity.Expense;
import com.example.expenseTracker.Service.ExpenseService;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/user/{userId}")
        public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable UUID userId) {
        List<Expense> expenses = expenseService.getExpensesByUser(userId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody ExpenseRequest expenseRequest) {
        // Ensure the request body is not null
        if (expenseRequest == null) {
            throw new IllegalArgumentException("Request body must not be null");
        }

        // Ensure user_id and category_id are not null
        if (expenseRequest.getUser_id() == null || expenseRequest.getCategory_id() == null) {
            throw new IllegalArgumentException("User ID and Category ID must not be null");
        }

        Expense savedExpense = expenseService.createExpense(expenseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    @GetMapping("/{id}")
    public Expense getExpenseById(UUID id) {
        return expenseService.getExpenseById(id);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(UUID id, Expense expense) {
        return expenseService.updateExpense(id, expense);
    }
    
}
