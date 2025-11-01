package com.AgreTrade.AgreTrade.service;

import com.AgreTrade.AgreTrade.entity.Merchant;
import com.AgreTrade.AgreTrade.repository.MerchantRepository;
import com.AgreTrade.AgreTrade.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MerchantServiceImpl implements MerchantService {

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Merchant registerMerchant(Merchant merchant) {
        // Check if merchant profile already exists
        if (merchantRepository.existsByEmail(merchant.getEmail())) {
            throw new RuntimeException("Merchant already exists with this email");
        }

        // Check if email is already registered as farmer
        if (farmerRepository.existsByEmail(merchant.getEmail())) {
            throw new RuntimeException("This email is already registered as a Farmer. Please use a different email or login as Farmer.");
        }

        // Encode merchant password and save
        merchant.setPassword(passwordEncoder.encode(merchant.getPassword()));
        return merchantRepository.save(merchant);
    }

    @Override
    public List<Merchant> getAllMerchants() {
        return merchantRepository.findAll();
    }

    @Override
    public Merchant getMerchantById(Long id) {
        return merchantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found with id: " + id));
    }

    @Override
    public Merchant updateMerchant(Merchant merchant) {
        if (merchant.getId() == null || !merchantRepository.existsById(merchant.getId())) {
            throw new RuntimeException("Merchant not found with id: " + merchant.getId());
        }
        return merchantRepository.save(merchant);
    }

    @Override
    public void deleteMerchant(Long id) {
        if (!merchantRepository.existsById(id)) {
            throw new RuntimeException("Merchant not found with id: " + id);
        }
        merchantRepository.deleteById(id);
    }
}
