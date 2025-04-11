package com.example.expenseTracker.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expenseTracker.DTOs.BudgetRequest;
import com.example.expenseTracker.Entity.Budget;
import com.example.expenseTracker.Service.BudgetService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody BudgetRequest budgetRequest){
        Budget savedBudget = budgetService.createBudget(budgetRequest); 
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBudget);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUser(@PathVariable UUID userId){
        List<Budget> budgets = budgetService.getBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<Budget>> getBudgetsByUserAndCategory(@PathVariable UUID userId, @PathVariable UUID categoryId){
        List<Budget> budgets = budgetService.getBudgetsByUserAndCategory(userId, categoryId);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/user/{userId}/overall")
    public ResponseEntity<List<Budget>> getOverallBudgetsByUser(@PathVariable UUID userId){
        List<Budget> budgets = budgetService.getOverallBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }
}
