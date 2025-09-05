import pandas as pd
import numpy as np
from sklearn.model_selection import (train_test_split, cross_val_score, 
                                   GridSearchCV, RandomizedSearchCV)
from sklearn.preprocessing import StandardScaler, LabelEncoder, RobustScaler
from sklearn.ensemble import (RandomForestRegressor, RandomForestClassifier, 
                            GradientBoostingRegressor, GradientBoostingClassifier)
from sklearn.metrics import mean_squared_error, r2_score, classification_report
from sklearn.feature_selection import SelectFromModel, RFECV
from sklearn.inspection import permutation_importance
import matplotlib.pyplot as plt
import seaborn as sns
import pulp  # For transportation optimization
import networkx as nx  # For network analysis

# Load and preprocess data
df = pd.read_csv('space_decay.csv')

# Convert date columns to datetime
date_columns = ['CREATION_DATE', 'EPOCH', 'LAUNCH_DATE', 'DECAY_DATE']
for col in date_columns:
    try:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    except:
        continue

# Calculate derived features
df['LIFETIME'] = (df['DECAY_DATE'] - df['LAUNCH_DATE']).dt.total_seconds() / (24*3600)
df['LAUNCH_YEAR'] = df['LAUNCH_DATE'].dt.year
df['LAUNCH_MONTH'] = df['LAUNCH_DATE'].dt.month
df['EPOCH_YEAR'] = df['EPOCH'].dt.year
df['EPOCH_MONTH'] = df['EPOCH'].dt.month
df['AGE'] = (df['EPOCH'] - df['LAUNCH_DATE']).dt.total_seconds() / (24*3600)

# Create orbital classification
df['ORBIT_CLASS'] = pd.cut(df['PERIAPSIS'], 
                          bins=[0, 500, 2000, 35786, float('inf')],
                          labels=['LEO', 'MEO', 'GEO', 'HEO'])

# Calculate additional orbital parameters
df['ORBITAL_ENERGY'] = -398600.4418 / (2 * df['SEMIMAJOR_AXIS'])
df['ORBITAL_PERIOD'] = 2 * np.pi * np.sqrt(df['SEMIMAJOR_AXIS']**3 / 398600.4418)
df['MEAN_VELOCITY'] = np.sqrt(398600.4418 * (2/df['PERIAPSIS'] - 1/df['SEMIMAJOR_AXIS']))
df['AREA_TO_MASS'] = df['BSTAR'] * 12.741621  # Convert BSTAR to Area/Mass ratio
df['ORBITAL_ENERGY_RATIO'] = df['ORBITAL_ENERGY'] / df['MEAN_MOTION']
df['ALTITUDE_RATIO'] = df['APOAPSIS'] / df['PERIAPSIS']

# Feature sets
features = ['MEAN_MOTION', 'ECCENTRICITY', 'INCLINATION', 'SEMIMAJOR_AXIS', 
           'PERIOD', 'APOAPSIS', 'PERIAPSIS', 'ORBITAL_ENERGY', 'ORBITAL_PERIOD',
           'MEAN_VELOCITY', 'AGE', 'OBJECT_TYPE', 'ORBIT_CLASS']

# Prepare features
print("Preparing features...")
X = df[features].copy()

# Encode categorical variables
le = LabelEncoder()
for cat_feature in ['OBJECT_TYPE', 'ORBIT_CLASS']:
    X[cat_feature] = le.fit_transform(X[cat_feature].astype(str))

# Handle missing values and infinities
X = X.replace([np.inf, -np.inf], np.nan)
X = X.fillna(X.mean())

# Use RobustScaler for better handling of outliers
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

# Prepare target variables
y_decay = df['MEAN_MOTION_DOT'].fillna(df['MEAN_MOTION_DOT'].mean())
y_lifetime = df['AGE'].fillna(df['AGE'].mean())
y_risk = (df['MEAN_MOTION_DOT'] > df['MEAN_MOTION_DOT'].quantile(0.95)).astype(int)

# Split data
X_train, X_test, y_decay_train, y_decay_test = train_test_split(X_scaled, y_decay, test_size=0.2, random_state=42)
_, _, y_lifetime_train, y_lifetime_test = train_test_split(X_scaled, y_lifetime, test_size=0.2, random_state=42)
_, _, y_risk_train, y_risk_test = train_test_split(X_scaled, y_risk, test_size=0.2, random_state=42)

print("Splitting data and training models...")
# Train models with simplified parameters
decay_model = RandomForestRegressor(n_estimators=100, random_state=42)
risk_model = RandomForestClassifier(n_estimators=100, random_state=42)

decay_model.fit(X_train, y_decay_train)
risk_model.fit(X_train, y_risk_train)

# Make predictions
decay_pred = decay_model.predict(X_test)
risk_pred = risk_model.predict(X_test)

# Get feature importance from Random Forest models
decay_importance = pd.Series(decay_model.feature_importances_, index=X.columns)
risk_importance = pd.Series(risk_model.feature_importances_, index=X.columns)

# Print model performance metrics
print("\nModel Performance Metrics:")
print("\n1. Decay Rate Prediction:")
print(f"R² Score: {r2_score(y_decay_test, decay_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_decay_test, decay_pred)):.6f}")
print("\nCross-validation scores:")
cv_scores_decay = cross_val_score(decay_model, X_train, y_decay_train, cv=5, scoring='r2')
print(f"Mean CV R² Score: {cv_scores_decay.mean():.4f} (+/- {cv_scores_decay.std() * 2:.4f})")

print("\n2. Risk Classification:")
print("\nClassification Report:")
print(classification_report(y_risk_test, risk_pred))
print("\nCross-validation scores:")
cv_scores_risk = cross_val_score(risk_model, X_train, y_risk_train, cv=5, scoring='f1')
print(f"Mean CV F1 Score: {cv_scores_risk.mean():.4f} (+/- {cv_scores_risk.std() * 2:.4f})")

# Save models to pickle files
import pickle

print("\nSaving models to pickle files...")
# Save the decay rate prediction model
with open('decay_model.pkl', 'wb') as f:
    pickle.dump(decay_model, f)
print("Decay rate prediction model saved as 'decay_model.pkl'")

# Save the risk classification model
with open('risk_model.pkl', 'wb') as f:
    pickle.dump(risk_model, f)
print("Risk classification model saved as 'risk_model.pkl'")

# Save the scaler for future preprocessing
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
print("Scaler saved as 'scaler.pkl'")

# Save feature columns for future reference
with open('feature_columns.pkl', 'wb') as f:
    pickle.dump(X.columns.tolist(), f)
print("Feature columns saved as 'feature_columns.pkl'")

# Create visualization of feature importance and predictions
plt.figure(figsize=(20, 15))

# Plot feature importance for both models
for idx, (title, importance) in enumerate([
    ("Decay Rate", decay_importance),
    ("Risk Classification", risk_importance)
]):
    plt.subplot(2, 2, idx+1)
    importance_df = pd.DataFrame({
        'feature': importance.index,
        'importance': importance.values
    }).sort_values('importance', ascending=False)
    
    sns.barplot(data=importance_df.head(10), x='importance', y='feature')
    plt.title(f'Top 10 Features for {title} Prediction (Optimized)')
    plt.xlabel('Feature Importance')

# Plot actual vs predicted for decay rate
plt.subplot(2, 2, 3)
plt.scatter(y_decay_test, decay_pred, alpha=0.5)
plt.plot([y_decay_test.min(), y_decay_test.max()], 
         [y_decay_test.min(), y_decay_test.max()], 
         'r--', lw=2)
plt.xlabel('Actual Decay Rate')
plt.ylabel('Predicted Decay Rate')
plt.title('Actual vs Predicted Decay Rate (Optimized)')

# Plot ROC curve for risk classification
from sklearn.metrics import roc_curve, auc
plt.subplot(2, 2, 4)
y_score = risk_model.predict_proba(X_test)[:, 1]
fpr, tpr, _ = roc_curve(y_risk_test, y_score)
roc_auc = auc(fpr, tpr)
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve for Risk Classification')
plt.legend(loc="lower right")

plt.tight_layout()
plt.savefig('optimized_analysis.png')
plt.close()

class SpaceDebrisTransport:
    def __init__(self, debris_data, sample_size=100):
        # Sample the data for optimization if it's too large
        if len(debris_data) > sample_size:
            self.debris_data = debris_data.sample(n=sample_size, random_state=42)
        else:
            self.debris_data = debris_data
        self.problem = pulp.LpProblem("Space_Debris_Transport", pulp.LpMinimize)
        
    def calculate_transfer_costs(self):
        """Calculate delta-v costs between debris orbits"""
        costs = {}
        debris_items = self.debris_data.index.tolist()
        for i in debris_items:
            row1 = self.debris_data.loc[i]
            for j in debris_items:
                if i != j:
                    row2 = self.debris_data.loc[j]
                    delta_h = abs(row1['SEMIMAJOR_AXIS'] - row2['SEMIMAJOR_AXIS'])
                    inclination_change = abs(row1['INCLINATION'] - row2['INCLINATION'])
                    costs[(i, j)] = delta_h * 0.0001 + inclination_change * 0.01  # Reduced cost coefficients
        return costs
    
    def optimize_collection_sequence(self, max_capacity=10):
        """Optimize debris collection sequence considering fuel constraints"""
        print("Calculating transfer costs...")
        costs = self.calculate_transfer_costs()
        
        print("Setting up optimization problem...")
        
        # Decision variables
        x = pulp.LpVariable.dicts("route", 
                                ((i, j) for i, j in costs.keys()),
                                lowBound=0,
                                upBound=1,
                                cat='Binary')
        
        # Objective: Minimize total cost
        self.problem += pulp.lpSum(costs[i, j] * x[i, j] for i, j in costs.keys())
        
        # Each debris must be visited at least once
        for j in self.debris_data.index:
            self.problem += pulp.lpSum(x[i, j] for i in self.debris_data.index 
                                     if (i, j) in costs.keys()) >= 1
        
        # Each collector can visit at most max_capacity debris
        for i in self.debris_data.index:
            self.problem += pulp.lpSum(x[i, j] for j in self.debris_data.index 
                                     if (i, j) in costs.keys()) <= max_capacity
        
        # Solve with suppressed output
        self.problem.solve(pulp.PULP_CBC_CMD(msg=False))
        return {(i, j): x[i, j].value() for (i, j) in costs.keys() if x[i, j].value() > 0}

def optimize_debris_collection(df, risk_model, decay_model):
    """Optimize debris collection considering risk and decay predictions"""
    # Get risk predictions
    X_current = df.copy()  # You'll need to implement this
    risk_scores = risk_model.predict_proba(X_current)[:, 1]
    decay_rates = decay_model.predict(X_current)
    
    # Add predictions to dataframe
    df['risk_score'] = risk_scores
    df['decay_rate'] = decay_rates
    
    # Initialize transportation optimizer
    transport_opt = SpaceDebrisTransport(df)
    
    # Get optimal collection sequence
    optimal_routes = transport_opt.optimize_collection_sequence()
    
    return optimal_routes, df[['risk_score', 'decay_rate']]

# Analyze high-risk objects
print("\nDetailed Analysis of High-Risk Objects:")
high_risk_mask = risk_pred == 1
high_risk_objects = X_test[high_risk_mask]
high_risk_predictions = pd.DataFrame({
    'Predicted_Decay_Rate': decay_pred[high_risk_mask]
})

print(f"\nNumber of predicted high-risk objects: {len(high_risk_objects)}")
print("\nSummary of predictions for high-risk objects:")
print(high_risk_predictions.describe().to_string())

# Print selected features
print("\nTop 5 Important Features for Decay Rate Prediction:")
top_features = decay_importance.sort_values(ascending=False).head(5)
for feature, importance in top_features.items():
    print(f"{feature}: {importance:.4f}")

print("\n3. Transportation Optimization:")
# Sample a subset of the data for visualization
# Select debris with highest risk scores for optimization
print("Selecting highest risk debris for collection...")
risk_scores = risk_model.predict_proba(X_scaled)[:, 1]
high_risk_indices = (-risk_scores).argsort()[:10]  # Top 10 highest risk debris
df_sample = df.iloc[high_risk_indices].copy()
df_sample.reset_index(drop=True, inplace=True)  # Reset index for optimization

transport_opt = SpaceDebrisTransport(df_sample)
print("\nOptimizing collection sequence...")
routes = transport_opt.optimize_collection_sequence()

# Print optimization results
print("\nOptimal Collection Routes:")
total_cost = 0
for (source, target), value in routes.items():
    if value > 0:
        source_data = df_sample.iloc[source]
        target_data = df_sample.iloc[target]
        delta_h = abs(source_data['SEMIMAJOR_AXIS'] - target_data['SEMIMAJOR_AXIS'])
        inclination_change = abs(source_data['INCLINATION'] - target_data['INCLINATION'])
        cost = delta_h * 0.001 + inclination_change * 0.1
        total_cost += cost
        print(f"\nRoute {source} → {target}:")
        print(f"  Source Orbit: Alt={source_data['SEMIMAJOR_AXIS']:.1f}km, Inc={source_data['INCLINATION']:.1f}°")
        print(f"  Target Orbit: Alt={target_data['SEMIMAJOR_AXIS']:.1f}km, Inc={target_data['INCLINATION']:.1f}°")
        print(f"  Cost: {cost:.2f} units (ΔH={delta_h:.1f}km, ΔInc={inclination_change:.1f}°)")

print(f"\nTotal Collection Cost: {total_cost:.2f} units")
print(f"Number of Collection Routes: {len([v for v in routes.values() if v > 0])}")

# Visualize optimal collection routes
G = nx.DiGraph()
for (source, target), value in routes.items():
    if value > 0:
        G.add_edge(source, target, weight=value)

plt.figure(figsize=(15, 10))
pos = nx.spring_layout(G, k=2, iterations=50)
nx.draw(G, pos, with_labels=True, node_color='lightblue', 
        node_size=1000, arrowsize=20, font_size=10,
        width=2, edge_color='gray', alpha=0.7)
plt.title("Optimal Debris Collection Routes", pad=20, size=14)
plt.savefig('debris_collection_routes.png', dpi=300, bbox_inches='tight')
plt.close()

print("\nVisualization saved as 'debris_collection_routes.png'")
print("The graph shows the optimal path for debris collection, where:")
print("- Each node represents a piece of space debris")
print("- Arrows show the collection sequence")
print("- Node numbers correspond to debris indices in the dataset")

print("\nAnalysis complete! Check debris_collection_routes.png for visualization.")
