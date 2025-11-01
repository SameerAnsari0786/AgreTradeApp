package com.AgreTrade.AgreTrade.service;

import com.AgreTrade.AgreTrade.entity.Farmer;

import java.util.List;

public interface FarmerService {

    Farmer registerFarmer(Farmer farmer);

    List<Farmer> getAllFarmers();

    Farmer getFarmerById(Long id);

    Farmer updateFarmer(Farmer farmer);

    void deleteFarmer(Long id);
}

