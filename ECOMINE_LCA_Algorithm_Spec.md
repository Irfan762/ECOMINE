# ECOMINE LCA Algorithm — Full Implementation Specification
> **Prompt-ready document**: Give this entire file to an AI (Claude, GPT-4, Gemini) to build and integrate the LCA engine into your ECOMINE project.

---

## CONTEXT FOR THE AI

You are implementing the **core LCA (Life Cycle Assessment) calculation engine** for **ECOMINE** — an India-first, AI-powered LCA SaaS platform for metals (Aluminium, Copper, Steel). The platform is ISO 14040/44 compliant, EU CBAM-ready, and SEBI-BRSR aligned.

The existing project stack:
- **Backend**: Node.js + Express.js (file: `backend/controllers/assessmentController.js`)
- **Frontend**: React.js (file: `frontend/src/components/Calculator.jsx`)
- **Database**: MongoDB (model: `backend/models/Assessment.js`)
- **ML**: Python models (Random Forest, Gradient Boosting, Neural Network)

**Your job**: Replace/enhance the existing simple `calculateResults()` function in `assessmentController.js` with the full ISO 14040/44 multi-stage LCA engine described below, AND provide the corresponding Python ML prediction service.

---

## PART 1: LCA ENGINE OVERVIEW (ISO 14040/44)

The LCA is broken into **4 ISO phases** applied across **6 life-cycle stages**:

### Phase 1 — Goal & Scope
- **Functional Unit**: 1 kg of finished metal (Al ingot / Cu cathode / Steel sheet)
- **System Boundary**: Cradle-to-gate (mining → product use ready)
- **Allocation Rule**: Recycled content method (default); cut-off method (optional)

### Phase 2 — Life Cycle Inventory (LCI)
Collect/predict inputs and outputs for each stage.

### Phase 3 — Life Cycle Impact Assessment (LCIA)
Apply characterisation factors to inventory data.

### Phase 4 — Interpretation
Sensitivity analysis, uncertainty, hotspot identification, recommendations.

---

## PART 2: THE 6 LIFE-CYCLE STAGES

For each metal, calculate the following stages sequentially. Each stage has **energy (GJ/t), CO₂-eq (kg/t), water (L/t), waste (kg/t)** as outputs.

```
Stage 1: Mining / Ore Extraction
Stage 2: Transport (mine → smelter)
Stage 3: Smelting & Refining
Stage 4: Casting / Forming
Stage 5: Product Use Phase (optional, scope 3)
Stage 6: End-of-Life / Recycling
```

---

## PART 3: INDIA-SPECIFIC LCI DATABASE (Hard-code these values)

### 3.1 CEA Grid Emission Factors (India, 2024)
```javascript
const CEA_GRID_FACTORS = {
  // kg CO2-eq per kWh electricity
  india_national:      0.716,   // CEA 2024 national average
  india_coal_belt:     0.820,   // Jharkhand, Odisha, Chhattisgarh
  india_south:         0.650,   // Tamil Nadu, Karnataka (more renewables)
  india_west:          0.680,   // Maharashtra, Gujarat
  india_north:         0.730,   // UP, Rajasthan
  india_northeast:     0.510,   // Hydro-heavy
  // Global comparators
  china:               0.581,
  europe:              0.233,
  nordics:             0.028,
  gcc:                 0.542,
  usa:                 0.386
};
```

### 3.2 Indian Coal Emission Factor
```javascript
const COAL_FACTORS = {
  indian_coal_GJ_per_tonne: 19.3,       // GJ/tonne (lower calorific value)
  indian_coal_co2_kg_per_GJ: 95.7,      // kg CO2/GJ (Indian coal = higher ash)
  imported_coal_co2_kg_per_GJ: 88.0,
  natural_gas_co2_kg_per_GJ: 56.1,
  diesel_co2_kg_per_GJ: 74.1
};
```

### 3.3 Indian Logistics Emission Factors
```javascript
const LOGISTICS_FACTORS = {
  // kg CO2-eq per tonne-km
  road_truck_india: 0.0965,
  rail_india:       0.0165,    // Indian Railways (coal-heavy traction)
  ship_coastal:     0.0110,
  ship_international: 0.0085,
  // Typical distances (km) for Indian metal supply chains
  typical_distances: {
    aluminum: { mine_to_smelter: 450, smelter_to_plant: 280 },  // Odisha → Gujarat
    copper:   { mine_to_smelter: 620, smelter_to_plant: 340 },  // Rajasthan → Gujarat
    steel:    { mine_to_smelter: 180, smelter_to_plant: 220 }   // Jharkhand integrated
  }
};
```

---

## PART 4: BASE LCI DATA PER METAL (per 1 tonne of output)

### 4.1 ALUMINIUM

```javascript
const ALUMINIUM_LCI = {
  primary: {
    // Stage 1: Bauxite Mining
    mining: {
      energy_GJ: 0.35,
      co2_kg: 28.5,
      water_L: 1200,
      waste_kg: 5500,   // red mud = 1.5–2.5 t per t Al
      description: "Bauxite extraction, crushing, Bayer process prep"
    },
    // Stage 2: Transport
    transport: {
      energy_GJ: 0.18,
      co2_kg: 15.2,
      water_L: 0,
      waste_kg: 0,
      mode: "rail",
      distance_km: 450
    },
    // Stage 3: Smelting (Hall-Héroult electrolysis)
    smelting: {
      energy_GJ: 55.0,        // ~15.3 MWh/t electricity (India avg)
      co2_kg_process: 1500,   // direct: anode consumption (CF4, C2F6)
      co2_kg_energy: 10950,   // indirect: electricity × CEA factor
      water_L: 1400,
      waste_kg: 45,
      description: "Electrolysis, anode effect, pot room"
    },
    // Stage 4: Casting
    casting: {
      energy_GJ: 1.8,
      co2_kg: 145,
      water_L: 380,
      waste_kg: 12,
      description: "Melting, casting, rolling to ingot"
    },
    // Total primary
    total_energy_GJ: 57.33,
    total_co2_kg: 12638,
    total_water_L: 2980,
    total_waste_kg: 5557
  },
  recycled: {
    // Secondary aluminium (post-consumer scrap)
    mining:    { energy_GJ: 0.05, co2_kg: 4.0,   water_L: 150,  waste_kg: 80  },
    transport: { energy_GJ: 0.12, co2_kg: 10.2,  water_L: 0,    waste_kg: 0   },
    smelting:  { energy_GJ: 3.2,  co2_kg: 420,   water_L: 480,  waste_kg: 65  },
    casting:   { energy_GJ: 1.5,  co2_kg: 120,   water_L: 280,  waste_kg: 8   },
    total_energy_GJ: 4.87,
    total_co2_kg: 554,
    total_water_L: 910,
    total_waste_kg: 153,
    energy_savings_pct: 91.5,   // vs primary
    co2_savings_pct: 95.6
  }
};
```

### 4.2 COPPER

```javascript
const COPPER_LCI = {
  primary: {
    mining: {
      energy_GJ: 8.5,
      co2_kg: 680,
      water_L: 2800,
      waste_kg: 18000,   // ~200 t rock per t Cu
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
    smelting: {   // Flash smelting / reverberatory
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
    mining:    { energy_GJ: 0.08, co2_kg: 6.5,  water_L: 220, waste_kg: 120 },
    transport: { energy_GJ: 0.15, co2_kg: 12.2, water_L: 0,   waste_kg: 0   },
    smelting:  { energy_GJ: 6.8,  co2_kg: 545,  water_L: 680, waste_kg: 95  },
    casting:   { energy_GJ: 1.8,  co2_kg: 145,  water_L: 380, waste_kg: 12  },
    total_energy_GJ: 8.83,
    total_co2_kg: 708,
    total_water_L: 1280,
    total_waste_kg: 227,
    energy_savings_pct: 73.6,
    co2_savings_pct: 74.1
  }
};
```

### 4.3 STEEL

```javascript
const STEEL_LCI = {
  primary: {   // BF-BOF route (Blast Furnace - Basic Oxygen Furnace)
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
    smelting: {   // Blast furnace + BOF
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
  recycled: {   // EAF route (Electric Arc Furnace)
    mining:    { energy_GJ: 0.15, co2_kg: 12,  water_L: 180, waste_kg: 220 },
    transport: { energy_GJ: 0.18, co2_kg: 14.6, water_L: 0,  waste_kg: 0   },
    smelting:  { energy_GJ: 7.8,  co2_kg: 635, water_L: 1800, waste_kg: 125 },
    casting:   { energy_GJ: 2.2,  co2_kg: 178, water_L: 850, waste_kg: 32  },
    total_energy_GJ: 10.33,
    total_co2_kg: 839,
    total_water_L: 2830,
    total_waste_kg: 377,
    energy_savings_pct: 56.4,
    co2_savings_pct: 58.5
  }
};
```

---

## PART 5: IMPACT ASSESSMENT METHODS (LCIA)

### 5.1 Impact Categories & Characterisation Factors

```javascript
const IMPACT_METHODS = {
  // IPCC GWP100 (climate change)
  GWP100: {
    unit: "kg CO2-eq",
    characterisation: {
      CO2: 1.0,
      CH4: 29.8,    // IPCC AR6
      N2O: 273.0,   // IPCC AR6
      CF4: 7380,    // aluminium smelting PFCs
      C2F6: 12400
    }
  },
  // ReCiPe 2016 (metal depletion)
  ReCiPe_metal_depletion: {
    unit: "kg Fe-eq",
    factors: {
      aluminum: 0.0, copper: 1.37, steel: 0.0, iron_ore: 1.0
    }
  },
  // AWARE (water scarcity)
  AWARE: {
    unit: "m3 world-eq",
    india_scarcity_factor: 2.8,   // India water stress multiplier
    formula: "water_L / 1000 * india_scarcity_factor"
  },
  // CML acidification
  acidification: {
    unit: "kg SO2-eq",
    SO2_factor: 1.0,
    NOx_factor: 0.7,
    NH3_factor: 1.88
  }
};
```

### 5.2 LCIA Calculation Function

```javascript
function calculateLCIA(inventory) {
  return {
    climate_change_GWP100: inventory.co2_kg * 1.0 + (inventory.ch4_kg || 0) * 29.8,
    
    water_scarcity_AWARE: (inventory.water_L / 1000) * IMPACT_METHODS.AWARE.india_scarcity_factor,
    
    metal_depletion_ReCiPe: inventory.copper_kg_used ? inventory.copper_kg_used * 1.37 : 0,
    
    acidification_CML: (inventory.so2_kg || 0) * 1.0 + (inventory.nox_kg || 0) * 0.7,
    
    // Normalised single score (for dashboard gauge)
    normalised_score: calculateNormalisedScore(inventory)
  };
}

function calculateNormalisedScore(inventory) {
  // Normalisation references (world average per person per year)
  const NORM_FACTORS = { GWP100: 7700, water: 1500, metal: 44 };
  const gwp_norm = (inventory.co2_kg / NORM_FACTORS.GWP100) * 100;
  const water_norm = ((inventory.water_L / 1000) / NORM_FACTORS.water) * 100;
  // Weighted average
  return (gwp_norm * 0.5 + water_norm * 0.3).toFixed(2);
}
```

---

## PART 6: FULL LCA CALCULATION ENGINE (Node.js)

Replace `calculateResults()` in `backend/controllers/assessmentController.js` with this:

```javascript
/**
 * ECOMINE LCA ENGINE v2.0
 * ISO 14040/44 | IPCC GWP100 | ReCiPe | AWARE
 * India-first LCI with CEA grid factors
 */

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
      oreGrade = 2.5,           // default % grade
      productionCapacity,       // tonnes/year
      processingRoute,
      transportMode = 'rail',
      transportDistance        // optional override km
    } = inputs;

    let adjusted = JSON.parse(JSON.stringify(baseLCI)); // deep clone

    // 2a. Grid emission factor adjustment for smelting
    const gridFactor = CEA_GRID_FACTORS[gridZone] || CEA_GRID_FACTORS.india_national;
    const baseGridFactor = CEA_GRID_FACTORS.india_national;
    const gridMultiplier = gridFactor / baseGridFactor;
    adjusted.smelting.co2_kg_energy = (adjusted.smelting.co2_kg_energy || 0) * gridMultiplier;

    // 2b. Ore grade adjustment (lower grade = more energy & waste)
    // Using power-law: impact ∝ (reference_grade / actual_grade)^0.6
    const referenceGrade = { aluminum: 30, copper: 2.5, steel: 62 }; // % Fe/Al/Cu
    const metal = inputs.metalType;
    const gradeRatio = referenceGrade[metal] / Math.max(oreGrade, 0.1);
    const gradeMultiplier = Math.pow(gradeRatio, 0.6);
    adjusted.mining.energy_GJ *= gradeMultiplier;
    adjusted.mining.co2_kg   *= gradeMultiplier;
    adjusted.mining.waste_kg *= gradeMultiplier;

    // 2c. Scale economy factor
    let scaleMultiplier = 1.0;
    if (productionCapacity > 500000) scaleMultiplier = 0.85;
    else if (productionCapacity > 100000) scaleMultiplier = 0.93;
    else if (productionCapacity < 10000)  scaleMultiplier = 1.18;
    adjusted.smelting.energy_GJ *= scaleMultiplier;

    // 2d. Processing route adjustment
    const processFactors = {
      pyrometallurgy: { energy: 1.00, co2: 1.00 },
      hydrometallurgy: { energy: 0.78, co2: 0.82 },
      hybrid:          { energy: 0.89, co2: 0.91 },
      eaf:             { energy: 0.75, co2: 0.72 }  // Electric Arc Furnace for steel
    };
    const pf = processFactors[processingRoute] || processFactors.pyrometallurgy;
    adjusted.smelting.energy_GJ *= pf.energy;
    adjusted.smelting.co2_kg    = ((adjusted.smelting.co2_kg_process || 0) + (adjusted.smelting.co2_kg_energy || 0)) * pf.co2;

    // 2e. Transport recalculation with actual mode + distance
    const distance = transportDistance || LOGISTICS_FACTORS.typical_distances[metal]?.mine_to_smelter || 400;
    const emFactor = LOGISTICS_FACTORS[`${transportMode}_india`] || LOGISTICS_FACTORS.road_truck_india;
    adjusted.transport.co2_kg = distance * emFactor;    // kg CO2 per tonne of metal
    adjusted.transport.energy_GJ = distance * 0.000200; // ~0.2 MJ per tonne-km for rail

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
      totals.co2_kg    += stageCO2;
      totals.water_L   += s.water_L || 0;
      totals.waste_kg  += s.waste_kg || 0;
      stageBreakdown[stage] = {
        energy_GJ: parseFloat((s.energy_GJ || 0).toFixed(3)),
        co2_kg: parseFloat(stageCO2.toFixed(1)),
        water_L: s.water_L || 0,
        waste_kg: s.waste_kg || 0,
        contribution_pct: 0   // filled in next step
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
    const gwp = totals.co2_kg;  // already in CO2-eq
    const water_scarcity = (totals.water_L / 1000) * IMPACT_METHODS.AWARE.india_scarcity_factor;
    
    // Endpoint indicators
    const daly_estimate = gwp * 0.0000085; // disability-adjusted life years (midpoint→endpoint)
    const biodiversity_loss = gwp * 0.0000000028; // species·yr

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

    // Material Circularity Indicator: MCI = 1 - LFI × F(x)
    // LFI = Linear Flow Index = fraction of material going to waste/landfill
    const LFI = 1 - (recycledContentPct / 100) * 0.5 - (recycleRateEOL / 100) * 0.5;
    // Utility factor F(x) accounts for product lifetime
    const Fx = 0.9 / (1 + Math.exp(-0.2 * (productLifeYrs - 5)));
    const MCI = parseFloat(Math.max(0, 1 - LFI * Fx).toFixed(3));

    // CO2 savings from recycled content
    const co2AvoidedByRecycling = totals.co2_kg * (recycledContentPct / 100) * 0.85;

    // Circular Profitability Index (CPI)
    const scrapValueUSD = totals.waste_kg * 0.35;   // rough scrap value $/kg
    const CPI = parseFloat((scrapValueUSD / (totals.co2_kg * 0.08 + 1)).toFixed(2));

    return { MCI, LFI: parseFloat(LFI.toFixed(3)), CPI, co2AvoidedByRecycling: parseFloat(co2AvoidedByRecycling.toFixed(1)) };
  },

  // ── STEP 6: Uncertainty analysis ─────────────────────────────────────────
  calculateUncertainty(totals, dataQualityScore) {
    // DQS: 1 (best) to 5 (worst) — maps to uncertainty %
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
    
    // Indian electricity rate: ₹7/kWh industrial = ~$0.084
    const energyCostUSD = totals.energy_GJ * 277.78 * 0.084;  // GJ → kWh → USD
    
    // Carbon cost (EU CBAM price ~€50/t CO2 = ~$55)
    const cbamCost = (totals.co2_kg / 1000) * 55;
    
    // SEBI-BRSR consultant savings: ₹30-60L / year = ~$36k-$72k
    const consultantSavingsINR = 4500000;   // ₹45L midpoint
    
    // Annual totals
    const annualEnergyCostUSD = energyCostUSD * productionCapacity;
    const annualCbamCostUSD   = cbamCost * productionCapacity;
    
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
    
    // Hotspot: find highest contributing stage
    const hotspot = Object.entries(stageBreakdown)
      .sort((a, b) => b[1].contribution_pct - a[1].contribution_pct)[0];
    recs.push({
      priority: 'HIGH',
      stage: hotspot[0],
      message: `${hotspot[0].toUpperCase()} is your biggest hotspot at ${hotspot[1].contribution_pct}% of CO₂. Focus reduction here first.`,
      potential_saving_pct: Math.round(hotspot[1].contribution_pct * 0.3)
    });

    // Grid recommendation
    if (inputs.gridZone === 'india_coal_belt') {
      recs.push({
        priority: 'HIGH',
        stage: 'smelting',
        message: 'Switching to renewable-heavy grid (India South) could cut smelting CO₂ by ~21%.',
        potential_saving_pct: 21
      });
    }

    // Recycling recommendation
    if ((inputs.recycledContentPct || 0) < 30) {
      const metalSavings = { aluminum: 91.5, copper: 73.6, steel: 56.4 };
      recs.push({
        priority: 'MEDIUM',
        stage: 'circular',
        message: `Increasing recycled content to 40% could save up to ${metalSavings[inputs.metalType]}% CO₂ vs primary route.`,
        potential_saving_pct: Math.round(metalSavings[inputs.metalType] * 0.4)
      });
    }

    // Transport recommendation
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
      metalType,                    // 'aluminum' | 'copper' | 'steel'
      productionRoute = 'primary',  // 'primary' | 'recycled'
      oreGrade,
      gridZone = 'india_national',
      transportMode = 'rail',
      transportDistance,
      processingRoute = 'pyrometallurgy',
      productionCapacity = 10000,
      recycledContentPct = 0,
      recycleRateEOL = 0,
      productLifeYrs = 10,
      dataQualityScore = 3,         // 1-5
      carbonCreditPriceUSD = 8
    } = inputs;

    // Run all steps
    const baseLCI          = this.getBaseLCI(metalType, productionRoute);
    const adjustedLCI      = this.applyIndiaFactors(baseLCI, inputs);
    const { totals, stageBreakdown } = this.aggregateStages(adjustedLCI);
    const lcia             = this.runLCIA(totals, inputs);
    const circularity      = this.calculateCircularity(inputs, totals);
    const uncertainty      = this.calculateUncertainty(totals, dataQualityScore);
    const financials       = this.calculateFinancials(totals, inputs);
    const recommendations  = this.generateRecommendations(totals, stageBreakdown, inputs);

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
```

---

## PART 7: INTEGRATION INTO EXISTING assessmentController.js

```javascript
// In assessmentController.js — replace calculateResults() with:
const LCA_ENGINE = require('../utils/lcaEngine');  // save Part 6 as this file

exports.createAssessment = async (req, res) => {
  try {
    // Map frontend form fields to LCA engine inputs
    const lcaInputs = {
      metalType: req.body.metalType,                          // 'aluminum'|'copper'|'steel'
      productionRoute: req.body.productionRoute || 'primary',
      oreGrade: parseFloat(req.body.oreGrade),
      gridZone: mapLocationToGrid(req.body.location),         // see mapper below
      transportMode: req.body.transportMode || 'rail',
      processingRoute: req.body.processingRoute,
      productionCapacity: parseInt(req.body.productionCapacity),
      recycledContentPct: parseFloat(req.body.recycledContentPct || 0),
      recycleRateEOL: parseFloat(req.body.recycleRateEOL || 0),
      dataQualityScore: req.body.dataQualityScore || 3
    };

    const lcaResult = LCA_ENGINE.runFullLCA(lcaInputs);

    const assessment = new Assessment({
      userId: req.userId,
      ...req.body,
      results: lcaResult,
      modelUsed: lcaResult.modelUsed,
      dataQuality: lcaResult.dataQuality
    });

    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Location to grid zone mapper
function mapLocationToGrid(location) {
  const map = {
    'india': 'india_national',
    'india_jharkhand': 'india_coal_belt',
    'india_odisha': 'india_coal_belt',
    'india_karnataka': 'india_south',
    'india_tamilnadu': 'india_south',
    'india_gujarat': 'india_west',
    'india_maharashtra': 'india_west',
    'china': 'china',
    'europe': 'europe',
    'nordics': 'nordics',
    'gcc': 'gcc'
  };
  return map[location] || 'india_national';
}
```

---

## PART 8: PYTHON ML PREDICTION SERVICE

Save as `backend/ml/lca_predictor.py`. This fills missing plant data using trained models.

```python
"""
ECOMINE ML Prediction Service
Fills missing inventory data using Random Forest + Gradient Boosting ensemble.
Call this when user provides < 7 fields; AI predicts the rest.
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
import json, os

class ECOMINEPredictor:

    # ── India-specific reference data for model training ─────────────────
    TRAINING_DATA = [
        # metal, route, grid_factor, ore_grade, capacity_t, proc_route, energy_GJ, co2_kg, water_L
        ['aluminum', 'primary',  0.716, 30, 200000, 'pyrometallurgy', 57.3, 12638, 2980],
        ['aluminum', 'primary',  0.820, 25, 50000,  'pyrometallurgy', 62.1, 13850, 3200],
        ['aluminum', 'primary',  0.650, 35, 500000, 'pyrometallurgy', 53.8, 11200, 2750],
        ['aluminum', 'recycled', 0.716, 30, 100000, 'pyrometallurgy', 4.87,  554,   910],
        ['aluminum', 'recycled', 0.820, 30, 30000,  'pyrometallurgy', 5.50,  625,  1050],
        ['copper',   'primary',  0.716, 2.5, 80000, 'pyrometallurgy', 33.5, 2730,  4520],
        ['copper',   'primary',  0.716, 1.5, 40000, 'pyrometallurgy', 38.2, 3120,  5100],
        ['copper',   'recycled', 0.716, 2.5, 60000, 'pyrometallurgy', 8.83,  708,  1280],
        ['steel',    'primary',  0.716, 62, 1000000,'pyrometallurgy', 23.7, 2022,  5920],
        ['steel',    'primary',  0.716, 58, 500000, 'pyrometallurgy', 25.1, 2140,  6300],
        ['steel',    'recycled', 0.716, 62, 300000, 'eaf',            10.3,  839,  2830],
        ['steel',    'recycled', 0.820, 62, 100000, 'eaf',            11.8,  960,  3100],
    ]

    def __init__(self):
        self.le_metal    = LabelEncoder()
        self.le_route    = LabelEncoder()
        self.le_proc     = LabelEncoder()
        self.scaler      = StandardScaler()
        self.models      = {}
        self._train()

    def _encode_features(self, data):
        metals    = [d[0] for d in data]
        routes    = [d[1] for d in data]
        procs     = [d[5] for d in data]
        grid_f    = [d[2] for d in data]
        ore_g     = [d[3] for d in data]
        capacity  = [d[4] for d in data]

        m_enc = self.le_metal.fit_transform(metals)
        r_enc = self.le_route.fit_transform(routes)
        p_enc = self.le_proc.fit_transform(procs)

        X = np.column_stack([m_enc, r_enc, grid_f, ore_g, capacity, p_enc])
        return X

    def _train(self):
        data = self.TRAINING_DATA
        X = self._encode_features(data)
        X = self.scaler.fit_transform(X)

        targets = {
            'energy_GJ': [d[6] for d in data],
            'co2_kg':    [d[7] for d in data],
            'water_L':   [d[8] for d in data]
        }

        for target, y in targets.items():
            rf = RandomForestRegressor(n_estimators=100, random_state=42)
            gb = GradientBoostingRegressor(n_estimators=100, random_state=42)
            rf.fit(X, y)
            gb.fit(X, y)
            self.models[target] = (rf, gb)

    def predict(self, metal_type, production_route, grid_factor,
                ore_grade, capacity, processing_route):
        """
        Predict energy, CO2, water for given inputs.
        Returns dict with predictions + confidence intervals.
        """
        try:
            m_enc = self.le_metal.transform([metal_type])[0]
            r_enc = self.le_route.transform([production_route])[0]
            p_enc = self.le_proc.transform([processing_route])[0]
        except ValueError:
            # Unknown category — use defaults
            m_enc, r_enc, p_enc = 0, 0, 0

        X = self.scaler.transform([[m_enc, r_enc, grid_factor, ore_grade, capacity, p_enc]])

        results = {}
        for target, (rf, gb) in self.models.items():
            rf_pred = rf.predict(X)[0]
            gb_pred = gb.predict(X)[0]
            ensemble = (rf_pred * 0.5 + gb_pred * 0.5)

            # Confidence interval from RF trees
            tree_preds = [tree.predict(X)[0] for tree in rf.estimators_]
            std = np.std(tree_preds)
            ci_low  = max(0, ensemble - 1.96 * std)
            ci_high = ensemble + 1.96 * std
            confidence = max(70, min(98, 100 - (std / ensemble * 100)))

            results[target] = {
                'predicted': round(ensemble, 2),
                'ci_low':    round(ci_low, 2),
                'ci_high':   round(ci_high, 2),
                'confidence_pct': round(confidence, 1)
            }

        return results


# ── Express-compatible wrapper (called by Node via child_process) ──────────
if __name__ == '__main__':
    import sys
    predictor = ECOMINEPredictor()
    inputs = json.loads(sys.argv[1])
    result = predictor.predict(
        inputs['metalType'],
        inputs['productionRoute'],
        inputs.get('gridFactor', 0.716),
        inputs.get('oreGrade', 2.5),
        inputs.get('productionCapacity', 100000),
        inputs.get('processingRoute', 'pyrometallurgy')
    )
    print(json.dumps(result))
```

---

## PART 9: WHAT-IF SCENARIO ENGINE

Add to `backend/controllers/scenarioController.js`:

```javascript
const LCA_ENGINE = require('../utils/lcaEngine');

exports.runWhatIf = (req, res) => {
  const { baseInputs, scenarios } = req.body;
  // scenarios = array of { name, overrides: { gridZone, recycledContentPct, ... } }

  const results = scenarios.map(scenario => {
    const mergedInputs = { ...baseInputs, ...scenario.overrides };
    const lcaResult = LCA_ENGINE.runFullLCA(mergedInputs);
    return {
      scenario_name: scenario.name,
      co2_kg: lcaResult.inventory.totals.co2_kg,
      energy_GJ: lcaResult.inventory.totals.energy_GJ,
      water_L: lcaResult.inventory.totals.water_L,
      MCI: lcaResult.circularity.MCI,
      cbam_cost_USD: lcaResult.financials.per_tonne_USD.cbam_cost,
      full_result: lcaResult
    };
  });

  // Identify best scenario
  const best = results.reduce((a, b) => a.co2_kg < b.co2_kg ? a : b);

  res.json({
    scenarios: results,
    best_scenario: best.scenario_name,
    co2_reduction_pct: parseFloat(
      ((results[0].co2_kg - best.co2_kg) / results[0].co2_kg * 100).toFixed(1)
    )
  });
};
```

---

## PART 10: API ENDPOINT SCHEMA

```
POST /api/assessments
Body: {
  metalType: "aluminum",          // required
  productionRoute: "primary",     // required
  oreGrade: 28,                   // % (Al2O3 for Al, Cu% for copper, Fe% for steel)
  gridZone: "india_national",     // CEA grid zone
  transportMode: "rail",          // rail | road_truck | ship_coastal
  transportDistance: 450,         // km (optional — uses Indian defaults if omitted)
  processingRoute: "pyrometallurgy",
  productionCapacity: 200000,     // tonnes/year
  recycledContentPct: 20,         // 0–100
  recycleRateEOL: 65,             // 0–100
  productLifeYrs: 15,
  dataQualityScore: 2,            // 1(best)–5(worst)
  carbonCreditPriceUSD: 8
}

Response: {
  isoMetadata: { ... },
  inventory: {
    totals: { energy_GJ, co2_kg, water_L, waste_kg },
    stageBreakdown: { mining, transport, smelting, casting }
  },
  lcia: {
    midpoint: { climate_change_GWP100_kgCO2eq, water_scarcity_AWARE_m3eq, ... },
    endpoint: { human_health_DALY, biodiversity_loss_species_yr, ... }
  },
  circularity: { MCI, LFI, CPI, co2AvoidedByRecycling },
  uncertainty: { co2_range, energy_range, confidence_pct },
  financials: { per_tonne_USD, annual_USD, roi_months },
  recommendations: [ { priority, stage, message, potential_saving_pct } ]
}

POST /api/scenarios/whatif
Body: {
  baseInputs: { ...same as above... },
  scenarios: [
    { name: "Baseline", overrides: {} },
    { name: "Solar Grid", overrides: { gridZone: "india_south" } },
    { name: "40% Recycled", overrides: { recycledContentPct: 40 } },
    { name: "Rail Transport", overrides: { transportMode: "rail" } }
  ]
}
```

---

## PART 11: CBAM & SEBI-BRSR REPORT FIELDS

When generating PDF reports, include these mandatory fields:

```javascript
const CBAM_REPORT_FIELDS = {
  // EU CBAM Annex III mandatory fields
  installation_id: "IND-METAL-XXXX",
  reporting_period: "2024",
  cn_code: { aluminum: "7601", copper: "7403", steel: "7208" },
  direct_emissions_tCO2eq: totals.co2_kg / 1000,
  indirect_emissions_tCO2eq: (lcia.midpoint.climate_change_GWP100_kgCO2eq - totals.co2_kg) / 1000,
  embedded_emissions_tCO2eq: lcia.midpoint.climate_change_GWP100_kgCO2eq / 1000,
  carbon_price_paid_EUR: 0,   // India currently no carbon price
  methodology: "ISO 14064-1 + ECOMINE India LCI v2.0"
};

const SEBI_BRSR_FIELDS = {
  // SEBI BRSR Core KPIs
  scope1_tCO2eq: totals.co2_kg / 1000 * 0.7,    // direct process emissions
  scope2_tCO2eq: totals.co2_kg / 1000 * 0.3,    // electricity indirect
  scope3_tCO2eq: null,                            // out of scope (cradle-to-gate)
  energy_intensity_GJ_per_tonne: totals.energy_GJ,
  water_intensity_L_per_tonne: totals.water_L,
  waste_intensity_kg_per_tonne: totals.waste_kg,
  recycled_material_pct: inputs.recycledContentPct,
  MCI_score: circularity.MCI
};
```

---

## INTEGRATION CHECKLIST FOR AI

When you implement this, please:

- [ ] Save the LCA engine as `backend/utils/lcaEngine.js`
- [ ] Save the constants (CEA_GRID_FACTORS, LOGISTICS_FACTORS, etc.) as `backend/utils/lcaConstants.js` and import them
- [ ] Save Python predictor as `backend/ml/lca_predictor.py`
- [ ] Update `backend/controllers/assessmentController.js` to call `LCA_ENGINE.runFullLCA()`
- [ ] Add `POST /api/scenarios/whatif` route to `backend/routes/scenarioRoutes.js`
- [ ] Update `backend/models/Assessment.js` schema to store the new full result structure
- [ ] Update `frontend/src/components/Calculator.jsx` to send all new fields
- [ ] Update `frontend/src/components/Dashboard.jsx` to display stageBreakdown, LCIA, circularity, financials, recommendations
- [ ] Test with: Aluminium primary, India coal belt, oreGrade=28, capacity=200000, pyrometallurgy

---

## VALIDATION BENCHMARKS

Your results should be within ±10% of these reference values:

| Metal | Route | Expected CO₂ (kg/t) | Expected Energy (GJ/t) |
|-------|-------|---------------------|------------------------|
| Aluminium | Primary, India coal | 13,000–14,500 | 55–62 |
| Aluminium | Recycled | 500–650 | 4.5–5.5 |
| Copper | Primary, India | 2,500–3,200 | 30–38 |
| Copper | Recycled | 650–800 | 8–10 |
| Steel | Primary BF-BOF | 1,800–2,200 | 21–26 |
| Steel | Recycled EAF | 750–950 | 9–12 |

*Sources: IAI (2023), ICSG (2023), worldsteel (2023), CEA Annual Report 2024*

---

*Document version: ECOMINE LCA Algorithm Spec v2.0 | April 2026*
*Standards: ISO 14040/44 | IPCC AR6 GWP100 | ReCiPe 2016 | AWARE | CEA 2024*
