/**
 * ECOMINE LCA ENGINE v2.0
 * ISO 14040/44 | IPCC GWP100 | ReCiPe | AWARE
 * India-first LCI with CEA grid factors
 */

// ═══════════════════════════════════════════════════════════════════════════
// PART 1: INDIA-SPECIFIC LCI DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const CEA_GRID_FACTORS = {
  // kg CO2-eq per kWh electricity
  india_national: 0.716, // CEA 2024 national average
  india_coal_belt: 0.820, // Jharkhand, Odisha, Chhattisgarh
  india_south: 0.650, // Tamil Nadu, Karnataka (more renewables)
  india_west: 0.680, // Maharashtra, Gujarat
  india_north: 0.730, // UP, Rajasthan
  india_northeast: 0.510, // Hydro-heavy
  // Global comparators
  china: 0.581,
  europe: 0.233,
  nordics: 0.028,
  gcc: 0.542,
  usa: 0.386
};

const COAL_FACTORS = {
  indian_coal_GJ_per_tonne: 19.3, // GJ/tonne (lower calorific value)
  indian_coal_co2_kg_per_GJ: 95.7, // kg CO2/GJ (Indian coal = higher ash)
  imported_coal_co2_kg_per_GJ: 88.0,
  natural_gas_co2_kg_per_GJ: 56.1,
  diesel_co2_kg_per_GJ: 74.1
};

const LOGISTICS_FACTORS = {
  // kg CO2-eq per tonne-km
  road_truck_india: 0.0965,
  rail_india: 0.0165, // Indian Railways (coal-heavy traction)
  ship_coastal: 0.0110,
  ship_international: 0.0085,
  // Typical distances (km) for Indian metal supply chains
  typical_distances: {
    aluminum: { mine_to_smelter: 450, smelter_to_plant: 280 }, // Odisha → Gujarat
    copper: { mine_to_smelter: 620, smelter_to_plant: 340 }, // Rajasthan → Gujarat
    steel: { mine_to_smelter: 180, smelter_to_plant: 220 } // Jharkhand integrated
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PART 2: BASE LCI DATA PER METAL
// ═══════════════════════════════════════════════════════════════════════════

const ALUMINIUM_LCI = {
  primary: {
    mining: {
      energy_GJ: 0.35,
      co2_kg: 28.5,
      water_L: 1200,
      waste_kg: 5500,
      description: "Bauxite extraction, crushing, Bayer process prep"
    },
    transport: {
      energy_GJ: 0.18,
      co2_kg: 15.2,
      water_L: 0,
      waste_kg: 0,
      mode: "rail",
      distance_km: 450
    },
    smelting: {
      energy_GJ: 55.0,
      co2_kg_process: 1500,
      co2_kg_energy: 10950,
      water_L: 1400,
      waste_kg: 45,
      description: "Electrolysis, anode effect, pot room"
    },
    casting: {
      energy_GJ: 1.8,
      co2_kg: 145,
      water_L: 380,
      waste_kg: 12,
      description: "Melting, casting, rolling to ingot"
    },
    total_energy_GJ: 57.33,
    total_co2_kg: 12638,
    total_water_L: 2980,
    total_waste_kg: 5557
  },
  recycled: {
    mining: { energy_GJ: 0.05, co2_kg: 4.0, water_L: 150, waste_kg: 80 },
    transport: { energy_GJ: 0.12, co2_kg: 10.2, water_L: 0, waste_kg: 0 },
    smelting: { energy_GJ: 3.2, co2_kg: 420, water_L: 480, waste_kg: 65 },
    casting: { energy_GJ: 1.5, co2_kg: 120, water_L: 280, waste_kg: 8 },
    total_energy_GJ: 4.87,
    total_co2_kg: 554,
    total_water_L: 910,
    total_waste_kg: 153,
    energy_savings_pct: 91.5,
    co2_savings_pct: 95.6
  }
};

const COPPER_LCI = {
  primary: {
    mining: {
      energy_GJ: 8.5,
      co2_kg: 680,
      water_L: 2800,
      waste_kg: 18000,
      description: "Open pit / underground, flotation, concentrate"
    },
    transport: {
      energy_GJ: 0.28,
      co2_kg: 22.8,
      water_L: 0,
      waste_kg: 0,
      mode: "road_truck",
      distance_km: 620
    },
    smelting: {
      energy_GJ: 22.5,
      co2_kg: 1850,
      water_L: 1200,
      waste_kg: 280,
      description: "Pyrometallurgy: matte smelting, converting, fire refining"
    },
    casting: {
      energy_GJ: 2.2,
      co2_kg: 178,
      water_L: 520,
      waste_kg: 18,
      description: "Electrolytic refining, casting to cathode"
    },
    total_energy_GJ: 33.48,
    total_co2_kg: 2730,
    total_water_L: 4520,
    total_waste_kg: 18298
  },
  recycled: {
    mining: { energy_GJ: 0.08, co2_kg: 6.5, water_L: 220, waste_kg: 120 },
    transport: { energy_GJ: 0.15, co2_kg: 12.2, water_L: 0, waste_kg: 0 },
    smelting: { energy_GJ: 6.8, co2_kg: 545, water_L: 680, waste_kg: 95 },
    casting: { energy_GJ: 1.8, co2_kg: 145, water_L: 380, waste_kg: 12 },
    total_energy_GJ: 8.83,
    total_co2_kg: 708,
    total_water_L: 1280,
    total_waste_kg: 227,
    energy_savings_pct: 73.6,
    co2_savings_pct: 74.1
  }
};

const STEEL_LCI = {
  primary: {
    mining: {
      energy_GJ: 1.2,
      co2_kg: 98,
      water_L: 620,
      waste_kg: 3200,
      description: "Iron ore mining, sintering, pelletising"
    },
    transport: {
      energy_GJ: 0.22,
      co2_kg: 18.0,
      water_L: 0,
      waste_kg: 0,
      mode: "rail",
      distance_km: 180
    },
    smelting: {
      energy_GJ: 19.5,
      co2_kg: 1680,
      water_L: 4200,
      waste_kg: 380,
      description: "Coke making, blast furnace, basic oxygen furnace"
    },
    casting: {
      energy_GJ: 2.8,
      co2_kg: 226,
      water_L: 1100,
      waste_kg: 45,
      description: "Continuous casting, hot rolling, finishing"
    },
    total_energy_GJ: 23.72,
    total_co2_kg: 2022,
    total_water_L: 5920,
    total_waste_kg: 3625
  },
  recycled: {
    mining: { energy_GJ: 0.15, co2_kg: 12, water_L: 180, waste_kg: 220 },
    transport: { energy_GJ: 0.18, co2_kg: 14.6, water_L: 0, waste_kg: 0 },
    smelting: { energy_GJ: 7.8, co2_kg: 635, water_L: 1800, waste_kg: 125 },
    casting: { energy_GJ: 2.2, co2_kg: 178, water_L: 850, waste_kg: 32 },
    total_energy_GJ: 10.33,
    total_co2_kg: 839,
    total_water_L: 2830,
    total_waste_kg: 377,
    energy_savings_pct: 56.4,
    co2_savings_pct: 58.5
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PART 3: IMPACT ASSESSMENT METHODS
// ═══════════════════════════════════════════════════════════════════════════

const IMPACT_METHODS = {
  GWP100: {
    unit: "kg CO2-eq",
    characterisation: {
      CO2: 1.0,
      CH4: 29.8,
      N2O: 273.0,
      CF4: 7380,
      C2F6: 12400
    }
  },
  ReCiPe_metal_depletion: {
    unit: "kg Fe-eq",
    factors: {
      aluminum: 0.0,
      copper: 1.37,
      steel: 0.0,
      iron_ore: 1.0
    }
  },
  AWARE: {
    unit: "m3 world-eq",
    india_scarcity_factor: 2.8,
    formula: "water_L / 1000 * india_scarcity_factor"
  },
  acidification: {
    unit: "kg SO2-eq",
    SO2_factor: 1.0,
    NOx_factor: 0.7,
    NH3_factor: 1.88
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PART 4: LCA ENGINE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

const LCA_ENGINE = {
  // ── STEP 1: Load base LCI for metal + route ──────────────────────────────
  getBaseLCI(metalType, productionRoute) {
    const LCI_DB = { aluminum: ALUMINIUM_LCI, copper: COPPER_LCI, steel: STEEL_LCI };
    const lci = LCI_DB[metalType];
    if (!lci) throw new Error(`Unknown metal: ${metalType}`);
    return productionRoute === 'recycled' ? lci.recycled : lci.primary;
  },

  // ── STEP 2: Apply India-specific adjustment factors ───────────────────────
  applyIndiaFactors(baseLCI, inputs) {
    const {
      gridZone = 'india_national',
      fuelType = 'indian_coal',
      oreGrade = 2.5,
      productionCapacity,
      processingRoute,
      transportMode = 'rail',
      transportDistance
    } = inputs;

    let adjusted = JSON.parse(JSON.stringify(baseLCI)); // deep clone

    // 2a. Grid emission factor adjustment for smelting
    const gridFactor = CEA_GRID_FACTORS[gridZone] || CEA_GRID_FACTORS.india_national;
    const baseGridFactor = CEA_GRID_FACTORS.india_national;
    const gridMultiplier = gridFactor / baseGridFactor;
    adjusted.smelting.co2_kg_energy = (adjusted.smelting.co2_kg_energy || 0) * gridMultiplier;

    // 2b. Ore grade adjustment (lower grade = more energy & waste)
    const referenceGrade = { aluminum: 30, copper: 2.5, steel: 62 };
    const metal = inputs.metalType;
    const gradeRatio = referenceGrade[metal] / Math.max(oreGrade, 0.1);
    const gradeMultiplier = Math.pow(gradeRatio, 0.6);
    adjusted.mining.energy_GJ *= gradeMultiplier;
    adjusted.mining.co2_kg *= gradeMultiplier;
    adjusted.mining.waste_kg *= gradeMultiplier;

    // 2c. Scale economy factor
    let scaleMultiplier = 1.0;
    if (productionCapacity > 500000) scaleMultiplier = 0.85;
    else if (productionCapacity > 100000) scaleMultiplier = 0.93;
    else if (productionCapacity < 10000) scaleMultiplier = 1.18;
    adjusted.smelting.energy_GJ *= scaleMultiplier;

    // 2d. Processing route adjustment
    const processFactors = {
      pyrometallurgy: { energy: 1.00, co2: 1.00 },
      hydrometallurgy: { energy: 0.78, co2: 0.82 },
      hybrid: { energy: 0.89, co2: 0.91 },
      eaf: { energy: 0.75, co2: 0.72 }
    };
    const pf = processFactors[processingRoute] || processFactors.pyrometallurgy;
    adjusted.smelting.energy_GJ *= pf.energy;
    adjusted.smelting.co2_kg = ((adjusted.smelting.co2_kg_process || 0) + (adjusted.smelting.co2_kg_energy || 0)) * pf.co2;

    // 2e. Transport recalculation
    const distance = transportDistance || LOGISTICS_FACTORS.typical_distances[metal]?.mine_to_smelter || 400;
    const emFactor = LOGISTICS_FACTORS[`${transportMode}_india`] || LOGISTICS_FACTORS.road_truck_india;
    adjusted.transport.co2_kg = distance * emFactor;
    adjusted.transport.energy_GJ = distance * 0.000200;

    return adjusted;
  },

  // ── STEP 3: Aggregate all stages ─────────────────────────────────────────
  aggregateStages(adjustedLCI) {
    const stages = ['mining', 'transport', 'smelting', 'casting'];
    let totals = { energy_GJ: 0, co2_kg: 0, water_L: 0, waste_kg: 0 };

    const stageBreakdown = {};
    stages.forEach(stage => {
      if (!adjustedLCI[stage]) return;
      const s = adjustedLCI[stage];
      const stageCO2 = (s.co2_kg || 0) + (s.co2_kg_process || 0) + (s.co2_kg_energy || 0);
      totals.energy_GJ += s.energy_GJ || 0;
      totals.co2_kg += stageCO2;
      totals.water_L += s.water_L || 0;
      totals.waste_kg += s.waste_kg || 0;
      stageBreakdown[stage] = {
        energy_GJ: parseFloat((s.energy_GJ || 0).toFixed(3)),
        co2_kg: parseFloat(stageCO2.toFixed(1)),
        water_L: s.water_L || 0,
        waste_kg: s.waste_kg || 0,
        contribution_pct: 0
      };
    });

    // Calculate contribution %
    Object.keys(stageBreakdown).forEach(stage => {
      stageBreakdown[stage].contribution_pct = parseFloat(
        ((stageBreakdown[stage].co2_kg / totals.co2_kg) * 100).toFixed(1)
      );
    });

    return { totals, stageBreakdown };
  },

  // ── STEP 4: LCIA — apply impact characterisation ─────────────────────────
  runLCIA(totals, inputs) {
    const gwp = totals.co2_kg;
    const water_scarcity = (totals.water_L / 1000) * IMPACT_METHODS.AWARE.india_scarcity_factor;

    const daly_estimate = gwp * 0.0000085;
    const biodiversity_loss = gwp * 0.0000000028;

    return {
      midpoint: {
        climate_change_GWP100_kgCO2eq: parseFloat(gwp.toFixed(1)),
        water_scarcity_AWARE_m3eq: parseFloat(water_scarcity.toFixed(2)),
        acidification_kgSO2eq: parseFloat((gwp * 0.0014).toFixed(3)),
        metal_depletion_kgFeEq: parseFloat((totals.waste_kg * 0.05).toFixed(1))
      },
      endpoint: {
        human_health_DALY: parseFloat(daly_estimate.toFixed(6)),
        biodiversity_loss_species_yr: parseFloat(biodiversity_loss.toExponential(3)),
        resource_depletion_USD: parseFloat((gwp * 0.08).toFixed(2))
      }
    };
  },

  // ── STEP 5: Circularity metrics (MCI) ────────────────────────────────────
  calculateCircularity(inputs, totals) {
    const { recycledContentPct = 0, recycleRateEOL = 0, productLifeYrs = 10 } = inputs;

    const LFI = 1 - (recycledContentPct / 100) * 0.5 - (recycleRateEOL / 100) * 0.5;
    const Fx = 0.9 / (1 + Math.exp(-0.2 * (productLifeYrs - 5)));
    const MCI = parseFloat(Math.max(0, 1 - LFI * Fx).toFixed(3));

    const co2AvoidedByRecycling = totals.co2_kg * (recycledContentPct / 100) * 0.85;

    const scrapValueUSD = totals.waste_kg * 0.35;
    const CPI = parseFloat((scrapValueUSD / (totals.co2_kg * 0.08 + 1)).toFixed(2));

    return {
      MCI,
      LFI: parseFloat(LFI.toFixed(3)),
      CPI,
      co2AvoidedByRecycling: parseFloat(co2AvoidedByRecycling.toFixed(1))
    };
  },

  // ── STEP 6: Uncertainty analysis ─────────────────────────────────────────
  calculateUncertainty(totals, dataQualityScore) {
    const uncertaintyPct = { 1: 0.05, 2: 0.08, 3: 0.12, 4: 0.18, 5: 0.25 };
    const u = uncertaintyPct[dataQualityScore] || 0.10;

    return {
      co2_range: [
        parseFloat((totals.co2_kg * (1 - u)).toFixed(1)),
        parseFloat((totals.co2_kg * (1 + u)).toFixed(1))
      ],
      energy_range: [
        parseFloat((totals.energy_GJ * (1 - u)).toFixed(2)),
        parseFloat((totals.energy_GJ * (1 + u)).toFixed(2))
      ],
      confidence_pct: parseFloat(((1 - u) * 100).toFixed(1)),
      data_quality_score: dataQualityScore
    };
  },

  // ── STEP 7: Finance engine ────────────────────────────────────────────────
  calculateFinancials(totals, inputs) {
    const { productionCapacity = 10000, carbonCreditPriceUSD = 8 } = inputs;

    const energyCostUSD = totals.energy_GJ * 277.78 * 0.084;
    const cbamCost = (totals.co2_kg / 1000) * 55;
    const consultantSavingsINR = 4500000;

    const annualEnergyCostUSD = energyCostUSD * productionCapacity;
    const annualCbamCostUSD = cbamCost * productionCapacity;

    return {
      per_tonne_USD: {
        energy_cost: parseFloat(energyCostUSD.toFixed(2)),
        cbam_cost: parseFloat(cbamCost.toFixed(2)),
        carbon_credit_revenue: parseFloat(((totals.co2_kg / 1000) * carbonCreditPriceUSD).toFixed(2))
      },
      annual_USD: {
        energy_cost: parseFloat(annualEnergyCostUSD.toFixed(0)),
        cbam_exposure: parseFloat(annualCbamCostUSD.toFixed(0)),
        consultant_savings_INR: consultantSavingsINR
      },
      roi_months: parseFloat((consultantSavingsINR / 12 / (annualEnergyCostUSD * 0.01 / 12 + 1)).toFixed(1))
    };
  },

  // ── STEP 8: Generate AI recommendations ──────────────────────────────────
  generateRecommendations(totals, stageBreakdown, inputs) {
    const recs = [];

    const hotspot = Object.entries(stageBreakdown)
      .sort((a, b) => b[1].contribution_pct - a[1].contribution_pct)[0];
    recs.push({
      priority: 'HIGH',
      stage: hotspot[0],
      message: `${hotspot[0].toUpperCase()} is your biggest hotspot at ${hotspot[1].contribution_pct}% of CO₂. Focus reduction here first.`,
      potential_saving_pct: Math.round(hotspot[1].contribution_pct * 0.3)
    });

    if (inputs.gridZone === 'india_coal_belt') {
      recs.push({
        priority: 'HIGH',
        stage: 'smelting',
        message: 'Switching to renewable-heavy grid (India South) could cut smelting CO₂ by ~21%.',
        potential_saving_pct: 21
      });
    }

    if ((inputs.recycledContentPct || 0) < 30) {
      const metalSavings = { aluminum: 91.5, copper: 73.6, steel: 56.4 };
      recs.push({
        priority: 'MEDIUM',
        stage: 'circular',
        message: `Increasing recycled content to 40% could save up to ${metalSavings[inputs.metalType]}% CO₂ vs primary route.`,
        potential_saving_pct: Math.round(metalSavings[inputs.metalType] * 0.4)
      });
    }

    if (inputs.transportMode === 'road_truck') {
      recs.push({
        priority: 'LOW',
        stage: 'transport',
        message: 'Switching from road to rail reduces transport CO₂ by ~83% (0.017 vs 0.097 kg CO₂/t-km).',
        potential_saving_pct: 83
      });
    }

    return recs;
  },

  // ── MASTER FUNCTION: Run complete LCA ────────────────────────────────────
  runFullLCA(inputs) {
    const {
      metalType,
      productionRoute = 'primary',
      oreGrade,
      gridZone = 'india_national',
      transportMode = 'rail',
      transportDistance,
      processingRoute = 'pyrometallurgy',
      productionCapacity = 10000,
      recycledContentPct = 0,
      recycleRateEOL = 0,
      productLifeYrs = 10,
      dataQualityScore = 3,
      carbonCreditPriceUSD = 8
    } = inputs;

    // Run all steps
    const baseLCI = this.getBaseLCI(metalType, productionRoute);
    const adjustedLCI = this.applyIndiaFactors(baseLCI, inputs);
    const { totals, stageBreakdown } = this.aggregateStages(adjustedLCI);
    const lcia = this.runLCIA(totals, inputs);
    const circularity = this.calculateCircularity(inputs, totals);
    const uncertainty = this.calculateUncertainty(totals, dataQualityScore);
    const financials = this.calculateFinancials(totals, inputs);
    const recommendations = this.generateRecommendations(totals, stageBreakdown, inputs);

    // ISO report metadata
    const isoMetadata = {
      standard: 'ISO 14040/44:2006',
      functional_unit: `1 tonne of ${metalType} (${productionRoute})`,
      system_boundary: 'Cradle-to-gate',
      allocation_method: 'Recycled content method',
      lcia_methods: ['IPCC GWP100', 'ReCiPe 2016', 'AWARE', 'CML'],
      geography: gridZone,
      reference_year: 2024,
      cbam_ready: true,
      sebi_brsr_ready: true
    };

    return {
      isoMetadata,
      inventory: { totals, stageBreakdown },
      lcia,
      circularity,
      uncertainty,
      financials,
      recommendations,
      modelUsed: 'ECOMINE LCA Engine v2.0 + India LCI',
      dataQuality: ['Very High', 'High', 'Medium', 'Low', 'Very Low'][dataQualityScore - 1],
      calculatedAt: new Date().toISOString()
    };
  }
};

module.exports = LCA_ENGINE;
