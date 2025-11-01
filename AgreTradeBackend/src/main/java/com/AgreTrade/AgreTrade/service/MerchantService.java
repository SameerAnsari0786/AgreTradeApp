package com.AgreTrade.AgreTrade.service;

import com.AgreTrade.AgreTrade.entity.Merchant;

import java.util.List;

public interface MerchantService {

    Merchant registerMerchant(Merchant merchant);

    List<Merchant> getAllMerchants();

    Merchant getMerchantById(Long id);

    Merchant updateMerchant(Merchant merchant);

    void deleteMerchant(Long id);
}

