package com.example.expenseTracker.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expenseTracker.DTOs.SavingsRequest;
import com.example.expenseTracker.Entity.Savings;
import com.example.expenseTracker.Service.SavingsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/savings")
public class SavingsController {
    @Autowired
    private SavingsService savingsService;

    @PostMapping
    public ResponseEntity<Savings> createSavings(@RequestBody SavingsRequest savingRequest) {
        Savings savedSavings = savingsService.createSavings(savingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSavings);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Savings>> getSavingsByUSer(@PathVariable UUID userId) {
        List<Savings> savings = savingsService.getSavingsByUser(userId);
        return ResponseEntity.ok(savings);
    }

    @GetMapping("/savings/user/{userId}")
        public ResponseEntity<List<Savings>> getSavingsByUser(@PathVariable UUID userId) {
        List<Savings> savings = savingsService.getSavingsByUser(userId);
        return ResponseEntity.ok(savings);
    }
    
    
}
