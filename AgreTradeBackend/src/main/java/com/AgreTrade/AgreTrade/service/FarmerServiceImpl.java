package com.AgreTrade.AgreTrade.service;

import com.AgreTrade.AgreTrade.entity.Farmer;
import com.AgreTrade.AgreTrade.repository.FarmerRepository;
import com.AgreTrade.AgreTrade.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FarmerServiceImpl implements FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Farmer registerFarmer(Farmer farmer) {
        // Check if farmer profile already exists
        if (farmerRepository.existsByEmail(farmer.getEmail())) {
            throw new RuntimeException("Farmer already exists with this email");
        }

        // Check if email is already registered as merchant
        if (merchantRepository.existsByEmail(farmer.getEmail())) {
            throw new RuntimeException("This email is already registered as a Merchant. Please use a different email or login as Merchant.");
        }

        // Encode farmer password and save
        farmer.setPassword(passwordEncoder.encode(farmer.getPassword()));
        return farmerRepository.save(farmer);
    }

    @Override
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    @Override
    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + id));
    }

    @Override
    public Farmer updateFarmer(Farmer farmer) {
        if (farmer.getId() == null || !farmerRepository.existsById(farmer.getId())) {
            throw new RuntimeException("Farmer not found with id: " + farmer.getId());
        }
        return farmerRepository.save(farmer);
    }

    @Override
    public void deleteFarmer(Long id) {
        if (!farmerRepository.existsById(id)) {
            throw new RuntimeException("Farmer not found with id: " + id);
        }
        farmerRepository.deleteById(id);
    }
}

