package com.example.expenseTracker.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expenseTracker.Entity.Savings;

@Repository
public interface SavingsRepository extends JpaRepository <Savings, UUID> {
    List<Savings> findByUser_Id(UUID userId);

    List<Savings> findByUserId(UUID userId);
}
