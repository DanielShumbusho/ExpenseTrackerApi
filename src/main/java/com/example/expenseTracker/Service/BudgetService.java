package com.example.expenseTracker.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expenseTracker.DTOs.BudgetRequest;
import com.example.expenseTracker.Entity.Budget;
import com.example.expenseTracker.Entity.Category;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Repository.CategoryRepository;
import com.example.expenseTracker.Repository.UserRepository;
import com.example.expenseTracker.Repository.BudgetRepository;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Budget createBudget(BudgetRequest budgetRequest){
        //Fetch the user entity
        User user = userRepository.findById(budgetRequest.getUser_id())
        .orElseThrow(() -> new RuntimeException("User not found"));

        //Fetch the category entity
        Category category = null;
        if(budgetRequest.getCategory_id() != null){
            category = categoryRepository.findById(budgetRequest.getCategory_id()).orElseThrow(() -> new RuntimeException("Category not found"));

            boolean exists = budgetRepository.existsByUserIdAndCategoryId(user.getId(), category.getId());
            if (exists) {
                throw new RuntimeException("Budget for this category already exists for the user.");
            }
        }

        //Create the budget entity
        Budget budget = new Budget();
        budget.setAmount(budgetRequest.getAmount());
        budget.setStart_date(budgetRequest.getStart_date());
        budget.setEnd_date(budgetRequest.getEnd_date());
        budget.setUser(user);
        budget.setCategory(category);

        //Save the budget entity
        return budgetRepository.save(budget);
    }
    

    public List<Budget> getBudgetsByUser(UUID userId){
        return budgetRepository.findByUser_Id(userId);
    }

    public List<Budget> getBudgetsByUserAndCategory(UUID userId, UUID categoryId){
        return budgetRepository.findByUser_IdAndCategory_Id(userId, categoryId);
    }

    public List<Budget> getOverallBudgetsByUser(UUID userId){
        return budgetRepository.findByUser_IdAndCategoryIsNull(userId);
    }

    public boolean budgetExists(UUID userId, UUID categoryId) {
    return budgetRepository.existsByUserIdAndCategoryId(userId, categoryId);
    }
}
