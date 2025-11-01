package com.AgreTrade.AgreTrade.controller;

import com.AgreTrade.AgreTrade.entity.Merchant;
import com.AgreTrade.AgreTrade.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchants")
@CrossOrigin(origins = "*")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @PostMapping("/register")
    public ResponseEntity<?> registerMerchant(@RequestBody Merchant merchant) {
        try {
            Merchant registeredMerchant = merchantService.registerMerchant(merchant);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(registeredMerchant);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error registering merchant: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllMerchants() {
        try {
            List<Merchant> merchants = merchantService.getAllMerchants();
            return ResponseEntity.ok(merchants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving merchants: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMerchantById(@PathVariable Long id) {
        try {
            Merchant merchant = merchantService.getMerchantById(id);
            return ResponseEntity.ok(merchant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving merchant: " + e.getMessage());
        }
    }
}
