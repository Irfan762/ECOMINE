// Enterprise ECOMINE AI-Enhanced LCA Platform
// Advanced JavaScript Implementation - Fixed Version

// Application Data Integration
const enterpriseData = {
  "enterprise": {
    "name": "ECOMINE Enterprise",
    "version": "v3.0 Enterprise",
    "tagline": "AI-Powered Sustainability Intelligence Platform",
    "problem_statement": "SIH25069",
    "compliance": ["ISO 14040", "ISO 14044", "EN 15804", "GRI Standards", "TCFD Framework"]
  },
  "performance_metrics": {
    "global_assessments": 15847,
    "co2_reduced_tonnes": 847250,
    "cost_savings_crore": 2847,
    "time_saved_percent": 92,
    "accuracy_range": "85-99%",
    "companies_served": 342,
    "countries_active": 28,
    "green_funding_unlocked": 18400
  },
  "ai_models": {
    "ensemble_methods": ["Random Forest", "Gradient Boosting", "XGBoost"],
    "neural_networks": ["Deep Neural Network", "LSTM", "Transformer"],
    "traditional_ml": ["Linear Regression", "Decision Trees", "SVR"],
    "accuracy_by_parameter": {
      "energy_consumption": {"accuracy": 96, "confidence": "High", "method": "Random Forest"},
      "co2_emissions": {"accuracy": 94, "confidence": "High", "method": "Neural Network"},
      "water_usage": {"accuracy": 89, "confidence": "Medium", "method": "Gradient Boosting"},
      "waste_generation": {"accuracy": 87, "confidence": "Medium", "method": "Ensemble"},
      "recycling_rate": {"accuracy": 92, "confidence": "High", "method": "XGBoost"}
    }
  },
  "metals_database": {
    "aluminum": {
      "primary_production": {
        "energy_range": [13.2, 16.8],
        "co2_range": [11.8, 15.2],
        "water_range": [1150, 1950],
        "cost_range": [82000, 125000],
        "uncertainty": 8.5,
        "data_sources": ["IAI Global", "openLCA", "Plant Data"]
      },
      "recycled_production": {
        "energy_range": [0.7, 1.8],
        "co2_range": [0.4, 1.4],
        "water_range": [120, 320],
        "cost_range": [38000, 72000],
        "uncertainty": 12.3,
        "data_sources": ["IAI Recycling", "ICMM", "Industry Reports"]
      },
      "circular_economy": {
        "secondary_applications": ["Automotive", "Aerospace", "Construction", "Packaging", "Electronics"],
        "tertiary_applications": ["Cement", "Road aggregates", "Pigments", "Catalysts", "Abrasives"],
        "mci_range": [75, 95],
        "avoided_impact": {"co2": 12.8, "energy": 14.5, "water": 1580}
      }
    },
    "copper": {
      "primary_production": {
        "energy_range": [18.5, 28.2],
        "co2_range": [2.6, 5.1],
        "water_range": [850, 1350],
        "cost_range": [145000, 195000],
        "uncertainty": 11.2,
        "data_sources": ["ICSG", "openLCA", "Mining Reports"]
      },
      "recycled_production": {
        "energy_range": [2.1, 4.8],
        "co2_range": [0.8, 2.2],
        "water_range": [180, 420],
        "cost_range": [68000, 98000],
        "uncertainty": 15.7,
        "data_sources": ["ICSG Recycling", "WRRC", "Industry Data"]
      },
      "circular_economy": {
        "secondary_applications": ["Electrical", "Plumbing", "Industrial", "Transportation", "Telecommunications"],
        "tertiary_applications": ["Aggregates", "Concrete", "Alloys", "Chemicals", "Art"],
        "mci_range": [68, 88],
        "avoided_impact": {"co2": 3.8, "energy": 21.2, "water": 950}
      }
    },
    "steel": {
      "primary_production": {
        "energy_range": [18.8, 24.5],
        "co2_range": [1.8, 2.6],
        "water_range": [580, 920],
        "cost_range": [55000, 85000],
        "uncertainty": 6.8,
        "data_sources": ["World Steel", "openLCA", "Plant Benchmarks"]
      },
      "recycled_production": {
        "energy_range": [4.2, 7.8],
        "co2_range": [0.6, 1.2],
        "water_range": [145, 285],
        "cost_range": [28000, 48000],
        "uncertainty": 9.4,
        "data_sources": ["World Steel EAF", "ISSB", "Recycling Data"]
      },
      "circular_economy": {
        "secondary_applications": ["Construction", "Automotive", "Machinery", "Infrastructure", "Appliances"],
        "tertiary_applications": ["Reinforcement", "Tools", "Hardware", "Components", "Materials"],
        "mci_range": [78, 92],
        "avoided_impact": {"co2": 1.4, "energy": 16.8, "water": 650}
      }
    }
  },
  "prediction_factors": {
    "energy_mix_multipliers": {"coal_heavy": 1.35, "mixed_grid": 1.0, "renewable_heavy": 0.42, "hydro": 0.28},
    "location_factors": {"china": 1.18, "india": 1.12, "europe": 0.87, "nordics": 0.64, "gcc": 1.28},
    "processing_factors": {"pyrometallurgy": 1.0, "hydrometallurgy": 0.78, "hybrid": 0.89, "advanced": 0.72},
    "ore_grade_impact": {"formula": "base_impact * (reference_grade / actual_grade)^0.6", "reference_grades": {"aluminum": 2.5, "copper": 0.8, "iron": 58.0}},
    "scale_factors": {"small_plant": 1.25, "medium_plant": 1.0, "large_plant": 0.88, "megaplant": 0.82}
  },
  "benchmark_scenarios": [
    {"name": "Primary Aluminum (Coal Grid)", "metal": "aluminum", "pathway": "primary", "energy": "coal_heavy", "co2": 15.8, "cost": 118000, "mci": 18},
    {"name": "Recycled Aluminum (Renewable)", "metal": "aluminum", "pathway": "recycled", "energy": "renewable_heavy", "co2": 0.6, "cost": 45000, "mci": 89},
    {"name": "Primary Copper (Mixed Grid)", "metal": "copper", "pathway": "primary", "energy": "mixed_grid", "co2": 3.8, "cost": 175000, "mci": 22},
    {"name": "Recycled Steel (EAF)", "metal": "steel", "pathway": "recycled", "energy": "mixed_grid", "co2": 0.8, "cost": 35000, "mci": 84}
  ]
};

// Global State Management
let applicationState = {
  currentSection: 'dashboard',
  currentResults: null,
  scenarios: [],
  charts: {},
  aiProcessing: false,
  currentVisualization: 'impact'
};

// Chart Configuration
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing ECOMINE Enterprise Platform...');
  
  initializeApplication();
  initializeCharts();
  initializeAnimations();
  initializeFormHandlers();
  animateKPIs();
  
  console.log('✅ ECOMINE Enterprise Platform initialized successfully');
});

// Core Application Initialization
function initializeApplication() {
  // Set up navigation
  setupNavigation();
  
  // Initialize real-time updates
  startRealTimeUpdates();
  
  // Setup global event listeners
  setupGlobalEventListeners();
}

// Navigation System
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const section = link.getAttribute('data-section');
      if (section) {
        showSection(section);
      }
    });
  });
}

function showSection(sectionId) {
  console.log(`🔄 Switching to section: ${sectionId}`);
  
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    
    // Update navigation
    updateNavigation(sectionId);
    
    // Update application state
    applicationState.currentSection = sectionId;
    
    // Trigger section-specific initialization
    initializeSectionSpecific(sectionId);
  }
}

function updateNavigation(activeSection) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === activeSection) {
      link.classList.add('active');
    }
  });
}

function initializeSectionSpecific(sectionId) {
  switch(sectionId) {
    case 'dashboard':
      refreshDashboard();
      break;
    case 'analytics':
      initializeAnalytics();
      break;
    case 'scenarios':
      refreshScenarios();
      break;
    default:
      break;
  }
}

// Advanced Form Handling
function initializeFormHandlers() {
  console.log('🔧 Initializing advanced form handlers...');
  
  const oreGradeSlider = document.getElementById('oreGrade');
  const oreGradeValue = document.getElementById('oreGradeValue');
  const lcaForm = document.getElementById('lcaForm');
  
  // Smart ore grade slider with real-time feedback
  if (oreGradeSlider && oreGradeValue) {
    oreGradeSlider.addEventListener('input', function() {
      const value = parseFloat(this.value);
      oreGradeValue.textContent = `${value}%`;
      
      // Provide intelligent feedback
      const feedback = getOreGradeFeedback(value);
      updateInputHint(this.closest('.form-group'), feedback);
    });
  }
  
  // Form submission with AI processing - FIXED
  if (lcaForm) {
    lcaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submitted - initiating AI processing');
      initiateAIProcessing();
    });
  }
  
  // Smart input validation and hints
  const smartInputs = document.querySelectorAll('.smart-input');
  smartInputs.forEach(input => {
    input.addEventListener('change', function() {
      validateSmartInput(this);
    });
  });
  
  // Initialize dropdowns with proper options
  initializeDropdowns();
}

function initializeDropdowns() {
  // Industry selector dropdown
  const industrySelector = document.querySelector('.industry-selector');
  if (industrySelector && industrySelector.children.length <= 4) {
    industrySelector.innerHTML = `
      <option value="all">All Industries</option>
      <option value="aluminum">Aluminum Processing</option>
      <option value="copper">Copper Mining & Refining</option>
      <option value="steel">Steel Production</option>
      <option value="automotive">Automotive Manufacturing</option>
      <option value="construction">Construction Materials</option>
    `;
  }
  
  // Comparison controls dropdown
  const comparisonControls = document.querySelector('.comparison-controls select');
  if (comparisonControls && comparisonControls.children.length <= 3) {
    comparisonControls.innerHTML = `
      <option value="all">All Metrics</option>
      <option value="environmental">Environmental Impact</option>
      <option value="economic">Economic Performance</option>
      <option value="social">Social Impact</option>
      <option value="efficiency">Resource Efficiency</option>
    `;
  }
}

function getOreGradeFeedback(grade) {
  if (grade < 1.0) {
    return "⚠️ Low grade ore - High energy intensity expected";
  } else if (grade < 2.5) {
    return "📊 Below average grade - Moderate impact increase";
  } else if (grade < 5.0) {
    return "✅ Good grade - Optimal processing efficiency";
  } else {
    return "🌟 Excellent grade - Minimal processing impact";
  }
}

function updateInputHint(formGroup, hint) {
  const hintElement = formGroup.querySelector('.input-hint');
  if (hintElement) {
    hintElement.textContent = hint;
    hintElement.style.color = hint.includes('⚠️') ? '#f59e0b' : 
                             hint.includes('✅') ? '#10b981' : 
                             hint.includes('🌟') ? '#00d9ff' : 'rgba(255, 255, 255, 0.5)';
  }
}

function validateSmartInput(input) {
  const value = input.value;
  const inputGroup = input.closest('.form-group');
  
  // Add validation visual feedback
  input.style.borderColor = value ? '#10b981' : 'rgba(255, 255, 255, 0.1)';
  
  // Trigger intelligent suggestions based on input
  if (input.id === 'metalType' && value) {
    showMetalSpecificHints(value, inputGroup);
  }
}

function showMetalSpecificHints(metalType, container) {
  const data = enterpriseData.metals_database[metalType];
  if (data) {
    const hint = `💡 ${metalType.charAt(0).toUpperCase() + metalType.slice(1)} typical energy: ${data.primary_production.energy_range[0]}-${data.primary_production.energy_range[1]} GJ/tonne`;
    const hintElement = container.querySelector('.input-hint');
    if (hintElement) {
      hintElement.textContent = hint;
      hintElement.style.color = '#00d9ff';
    }
  }
}

// Advanced AI Processing Simulation - FIXED
function initiateAIProcessing() {
  console.log('🤖 Initiating AI processing...');
  
  const formData = collectFormData();
  console.log('Collected form data:', formData);
  
  if (!validateFormData(formData)) {
    showAdvancedNotification('Please complete all required fields', 'warning');
    return;
  }
  
  // Show AI processing state
  showAIProcessingState();
  
  // Simulate advanced AI processing
  simulateAdvancedAI(formData);
}

function collectFormData() {
  const metalType = document.getElementById('metalType')?.value;
  const oreGrade = parseFloat(document.getElementById('oreGrade')?.value);
  const productionCapacity = parseFloat(document.getElementById('productionCapacity')?.value);
  const location = document.getElementById('location')?.value;
  const energyMix = document.querySelector('input[name="energyMix"]:checked')?.value;
  const processingRoute = document.querySelector('input[name="processingRoute"]:checked')?.value;
  
  return {
    metalType,
    oreGrade,
    productionCapacity,
    location,
    energyMix,
    processingRoute
  };
}

function validateFormData(data) {
  const isValid = data.metalType && data.oreGrade && data.productionCapacity && 
         data.location && data.energyMix && data.processingRoute;
  console.log('Form validation result:', isValid, data);
  return isValid;
}

function showAIProcessingState() {
  const loadingState = document.getElementById('loadingState');
  const resultsState = document.getElementById('resultsState');
  
  console.log('Showing AI processing state...');
  if (loadingState) {
    loadingState.classList.remove('hidden');
    console.log('Loading state shown');
  }
  if (resultsState) {
    resultsState.classList.add('hidden');
    console.log('Results state hidden');
  }
  
  applicationState.aiProcessing = true;
}

function simulateAdvancedAI(formData) {
  const processingSteps = [
    { text: "Initializing Ensemble Models", duration: 1000, icon: "🧠" },
    { text: "Analyzing Parameter Dependencies", duration: 1500, icon: "⚡" },
    { text: "Generating Predictions", duration: 1200, icon: "🔍" },
    { text: "Calculating Confidence Intervals", duration: 1000, icon: "📊" }
  ];
  
  let currentStep = 0;
  let totalProgress = 0;
  
  const processStep = () => {
    if (currentStep < processingSteps.length) {
      const step = processingSteps[currentStep];
      
      // Update UI for current step
      updateProcessingStep(currentStep, step);
      
      setTimeout(() => {
        currentStep++;
        totalProgress += 25;
        updateProgress(totalProgress);
        processStep();
      }, step.duration);
    } else {
      // Processing complete
      completeAIProcessing(formData);
    }
  };
  
  processStep();
}

function updateProcessingStep(index, step) {
  const steps = document.querySelectorAll('.step');
  if (steps.length > 0) {
    steps.forEach((stepEl, i) => {
      stepEl.classList.toggle('active', i === index);
    });
  }
}

function updateProgress(percentage) {
  const progressPercent = document.getElementById('progressPercent');
  if (progressPercent) {
    progressPercent.textContent = `${percentage}%`;
  }
}

function completeAIProcessing(formData) {
  console.log('✅ AI processing completed');
  
  // Calculate sophisticated results
  const results = calculateAdvancedResults(formData);
  
  // Store results
  applicationState.currentResults = results;
  
  // Show results
  displayAdvancedResults(results);
  
  // Hide loading, show results
  const loadingState = document.getElementById('loadingState');
  const resultsState = document.getElementById('resultsState');
  
  if (loadingState) loadingState.classList.add('hidden');
  if (resultsState) resultsState.classList.remove('hidden');
  
  applicationState.aiProcessing = false;
  
  showAdvancedNotification('AI analysis completed successfully! 🎉', 'success');
}

function calculateAdvancedResults(formData) {
  const { metalType, oreGrade, energyMix, processingRoute, location, productionCapacity } = formData;
  
  const metalData = enterpriseData.metals_database[metalType];
  if (!metalData) {
    console.error('No metal data found for:', metalType);
    return null;
  }
  
  const baseData = metalData.primary_production;
  const factors = enterpriseData.prediction_factors;
  
  // Apply sophisticated multipliers
  let energyModifier = 1.0;
  let co2Modifier = 1.0;
  let waterModifier = 1.0;
  
  // Ore grade impact (lower grade = higher impact)
  const refGrades = factors.ore_grade_impact.reference_grades;
  const refGrade = refGrades[metalType] || refGrades.aluminum;
  const oreImpact = Math.pow(refGrade / oreGrade, 0.6);
  energyModifier *= oreImpact;
  co2Modifier *= oreImpact;
  waterModifier *= oreImpact;
  
  // Energy mix impact
  energyModifier *= factors.energy_mix_multipliers[energyMix] || 1.0;
  co2Modifier *= factors.energy_mix_multipliers[energyMix] || 1.0;
  
  // Location factors
  const locationMod = factors.location_factors[location] || 1.0;
  co2Modifier *= locationMod;
  
  // Processing route
  const processingMod = factors.processing_factors[processingRoute] || 1.0;
  energyModifier *= processingMod;
  waterModifier *= (processingRoute === 'hydrometallurgy' ? 1.3 : 1.0);
  
  // Scale factors
  const scaleFactor = productionCapacity > 100000 ? 0.88 : 
                     productionCapacity > 50000 ? 1.0 : 1.25;
  energyModifier *= scaleFactor;
  
  // Calculate final values with uncertainty
  const energy = calculateWithUncertainty(baseData.energy_range, energyModifier, baseData.uncertainty);
  const co2 = calculateWithUncertainty(baseData.co2_range, co2Modifier, baseData.uncertainty);
  const water = calculateWithUncertainty(baseData.water_range, waterModifier, baseData.uncertainty);
  
  // Calculate circularity
  const mciRange = metalData.circular_economy.mci_range;
  const circularity = Math.round(mciRange[0] + Math.random() * (mciRange[1] - mciRange[0]));
  
  return {
    energy: energy,
    co2: co2,
    water: water,
    circularity: circularity,
    confidence: {
      energy: enterpriseData.ai_models.accuracy_by_parameter.energy_consumption,
      co2: enterpriseData.ai_models.accuracy_by_parameter.co2_emissions,
      water: enterpriseData.ai_models.accuracy_by_parameter.water_usage
    },
    metadata: {
      metalType,
      processingConditions: { oreGrade, energyMix, processingRoute, location },
      dataQuality: 'High',
      modelUsed: 'Ensemble (RF + NN + GB)'
    }
  };
}

function calculateWithUncertainty(range, modifier, uncertainty) {
  const base = (range[0] + range[1]) / 2 * modifier;
  const uncertaintyFactor = 1 + (Math.random() - 0.5) * (uncertainty / 100);
  const value = base * uncertaintyFactor;
  
  const lower = value * 0.92;
  const upper = value * 1.08;
  
  return {
    value: Math.round(value * 10) / 10,
    range: [Math.round(lower * 10) / 10, Math.round(upper * 10) / 10],
    confidence: 94
  };
}

function displayAdvancedResults(results) {
  console.log('Displaying results:', results);
  
  // Update metric displays
  updateMetricDisplay('energyValue', results.energy.value);
  updateMetricDisplay('co2Value', results.co2.value);
  updateMetricDisplay('waterValue', Math.round(results.water.value));
  updateMetricDisplay('circularityValue', results.circularity);
  
  // Update confidence intervals
  updateConfidenceInterval('energyRange', results.energy);
  updateConfidenceInterval('co2Range', results.co2);
  updateConfidenceInterval('waterRange', results.water);
  
  // Update advanced visualization
  updateAdvancedVisualization(results);
}

function updateMetricDisplay(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    // Animate the value change
    animateValue(element, 0, value, 1500);
  }
}

function updateConfidenceInterval(elementId, data) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = `${data.range[0]}-${data.range[1]} (${data.confidence}% confidence)`;
  }
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = start + (end - start) * easeOutQuart(progress);
    element.textContent = typeof end === 'number' ? 
      Math.round(current * 10) / 10 : 
      Math.round(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

// Chart Initialization and Management - FIXED
function initializeCharts() {
  console.log('📊 Initializing advanced charts...');
  
  // Delay chart initialization to ensure canvas elements are ready
  setTimeout(() => {
    initializeBenchmarkChart();
    initializeAdvancedChart();
    initializeComparisonChart();
    initializeHotspotChart();
    initializeTrendChart();
  }, 100);
}

function initializeBenchmarkChart() {
  const ctx = document.getElementById('benchmarkChart');
  if (!ctx) {
    console.log('Benchmark chart canvas not found');
    return;
  }
  
  const scenarios = enterpriseData.benchmark_scenarios;
  
  applicationState.charts.benchmark = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: scenarios.map(s => s.name),
      datasets: [{
        label: 'CO₂ Emissions (tCO₂/tonne)',
        data: scenarios.map(s => s.co2),
        backgroundColor: chartColors[0],
        borderRadius: 8,
        borderSkipped: false
      }, {
        label: 'Cost (₹/tonne)',
        data: scenarios.map(s => s.cost / 1000), // Scale for visualization
        backgroundColor: chartColors[1],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Industry Performance Benchmarks',
          color: '#ffffff',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
  
  console.log('Benchmark chart initialized');
}

function initializeAdvancedChart() {
  const ctx = document.getElementById('advancedChart');
  if (!ctx) {
    console.log('Advanced chart canvas not found');
    return;
  }
  
  // Initialize with placeholder data
  applicationState.charts.advanced = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Climate Change', 'Acidification', 'Eutrophication', 'Resource Depletion', 'Human Toxicity'],
      datasets: [{
        data: [35, 20, 15, 20, 10],
        backgroundColor: chartColors.slice(0, 5),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Environmental Impact Categories',
          color: '#ffffff',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'bottom',
          labels: { 
            color: '#ffffff',
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
  
  console.log('Advanced chart initialized');
}

function initializeComparisonChart() {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) {
    console.log('Comparison chart canvas not found');
    return;
  }
  
  applicationState.charts.comparison = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Energy', 'CO₂', 'Water', 'Cost', 'Circularity'],
      datasets: [{
        label: 'Current Scenario',
        data: [50, 60, 40, 70, 80],
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: chartColors[0],
        pointBackgroundColor: chartColors[0],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors[0]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Multi-Scenario Comparison',
          color: '#ffffff',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.1)' },
          grid: { color: 'rgba(255,255,255,0.1)' },
          pointLabels: { color: '#ffffff' },
          ticks: { 
            color: '#ffffff', 
            backdropColor: 'transparent',
            stepSize: 20
          },
          min: 0,
          max: 100
        }
      }
    }
  });
  
  console.log('Comparison chart initialized');
}

function initializeHotspotChart() {
  const ctx = document.getElementById('hotspotChart');
  if (!ctx) {
    console.log('Hotspot chart canvas not found');
    return;
  }
  
  applicationState.charts.hotspot = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Energy Production', 'Ore Processing', 'Transportation', 'Water Treatment', 'Waste Management'],
      datasets: [{
        label: 'Environmental Impact Score',
        data: [85, 72, 43, 38, 25],
        backgroundColor: [
          chartColors[1], // Highest impact
          chartColors[2],
          chartColors[3],
          chartColors[4],
          chartColors[5]  // Lowest impact
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        title: {
          display: true,
          text: 'Environmental Hotspot Analysis',
          color: '#ffffff',
          font: { size: 16, weight: 'bold' }
        },
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#ffffff' },
          grid: { display: false }
        }
      }
    }
  });
  
  console.log('Hotspot chart initialized');
}

function initializeTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) {
    console.log('Trend chart canvas not found');
    return;
  }
  
  // Generate sample trend data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const co2Data = [15.2, 14.8, 14.5, 14.1, 13.8, 13.5, 13.2, 12.9, 12.6, 12.3, 12.0, 11.8];
  const energyData = [16.5, 16.2, 15.9, 15.6, 15.3, 15.0, 14.7, 14.4, 14.1, 13.8, 13.5, 13.2];
  
  applicationState.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'CO₂ Emissions Trend',
        data: co2Data,
        borderColor: chartColors[0],
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Energy Consumption Trend',
        data: energyData,
        borderColor: chartColors[1],
        backgroundColor: 'rgba(255, 193, 133, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Temporal Impact Trends (2024)',
          color: '#ffffff',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          labels: { color: '#ffffff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
  
  console.log('Trend chart initialized');
}

function updateAdvancedVisualization(results) {
  const chart = applicationState.charts.advanced;
  if (!chart) return;
  
  // Update based on current visualization type
  switch(applicationState.currentVisualization) {
    case 'impact':
      updateImpactVisualization(chart, results);
      break;
    case 'uncertainty':
      updateUncertaintyVisualization(chart, results);
      break;
    case 'sensitivity':
      updateSensitivityVisualization(chart, results);
      break;
  }
}

function updateImpactVisualization(chart, results) {
  // Calculate dynamic weights based on results
  const dynamicWeights = [
    results.co2.value * 2, // Climate change heavily influenced by CO2
    results.energy.value * 0.5, // Acidification
    results.water.value * 0.01, // Eutrophication
    (100 - results.circularity) * 0.3, // Resource depletion (inverse of circularity)
    results.energy.value * 0.3 // Human toxicity
  ];
  
  chart.data.datasets[0].data = dynamicWeights;
  chart.update();
}

function updateUncertaintyVisualization(chart, results) {
  // Show uncertainty ranges
  const uncertaintyData = [
    results.energy.confidence,
    results.co2.confidence,
    results.water.confidence,
    85, // Default for other metrics
    90
  ];
  
  chart.data.datasets[0].data = uncertaintyData;
  chart.options.plugins.title.text = 'Model Confidence Levels (%)';
  chart.update();
}

function updateSensitivityVisualization(chart, results) {
  // Show parameter sensitivity
  const sensitivityData = [40, 35, 15, 6, 4]; // Mock sensitivity percentages
  
  chart.data.datasets[0].data = sensitivityData;
  chart.options.plugins.title.text = 'Parameter Sensitivity Analysis (%)';
  chart.update();
}

function switchVisualization(type) {
  applicationState.currentVisualization = type;
  
  // Update tab UI
  document.querySelectorAll('.viz-tab').forEach(tab => {
    tab.classList.toggle('active', tab.textContent.toLowerCase().includes(type));
  });
  
  // Update visualization if results exist
  if (applicationState.currentResults) {
    updateAdvancedVisualization(applicationState.currentResults);
  }
}

// KPI Animation System
function animateKPIs() {
  const metrics = enterpriseData.performance_metrics;
  
  animateKPI('globalAssessments', metrics.global_assessments);
  animateKPI('co2Reduced', metrics.co2_reduced_tonnes);
  animateKPI('costSavings', metrics.cost_savings_crore);
  animateKPI('companiesServed', metrics.companies_served);
}

function animateKPI(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const duration = 2000;
  const startValue = 0;
  
  // Format large numbers appropriately
  const formatValue = (value) => {
    if (elementId === 'co2Reduced') {
      return Math.round(value).toLocaleString();
    } else if (elementId === 'costSavings') {
      return `₹${Math.round(value).toLocaleString()}`;
    } else {
      return Math.round(value).toLocaleString();
    }
  };
  
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = startValue + (targetValue - startValue) * easeOutQuart(progress);
    element.textContent = formatValue(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}

// Scenario Management
function addScenario() {
  if (!applicationState.currentResults) {
    showAdvancedNotification('Please complete an LCA calculation first', 'warning');
    return;
  }
  
  const scenarioName = `Scenario ${applicationState.scenarios.length + 1}`;
  const newScenario = {
    id: Date.now(),
    name: scenarioName,
    data: { ...applicationState.currentResults },
    timestamp: new Date().toISOString()
  };
  
  applicationState.scenarios.push(newScenario);
  updateScenarioUI();
  updateComparisonChart();
  
  showAdvancedNotification(`${scenarioName} added successfully! 🎯`, 'success');
}

function resetScenarios() {
  applicationState.scenarios = [];
  updateScenarioUI();
  updateComparisonChart();
  
  showAdvancedNotification('All scenarios reset! 🔄', 'info');
}

function updateScenarioUI() {
  const scenarioList = document.getElementById('scenarioList');
  if (!scenarioList) return;
  
  if (applicationState.scenarios.length === 0) {
    scenarioList.innerHTML = `
      <div class="scenario-placeholder">
        <div class="placeholder-icon">🔬</div>
        <p>Create scenarios to compare different approaches and optimize your environmental impact</p>
      </div>
    `;
  } else {
    scenarioList.innerHTML = applicationState.scenarios.map(scenario => `
      <div class="scenario-item glass-card" style="padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="color: #00d9ff; margin: 0;">${scenario.name}</h4>
          <button onclick="removeScenario(${scenario.id})" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 1.5rem;">×</button>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: rgba(255,255,255,0.7);">
          Energy: ${scenario.data.energy.value} GJ/tonne | CO₂: ${scenario.data.co2.value} tCO₂/tonne
        </div>
      </div>
    `).join('');
  }
}

function removeScenario(scenarioId) {
  applicationState.scenarios = applicationState.scenarios.filter(s => s.id !== scenarioId);
  updateScenarioUI();
  updateComparisonChart();
  
  showAdvancedNotification('Scenario removed successfully! 🗑️', 'info');
}

function updateComparisonChart() {
  const chart = applicationState.charts.comparison;
  if (!chart) return;
  
  const datasets = [];
  const colors = chartColors;
  
  applicationState.scenarios.forEach((scenario, index) => {
    datasets.push({
      label: scenario.name,
      data: [
        scenario.data.energy.value,
        scenario.data.co2.value,
        scenario.data.water.value / 100, // Scale for visualization
        100 - scenario.data.circularity, // Invert for radar
        scenario.data.circularity
      ],
      backgroundColor: `${colors[index % colors.length]}33`,
      borderColor: colors[index % colors.length],
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: '#fff'
    });
  });
  
  // Always show at least one dataset with sample data
  if (datasets.length === 0) {
    datasets.push({
      label: 'Sample Scenario',
      data: [50, 60, 40, 30, 80],
      backgroundColor: `${colors[0]}33`,
      borderColor: colors[0],
      pointBackgroundColor: colors[0],
      pointBorderColor: '#fff'
    });
  }
  
  chart.data.datasets = datasets;
  chart.update();
}

// Advanced Report Generation
function generateReport(reportType) {
  console.log(`📄 Generating ${reportType} report...`);
  
  // Show modal
  const modal = document.getElementById('reportModal');
  const reportTypeEl = document.getElementById('reportType');
  const generationStatus = document.getElementById('generationStatus');
  
  if (modal) modal.classList.remove('hidden');
  if (reportTypeEl) reportTypeEl.textContent = `Generating ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report...`;
  
  // Simulate report generation phases
  const phases = [
    'Compiling assessment data...',
    'Generating visualizations...',
    'Applying compliance frameworks...',
    'Creating executive summary...',
    'Finalizing PDF document...'
  ];
  
  let currentPhase = 0;
  
  const updatePhase = () => {
    if (currentPhase < phases.length && generationStatus) {
      generationStatus.textContent = phases[currentPhase];
      currentPhase++;
      
      setTimeout(updatePhase, 800);
    } else {
      completeReportGeneration(reportType);
    }
  };
  
  setTimeout(updatePhase, 500);
}

function completeReportGeneration(reportType) {
  const generationStatus = document.getElementById('generationStatus');
  const reportTypeEl = document.getElementById('reportType');
  
  if (generationStatus) generationStatus.textContent = 'Report generated successfully!';
  if (reportTypeEl) reportTypeEl.textContent = 'Download Ready';
  
  setTimeout(() => {
    closeModal();
    showAdvancedNotification(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully! 📄✨`, 'success');
    
    // Simulate download
    simulateDownload(`ecomine-${reportType}-report.pdf`);
  }, 1500);
}

function simulateDownload(filename) {
  // Create a temporary download link for demonstration
  const link = document.createElement('a');
  link.href = '#';
  link.download = filename;
  link.textContent = filename;
  
  console.log(`📥 Simulated download: ${filename}`);
}

function closeModal() {
  const modal = document.getElementById('reportModal');
  if (modal) modal.classList.add('hidden');
}

// Advanced Notification System
function showAdvancedNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = 'advanced-notification glass-card';
  
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  const colors = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#00d9ff'
  };
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <span style="font-size: 1.25rem;">${icons[type] || icons.info}</span>
      <span>${message}</span>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-left: 4px solid ${colors[type] || colors.info};
    z-index: 10000;
    min-width: 300px;
    font-size: 0.875rem;
    color: #ffffff;
    animation: slideIn 0.3s ease-out forwards;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// Animation and Real-time Updates
function initializeAnimations() {
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function startRealTimeUpdates() {
  // Simulate real-time data updates
  setInterval(() => {
    if (applicationState.currentSection === 'dashboard') {
      updateRealtimeMetrics();
    }
  }, 30000); // Update every 30 seconds
}

function updateRealtimeMetrics() {
  const metrics = enterpriseData.performance_metrics;
  
  // Simulate small increments
  const newAssessments = metrics.global_assessments + Math.floor(Math.random() * 5);
  const newCO2 = metrics.co2_reduced_tonnes + Math.floor(Math.random() * 100);
  
  // Update display with animation
  const assessmentsEl = document.getElementById('globalAssessments');
  const co2El = document.getElementById('co2Reduced');
  
  if (assessmentsEl && assessmentsEl.textContent !== newAssessments.toLocaleString()) {
    animateKPI('globalAssessments', newAssessments);
  }
  
  if (co2El && co2El.textContent !== newCO2.toLocaleString()) {
    animateKPI('co2Reduced', newCO2);
  }
  
  // Update stored values
  enterpriseData.performance_metrics.global_assessments = newAssessments;
  enterpriseData.performance_metrics.co2_reduced_tonnes = newCO2;
}

function setupGlobalEventListeners() {
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          showSection('dashboard');
          break;
        case '2':
          e.preventDefault();
          showSection('calculator');
          break;
        case '3':
          e.preventDefault();
          showSection('analytics');
          break;
      }
    }
  });
  
  // Handle modal close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function refreshDashboard() {
  // Refresh charts and metrics
  if (applicationState.charts.benchmark) {
    applicationState.charts.benchmark.update();
  }
  animateKPIs();
}

function initializeAnalytics() {
  // Initialize or refresh analytics charts
  if (applicationState.charts.hotspot) {
    applicationState.charts.hotspot.update();
  }
  if (applicationState.charts.trend) {
    applicationState.charts.trend.update();
  }
}

function refreshScenarios() {
  updateScenarioUI();
  updateComparisonChart();
}

// Export global functions for HTML onclick handlers
window.showSection = showSection;
window.addScenario = addScenario;
window.resetScenarios = resetScenarios;
window.generateReport = generateReport;
window.closeModal = closeModal;
window.switchVisualization = switchVisualization;
window.removeScenario = removeScenario;

console.log('🌟 ECOMINE Enterprise AI-Enhanced LCA Platform loaded successfully!');