package com.AgreTrade.AgreTrade.controller;

import com.AgreTrade.AgreTrade.entity.Farmer;
import com.AgreTrade.AgreTrade.entity.Merchant;
import com.AgreTrade.AgreTrade.service.FarmerService;
import com.AgreTrade.AgreTrade.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private MerchantService merchantService;

    /**
     * Get all registered farmers
     * Only accessible by users with ROLE_ADMIN
     */
    @GetMapping("/farmers")
    public ResponseEntity<?> getAllFarmers() {
        try {
            List<Farmer> farmers = farmerService.getAllFarmers();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", farmers.size());
            response.put("data", farmers);
            response.put("message", "Successfully retrieved all farmers");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving farmers: " + e.getMessage());
        }
    }

    /**
     * Get all registered merchants
     * Only accessible by users with ROLE_ADMIN
     */
    @GetMapping("/merchants")
    public ResponseEntity<?> getAllMerchants() {
        try {
            List<Merchant> merchants = merchantService.getAllMerchants();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", merchants.size());
            response.put("data", merchants);
            response.put("message", "Successfully retrieved all merchants");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving merchants: " + e.getMessage());
        }
    }

    /**
     * Delete a farmer by ID
     * Only accessible by users with ROLE_ADMIN
     */
    @DeleteMapping("/deleteFarmer/{id}")
    public ResponseEntity<?> deleteFarmer(@PathVariable Long id) {
        try {
            farmerService.deleteFarmer(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Farmer with ID " + id + " has been successfully deleted");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Farmer not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting farmer: " + e.getMessage());
        }
    }

    /**
     * Delete a merchant by ID
     * Only accessible by users with ROLE_ADMIN
     */
    @DeleteMapping("/deleteMerchant/{id}")
    public ResponseEntity<?> deleteMerchant(@PathVariable Long id) {
        try {
            merchantService.deleteMerchant(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Merchant with ID " + id + " has been successfully deleted");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Merchant not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting merchant: " + e.getMessage());
        }
    }

    /**
     * Get statistics for admin dashboard
     * Returns counts of farmers and merchants
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            List<Farmer> farmers = farmerService.getAllFarmers();
            List<Merchant> merchants = merchantService.getAllMerchants();
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalFarmers", farmers.size());
            statistics.put("totalMerchants", merchants.size());
            statistics.put("totalUsers", farmers.size() + merchants.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statistics);
            response.put("message", "Statistics retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving statistics: " + e.getMessage());
        }
    }

    /**
     * Get a specific farmer by ID (admin view)
     */
    @GetMapping("/farmer/{id}")
    public ResponseEntity<?> getFarmerById(@PathVariable Long id) {
        try {
            Farmer farmer = farmerService.getFarmerById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", farmer);
            response.put("message", "Farmer retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Farmer not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving farmer: " + e.getMessage());
        }
    }

    /**
     * Get a specific merchant by ID (admin view)
     */
    @GetMapping("/merchant/{id}")
    public ResponseEntity<?> getMerchantById(@PathVariable Long id) {
        try {
            Merchant merchant = merchantService.getMerchantById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", merchant);
            response.put("message", "Merchant retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Merchant not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving merchant: " + e.getMessage());
        }
    }
}
