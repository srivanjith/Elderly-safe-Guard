import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib

def process_kaggle_csv(file_path, sample_rows=100000):
    print(f"\n[Kaggle Importer] Loading Kaggle CSV dataset: {os.path.basename(file_path)}")
    
    # Read sample for speed and memory efficiency
    try:
        df = pd.read_csv(file_path, nrows=sample_rows)
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return False

    print(f"[OK] Successfully loaded {len(df):,} records!")
    cols = list(df.columns)
    print(f"[OK] Columns: {cols}\n")

    # Schema 1: Online Fraud / PaySim / Synthetic Financial (step, type, amount, nameOrig, oldbalanceOrg, newbalanceOrig, nameDest, isFraud)
    if 'amount' in df.columns:
        print("[Kaggle Importer] Processing Online Payment Fraud Schema...")
        
        avg_amt = float(df['amount'].mean())
        amount_ratio = (df['amount'] / max(avg_amt, 1.0)).clip(0.1, 20.0)

        if 'step' in df.columns:
            freq = df.groupby('step')['amount'].transform('count').clip(1, 10)
            odd_hour = df['step'].apply(lambda s: 1 if (int(s) % 24 >= 23 or int(s) % 24 <= 5) else 0)
        else:
            freq = pd.Series([1] * len(df))
            odd_hour = pd.Series([0] * len(df))

        if 'nameDest' in df.columns:
            new_recip = df['nameDest'].apply(lambda d: 1 if str(d).startswith('M') or str(d).startswith('C') else 0)
        else:
            new_recip = pd.Series([1] * len(df))

        np.random.seed(42)
        dev_changed = pd.Series(np.random.choice([0, 1], size=len(df), p=[0.88, 0.12]))
        
        if 'isFraud' in df.columns:
            susp_hist = df['isFraud']
        else:
            susp_hist = pd.Series([0] * len(df))

        df_features = pd.DataFrame({
            'amount_ratio': amount_ratio,
            'transaction_frequency': freq,
            'is_new_recipient': new_recip,
            'is_odd_hour': odd_hour,
            'device_changed': dev_changed,
            'previous_suspicious_activity': susp_hist
        })

    # Schema 2: Credit Card Fraud (Time, Amount, Class, V1...V28)
    elif 'Amount' in df.columns and 'Class' in df.columns:
        print("[Kaggle Importer] Processing Credit Card Fraud Schema...")
        avg_amt = float(df['Amount'].mean())
        amount_ratio = (df['Amount'] / max(avg_amt, 1.0)).clip(0.1, 20.0)
        
        freq = pd.Series([1] * len(df))
        if 'Time' in df.columns:
            odd_hour = df['Time'].apply(lambda t: 1 if (int(t / 3600) % 24 >= 23 or int(t / 3600) % 24 <= 5) else 0)
        else:
            odd_hour = pd.Series([0] * len(df))

        np.random.seed(42)
        df_features = pd.DataFrame({
            'amount_ratio': amount_ratio,
            'transaction_frequency': freq,
            'is_new_recipient': pd.Series(np.random.choice([0, 1], size=len(df), p=[0.70, 0.30])),
            'is_odd_hour': odd_hour,
            'device_changed': pd.Series(np.random.choice([0, 1], size=len(df), p=[0.85, 0.15])),
            'previous_suspicious_activity': df['Class']
        })

    else:
        print("❌ Unrecognized CSV schema. Required columns: 'amount'/'Amount'.")
        return False

    # Save processed CSV
    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)
    out_csv = os.path.join(out_dir, "processed_kaggle_dataset.csv")
    df_features.to_csv(out_csv, index=False)
    print(f"[OK] Saved processed feature dataset to: {out_csv}")

    # Retrain Isolation Forest
    print("[Kaggle Importer] Fitting Isolation Forest ML model on Kaggle data...")
    X = df_features.values
    
    # Calculate anomaly fraction
    contamination = 0.05
    if 'isFraud' in df.columns:
        fraud_ratio = float(df['isFraud'].sum() / len(df))
        if 0.01 <= fraud_ratio <= 0.2:
            contamination = fraud_ratio

    iso_model = IsolationForest(contamination=contamination, random_state=42)
    iso_model.fit(X)

    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "isolation_forest.joblib")
    
    joblib.dump(iso_model, model_path)
    print(f"[OK] Trained Isolation Forest saved to: {model_path}\n")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_file = sys.argv[1]
    else:
        # Auto-detect downloaded files in root
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        possible_files = ["onlinefraud.csv", "syntheticfinancial dataset.csv", "creditcard.csv"]
        target_file = None
        for f in possible_files:
            full_p = os.path.join(root_dir, f)
            if os.path.exists(full_p):
                target_file = full_p
                break
    
    if target_file and os.path.exists(target_file):
        process_kaggle_csv(target_file)
    else:
        print("❌ No CSV file specified or found. Usage: python import_kaggle_dataset.py <path_to_csv>")
