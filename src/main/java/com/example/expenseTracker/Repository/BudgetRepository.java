package com.example.expenseTracker.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expenseTracker.Entity.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID>{
    List<Budget> findByUser_Id(UUID userId);
    
    //Find all budgets for a specific user and category
    List<Budget> findByUser_IdAndCategory_Id(UUID userId, UUID categoryId);

    //Find all budgets for a specific user (overall budgets, where category is null)
    List<Budget> findByUser_IdAndCategoryIsNull(UUID userId);

    List<Budget> findByUserId(UUID userId);

    boolean existsByUserIdAndCategoryId(UUID userId, UUID categoryId);
}
