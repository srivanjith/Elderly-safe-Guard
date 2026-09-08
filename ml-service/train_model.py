import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

def generate_dataset(num_normal=1000, num_fraud=100):
    np.random.seed(42)
    
    # 1. Normal Transactions (Baseline routine payments)
    normal_ratio = np.random.normal(loc=1.0, scale=0.3, size=num_normal).clip(0.1, 2.0)
    normal_freq = np.random.poisson(lam=0.5, size=num_normal).clip(1, 2)
    normal_new_recip = np.random.choice([0, 1], size=num_normal, p=[0.90, 0.10])
    normal_odd_hour = np.random.choice([0, 1], size=num_normal, p=[0.92, 0.08])
    normal_dev_changed = np.random.choice([0, 1], size=num_normal, p=[0.95, 0.05])
    normal_susp_hist = np.random.choice([0, 1], size=num_normal, p=[0.98, 0.02])
    normal_target = np.zeros(num_normal, dtype=int)

    # 2. Fraudulent / Scam Transactions (High anomaly scores)
    fraud_ratio = np.random.normal(loc=6.0, scale=2.0, size=num_fraud).clip(2.5, 15.0)
    fraud_freq = np.random.poisson(lam=4.0, size=num_fraud).clip(2, 10)
    fraud_new_recip = np.random.choice([0, 1], size=num_fraud, p=[0.15, 0.85])
    fraud_odd_hour = np.random.choice([0, 1], size=num_fraud, p=[0.25, 0.75])
    fraud_dev_changed = np.random.choice([0, 1], size=num_fraud, p=[0.30, 0.70])
    fraud_susp_hist = np.random.choice([0, 1], size=num_fraud, p=[0.20, 0.80])
    fraud_target = np.ones(num_fraud, dtype=int)

    # Combine into DataFrame
    df_normal = pd.DataFrame({
        'amount_ratio': normal_ratio,
        'transaction_frequency': normal_freq,
        'is_new_recipient': normal_new_recip,
        'is_odd_hour': normal_odd_hour,
        'device_changed': normal_dev_changed,
        'previous_suspicious_activity': normal_susp_hist,
        'is_fraud': normal_target
    })

    df_fraud = pd.DataFrame({
        'amount_ratio': fraud_ratio,
        'transaction_frequency': fraud_freq,
        'is_new_recipient': fraud_new_recip,
        'is_odd_hour': fraud_odd_hour,
        'device_changed': fraud_dev_changed,
        'previous_suspicious_activity': fraud_susp_hist,
        'is_fraud': fraud_target
    })

    df = pd.concat([df_normal, df_fraud], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)
    return df

def main():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)

    csv_path = os.path.join(data_dir, "transaction_fraud_dataset.csv")
    model_path = os.path.join(models_dir, "isolation_forest.joblib")

    print("[Dataset Script] Generating financial scam & payment telemetry dataset...")
    df = generate_dataset(num_normal=1000, num_fraud=100)
    df.to_csv(csv_path, index=False)
    print(f"[OK] Dataset exported to CSV: {csv_path} ({len(df)} records)")

    # Train Isolation Forest Model
    feature_cols = ['amount_ratio', 'transaction_frequency', 'is_new_recipient', 'is_odd_hour', 'device_changed', 'previous_suspicious_activity']
    X = df[feature_cols].values

    print("[Dataset Script] Fitting Isolation Forest model on dataset...")
    iso_model = IsolationForest(contamination=0.09, random_state=42)
    iso_model.fit(X)

    joblib.dump(iso_model, model_path)
    print(f"[OK] ML Model trained and saved to: {model_path}")

if __name__ == "__main__":
    main()
