package com.AgreTrade.AgreTrade.security;

import com.AgreTrade.AgreTrade.entity.Farmer;
import com.AgreTrade.AgreTrade.entity.Merchant;
import com.AgreTrade.AgreTrade.repository.FarmerRepository;
import com.AgreTrade.AgreTrade.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find farmer first
        Farmer farmer = farmerRepository.findByEmail(username).orElse(null);
        if (farmer != null) {
            Set<GrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_FARMER"));
            
            return org.springframework.security.core.userdetails.User.builder()
                    .username(farmer.getEmail())
                    .password(farmer.getPassword())
                    .authorities(authorities)
                    .build();
        }

        // Try to find merchant
        Merchant merchant = merchantRepository.findByEmail(username).orElse(null);
        if (merchant != null) {
            Set<GrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_MERCHANT"));
            
            return org.springframework.security.core.userdetails.User.builder()
                    .username(merchant.getEmail())
                    .password(merchant.getPassword())
                    .authorities(authorities)
                    .build();
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}

