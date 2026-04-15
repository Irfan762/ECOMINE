# ECOMINE - MERN Stack Backend & Frontend

## Project Structure

```
ecomine-mern/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   ├── Scenario.js
│   │   └── Report.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── scenarioController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── scenarioRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx & Dashboard.css
    │   │   ├── Calculator.jsx & Calculator.css
    │   │   ├── Analytics.jsx & Analytics.css
    │   │   ├── Scenarios.jsx & Scenarios.css
    │   │   └── Reports.jsx & Reports.css
    │   ├── pages/
    │   │   ├── LoginPage.jsx & LoginPage.css
    │   │   └── AppPage.jsx & AppPage.css
    │   ├── services/
    │   │   ├── api.js
    │   │   └── assessmentService.js
    │   ├── context/
    │   │   └── AppContext.js
    │   ├── App.jsx & App.css
    │   ├── index.js
    │   └── index.html
    ├── package.json
    └── .env
```

## Installation & Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Environment Variables (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecomine
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Assessments
- `POST /api/assessments` - Create LCA assessment
- `GET /api/assessments` - Get user's assessments
- `GET /api/assessments/:id` - Get specific assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Scenarios
- `POST /api/scenarios` - Create scenario
- `GET /api/scenarios` - Get user's scenarios
- `GET /api/scenarios/:id` - Get specific scenario
- `PUT /api/scenarios/:id` - Update scenario
- `DELETE /api/scenarios/:id` - Delete scenario
- `POST /api/scenarios/compare` - Compare multiple scenarios

### Reports
- `POST /api/reports` - Generate report (ISO/CBAM/BRSR/Circularity)
- `GET /api/reports` - Get user's reports
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report

## Features

### Dashboard
- Real-time KPI metrics (Energy, CO₂, Water, Circularity)
- Confidence intervals and data quality assessment
- Model information display
- Compliance status overview

### LCA Calculator
- Smart metal selection (Aluminum, Copper, Steel)
- Ore grade configuration (0.1 - 10%)
- Production capacity input
- Geographic location selector
- Energy mix options (Coal Heavy, Mixed, Renewable)
- Processing route selection (Pyrometallurgy, Hydrometallurgy, Hybrid)
- AI ensemble processing with visual feedback

### Analytics
- Energy hotspot analysis
- Confidence level breakdown by metric
- Trend comparison (vs. Global, India, Best-in-class)
- Compliance readiness status

### Scenarios
- Build multiple what-if scenarios
- Parameter variation analysis
- Results comparison
- Scenario history tracking

### Reports
- ISO 14040/44 compliance reports
- CBAM (Carbon Border Adjustment Mechanism) reports
- BRSR (Business Responsibility) framework reports
- Circularity Index assessment
- PDF generation and download

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: React Icons
- **Styling**: CSS3 (Glass Morphism)

## Design System

### Color Palette
- **Primary**: #1FB8CD (Cyan)
- **Accent**: #00D9FF (Electric Cyan)
- **Background**: #0B1426 (Dark Blue) & #080F1F (Darker Blue)
- **Text**: #E2E8F0 (Light) & #B0B8C1 (Mid)
- **Border**: rgba(0, 217, 255, 0.2)

### Glass Morphism
- `backdrop-filter: blur(20px)`
- `background: rgba(31, 184, 205, 0.08)`
- `border: 1px solid rgba(0, 217, 255, 0.2)`

## AI Model Architecture

The platform uses an ensemble of three machine learning models:

1. **Random Forest** - Energy & CO₂ predictions
2. **Gradient Boosting (XGBoost)** - CO₂ and efficiency metrics
3. **Neural Networks** - Water usage and circularity assessment

**Prediction Accuracy:**
- Energy: 96% confidence
- CO₂: 94% confidence
- Water: 89% confidence
- Circularity: 87% confidence

## Prediction Factors

### Ore Grade Impact
- Power law relationship: exponent = 0.6
- Energy varies with ore concentration

### Energy Mix Multipliers
- Coal Heavy: 1.35x
- Mixed Grid: 1.0x (baseline)
- Renewable Heavy: 0.42x

### Geographic Factors (CO₂)
- China: 1.18x
- India: 1.12x
- Europe: 0.87x
- Nordic Countries: 0.64x
- GCC Countries: 1.28x

### Processing Route
- Pyrometallurgy: 1.0x (baseline)
- Hydrometallurgy: 0.78x
- Hybrid: 0.89x

### Production Scale
- >100,000 tonnes/year: 0.88x
- 50,000-100,000: 1.0x
- <50,000: 1.25x

## Getting Started

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Environment**
   - MongoDB connection string
   - JWT secret key
   - Port configuration

3. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

## Demo Credentials

- Email: `demo@ecomine.com`
- Password: `demo123`

## Future Enhancements

- [ ] Real-time data integration with mining databases
- [ ] Advanced scenario optimization algorithms
- [ ] Integration with IoT sensors
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced data visualization with 3D charts
- [ ] Export to GIS tools
- [ ] API rate limiting and caching
- [ ] Advanced analytics dashboard for admins
- [ ] Machine learning model updates

## License

Proprietary - ECOMINE Platform

## Support

For issues or questions, please contact: support@ecomine.com
