package com.example.expenseTracker.Service;

import java.util.List;
import java.util.UUID;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expenseTracker.DTOs.SavingsRequest;
import com.example.expenseTracker.Entity.Savings;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Repository.SavingsRepository;
import com.example.expenseTracker.Repository.UserRepository;

@Service
public class SavingsService {
    @Autowired
    private SavingsRepository savingsRepository;

    @Autowired
    private UserRepository userRepository;

    public Savings createSavings (SavingsRequest savingsRequest) {
        //fetch the user from the database using the user ID from the request
        //and set it to the savings object before saving it to the database
        User user = userRepository.findById(savingsRequest.getUser_id())
        .orElseThrow(() -> new RuntimeException("User not found"));

        //Convert the DTO to the entity object
        //and set the user to the savings object
        Savings savings = new Savings();
        savings.setGoal_amount(savingsRequest.getGoal_amount());
        savings.setCurrent_amount(savingsRequest.getCurrent_amount());
        savings.setDescription(savingsRequest.getDescription());
        savings.setUser(user);

        //save to the database
        return savingsRepository.save(savings);
    }
    public List<Savings> getSavingsByUser(UUID userId) {
        return savingsRepository.findByUser_Id(userId);
    }
    public void deleteSaving(UUID id) {
        savingsRepository.deleteById(id);
    }
    public boolean deleteSavingByName(UUID userId, String description) {
    Optional<Savings> savingOpt = savingsRepository.findByUserIdAndDescription(userId, description);
    if (savingOpt.isPresent()) {
        savingsRepository.delete(savingOpt.get());
        return true;
    } else {
        return false;
    }
    }

    public boolean updateSavingByName(UUID userId, String description, SavingsRequest updatedData) {
    Optional<Savings> existingOpt = savingsRepository.findByUserIdAndDescription(userId, description);
    if (existingOpt.isPresent()) {
        Savings existing = existingOpt.get();
        if (updatedData.getGoal_amount() != null) {
            existing.setGoal_amount(updatedData.getGoal_amount());
        }
        if (updatedData.getCurrent_amount() != null) {
            existing.setCurrent_amount(updatedData.getCurrent_amount());
        }
        if (updatedData.getDescription() != null && !updatedData.getDescription().isEmpty()) {
            existing.setDescription(updatedData.getDescription());
        }

        savingsRepository.save(existing);
        return true;
    }
    return false;
}

}
