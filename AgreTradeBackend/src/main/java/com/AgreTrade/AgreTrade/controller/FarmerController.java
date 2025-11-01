package com.AgreTrade.AgreTrade.controller;

import com.AgreTrade.AgreTrade.entity.Farmer;
import com.AgreTrade.AgreTrade.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerFarmer(@RequestBody Farmer farmer) {
        try {
            Farmer registeredFarmer = farmerService.registerFarmer(farmer);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(registeredFarmer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllFarmers() {
        try {
            List<Farmer> farmers = farmerService.getAllFarmers();
            return ResponseEntity.ok(farmers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFarmerById(@PathVariable Long id) {
        try {
            Farmer farmer = farmerService.getFarmerById(id);
            return ResponseEntity.ok(farmer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Farmer not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFarmer(@PathVariable Long id, @RequestBody Farmer farmer) {
        try {
            farmer.setId(id);
            Farmer updatedFarmer = farmerService.updateFarmer(farmer);
            return ResponseEntity.ok(updatedFarmer);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Farmer not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFarmer(@PathVariable Long id) {
        try {
            farmerService.deleteFarmer(id);
            return ResponseEntity.ok("Farmer deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Farmer not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
