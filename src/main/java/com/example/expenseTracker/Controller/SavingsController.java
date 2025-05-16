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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @DeleteMapping("/{id}")
    public void deleteSaving(@PathVariable UUID id) {
        savingsService.deleteSaving(id);
    }

    @DeleteMapping("/deleteByName/{userId}/{description}")
    public ResponseEntity<String> deleteSavingByName(
    @PathVariable UUID userId,
    @PathVariable String description
    ) {
    boolean deleted = savingsService.deleteSavingByName(userId, description);
    if (deleted) {
        return ResponseEntity.ok("Saving with name '" + description + "' deleted.");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Saving not found.");
    }
    }

    @PutMapping("/updateByName/{userId}/{description}")
    public ResponseEntity<String> updateSavingByName(
    @PathVariable UUID userId,
    @PathVariable String description,
    @RequestBody SavingsRequest savingsRequest
    ) {
    boolean updated = savingsService.updateSavingByName(userId, description, savingsRequest);
    if (updated) {
        return ResponseEntity.ok("Saving updated successfully.");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Saving not found.");
    }
    }
    
}
