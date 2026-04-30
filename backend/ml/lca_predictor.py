import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
import json
import os

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
        self.le_metal = LabelEncoder()
        self.le_route = LabelEncoder()
        self.le_proc = LabelEncoder()
        self.scaler = StandardScaler()
        self.models = {}
        self._train()

    def _encode_features(self, data):
        metals = [d[0] for d in data]
        routes = [d[1] for d in data]
        procs = [d[5] for d in data]
        grid_f = [d[2] for d in data]
        ore_g = [d[3] for d in data]
        capacity = [d[4] for d in data]

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
                'predicted': round(float(ensemble), 2),
                'ci_low':    round(float(ci_low), 2),
                'ci_high':   round(float(ci_high), 2),
                'confidence_pct': round(float(confidence), 1)
            }

        return results

# ── Express-compatible wrapper (called by Node via child_process) ──────────
if __name__ == '__main__':
    import sys
    try:
        predictor = ECOMINEPredictor()
        if len(sys.argv) > 1:
            inputs = json.loads(sys.argv[1])
            result = predictor.predict(
                inputs.get('metalType', 'aluminum'),
                inputs.get('productionRoute', 'primary'),
                inputs.get('gridFactor', 0.716),
                inputs.get('oreGrade', 2.5),
                inputs.get('productionCapacity', 100000),
                inputs.get('processingRoute', 'pyrometallurgy')
            )
            print(json.dumps(result))
        else:
            print(json.dumps({"error": "No inputs provided"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
