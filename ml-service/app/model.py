import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
ISO_MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")

class MLFraudDetector:
    def __init__(self):
        self.iso_forest = None
        self._load_or_train_models()

    def _load_or_train_models(self):
        os.makedirs(MODEL_DIR, exist_ok=True)
        if os.path.exists(ISO_MODEL_PATH):
            try:
                self.iso_forest = joblib.load(ISO_MODEL_PATH)
                print("[ML Service] Loaded existing Isolation Forest model.")
                return
            except Exception as e:
                print(f"[ML Service] Error loading model: {e}. Retraining...")

        # Train a default Isolation Forest model on synthetic normal/anomalous payment patterns
        print("[ML Service] Training initial Isolation Forest model...")
        np.random.seed(42)
        # Features: [amount_ratio, frequency, is_new_recipient, is_odd_hour, device_changed, suspicious_history]
        normal_data = np.random.normal(loc=[1.0, 1.0, 0.05, 0.1, 0.02, 0.0], scale=[0.3, 0.5, 0.1, 0.1, 0.05, 0.0], size=(500, 6))
        anomaly_data = np.random.normal(loc=[5.0, 6.0, 0.9, 0.8, 0.8, 0.9], scale=[2.0, 2.0, 0.2, 0.2, 0.2, 0.2], size=(50, 6))
        
        X_train = np.vstack([normal_data, anomaly_data])
        X_train = np.clip(X_train, 0, None)
        
        self.iso_forest = IsolationForest(contamination=0.109, n_estimators=200, random_state=42)
        self.iso_forest.fit(X_train)
        
        joblib.dump(self.iso_forest, ISO_MODEL_PATH)
        print("[ML Service] Model saved to isolation_forest.joblib")

    def predict_anomaly(self, feature_vector: list) -> float:
        """
        Returns anomaly score where values closer to -1 indicate anomalous/suspicious transactions,
        and values closer to 1 or >0 indicate normal behavior.
        """
        if self.iso_forest is None:
            return 0.0
        try:
            arr = np.array(feature_vector).reshape(1, -1)
            score = self.iso_forest.decision_function(arr)[0]
            return float(score)
        except Exception as e:
            print(f"[ML Service] ML inference failed: {e}")
            return 0.0

ml_detector = MLFraudDetector()
