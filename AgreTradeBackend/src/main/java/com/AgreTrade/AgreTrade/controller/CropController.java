package com.AgreTrade.AgreTrade.controller;

import com.AgreTrade.AgreTrade.entity.Crop;
import com.AgreTrade.AgreTrade.entity.Farmer;
import com.AgreTrade.AgreTrade.repository.CropRepository;
import com.AgreTrade.AgreTrade.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    /**
     * Add a new crop for a farmer
     */
    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<?> addCrop(@PathVariable Long farmerId, @RequestBody Crop crop) {
        try {
            Farmer farmer = farmerRepository.findById(farmerId)
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));

            crop.setFarmer(farmer);
            Crop savedCrop = cropRepository.save(crop);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crop added successfully");
            response.put("data", savedCrop);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Get all crops for a specific farmer
     */
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<?> getFarmerCrops(@PathVariable Long farmerId) {
        try {
            List<Crop> crops = cropRepository.findByFarmerId(farmerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", crops.size());
            response.put("data", crops);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Search crops by name
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCrops(@RequestParam String cropName) {
        try {
            List<Crop> crops = cropRepository.findByCropNameContainingIgnoreCase(cropName);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", crops.size());
            response.put("data", crops);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Update a crop
     */
    @PutMapping("/{cropId}")
    public ResponseEntity<?> updateCrop(@PathVariable Long cropId, @RequestBody Crop cropDetails) {
        try {
            Crop crop = cropRepository.findById(cropId)
                    .orElseThrow(() -> new RuntimeException("Crop not found"));

            crop.setCropName(cropDetails.getCropName());
            crop.setPrice(cropDetails.getPrice());
            crop.setQuantity(cropDetails.getQuantity());
            crop.setDescription(cropDetails.getDescription());

            Crop updatedCrop = cropRepository.save(crop);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crop updated successfully");
            response.put("data", updatedCrop);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Delete a crop
     */
    @DeleteMapping("/{cropId}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long cropId) {
        try {
            if (!cropRepository.existsById(cropId)) {
                throw new RuntimeException("Crop not found");
            }

            cropRepository.deleteById(cropId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Crop deleted successfully");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Get all crops
     */
    @GetMapping
    public ResponseEntity<?> getAllCrops() {
        try {
            List<Crop> crops = cropRepository.findAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", crops.size());
            response.put("data", crops);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}
