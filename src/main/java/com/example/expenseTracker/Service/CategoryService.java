package com.example.expenseTracker.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expenseTracker.DTOs.CategoryRequest;
import com.example.expenseTracker.Entity.Category;
import com.example.expenseTracker.Entity.User;
import com.example.expenseTracker.Repository.CategoryRepository;
import com.example.expenseTracker.Repository.UserRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getCategoriesByUser(UUID userId) {
        return categoryRepository.findByUserId(userId);
    }

    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category createCategory(CategoryRequest categoryRequest) {
        // Fetch the User entity using the provided user_id
        User user = userRepository.findById(categoryRequest.getUser_id())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + categoryRequest.getUser_id()));
    
        // Create the Category entity
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setUser(user); // Assign the fetched User entity
    
        // Save the Category entity
        return categoryRepository.save(category);
    }

    public Category updateCategory(UUID id, Category category) {
        Category categoryToUpdate = categoryRepository.findById(id).orElse(null);
        if (categoryToUpdate == null) {
            return null;
        }
        category.setId(id);
        return categoryRepository.save(category);
    }

    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }
}
