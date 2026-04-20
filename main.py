import warnings
warnings.filterwarnings("ignore")

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import ttest_ind, chi2_contingency

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    accuracy_score
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# -----------------------------
# 1. LOAD DATA
# -----------------------------
FILE_PATH = "D:/ecom_datavis/Ecommerce_Delivery_Analytics_New.csv"   # change if needed

df = pd.read_csv(FILE_PATH)

print("\n=== FIRST 5 ROWS ===")
print(df.head())

print("\n=== COLUMN NAMES ===")
print(df.columns.tolist())

print("\n=== DATA INFO ===")
print(df.info())

print("\n=== MISSING VALUES ===")
print(df.isnull().sum())


# -----------------------------
# 2. BASIC CLEANING
# -----------------------------
# Strip spaces from column names
df.columns = df.columns.str.strip()

# Strip spaces from object values
for col in df.select_dtypes(include="object").columns:
    df[col] = df[col].astype(str).str.strip()

# Convert target columns from Yes/No to 1/0
yes_no_map = {"Yes": 1, "No": 0}
df["Delivery Delay"] = df["Delivery Delay"].map(yes_no_map)
df["Refund Requested"] = df["Refund Requested"].map(yes_no_map)

# Service Rating should be numeric
df["Service Rating"] = pd.to_numeric(df["Service Rating"], errors="coerce")

# Delivery time should be numeric
df["Delivery Time (Minutes)"] = pd.to_numeric(df["Delivery Time (Minutes)"], errors="coerce")

# Order value should be numeric
df["Order Value (INR)"] = pd.to_numeric(df["Order Value (INR)"], errors="coerce")

# Synthetic timestamps like "54:29.5" — take the token before ":" and fold to 0–23 for hour-of-day signal
_hour_token = pd.to_numeric(
    df["Order Date & Time"].astype(str).str.split(":").str[0],
    errors="coerce",
)
df["Order Hour"] = _hour_token % 24

# Customer feedback length (EDA only; not used for predictive modeling — avoids text leakage paths)
df["Feedback Length"] = df["Customer Feedback"].astype(str).apply(len)

# Pre-order / operational feature: high-value threshold is known at order time
df["High Value Order"] = (df["Order Value (INR)"] > 1000).astype(int)

# Drop rows with missing critical values
critical_cols = [
    "Platform",
    "Delivery Time (Minutes)",
    "Product Category",
    "Order Value (INR)",
    "Service Rating",
    "Delivery Delay",
    "Refund Requested",
    "Order Hour"
]
df = df.dropna(subset=critical_cols).reset_index(drop=True)

# Demand / load proxies and time-of-day buckets (computed on the cleaned sample)
df["category_count"] = df["Product Category"].map(
    df["Product Category"].value_counts()
)
df["platform_order_count"] = df["Platform"].map(
    df["Platform"].value_counts()
)
df["time_bucket"] = pd.cut(
    df["Order Hour"],
    bins=[0, 6, 12, 18, 24],
    labels=["Night", "Morning", "Afternoon", "Evening"],
    right=False,
    include_lowest=True,
)

print("\n=== CLEANED DATA SHAPE ===")
print(df.shape)

print("\n=== CLEANED MISSING VALUES ===")
print(df.isnull().sum())

print("\n=== NUMERIC CORRELATION MATRIX (supports EDA / report claims) ===")
print(df.corr(numeric_only=True))


# -----------------------------
# 3. EDA / BUSINESS METRICS
# -----------------------------
print("\n=== BUSINESS METRICS ===")
delay_rate = df["Delivery Delay"].mean() * 100
refund_rate = df["Refund Requested"].mean() * 100
avg_delivery_time = df["Delivery Time (Minutes)"].mean()
avg_order_value = df["Order Value (INR)"].mean()

print(f"Delay Rate: {delay_rate:.2f}%")
print(f"Refund Rate: {refund_rate:.2f}%")
print(f"Average Delivery Time: {avg_delivery_time:.2f} minutes")
print(f"Average Order Value: INR {avg_order_value:.2f}")

print("\n=== DELAY RATE BY PLATFORM ===")
print(
    df.groupby("Platform")["Delivery Delay"]
    .mean()
    .sort_values(ascending=False)
    .mul(100)
    .round(2)
)

print("\n=== REFUND RATE BY PLATFORM ===")
print(
    df.groupby("Platform")["Refund Requested"]
    .mean()
    .sort_values(ascending=False)
    .mul(100)
    .round(2)
)

print("\n=== AVERAGE DELIVERY TIME BY PRODUCT CATEGORY ===")
print(
    df.groupby("Product Category")["Delivery Time (Minutes)"]
    .mean()
    .sort_values(ascending=False)
    .round(2)
)

print("\n=== REFUND RATE BY DELAY STATUS ===")
print(
    df.groupby("Delivery Delay")["Refund Requested"]
    .mean()
    .mul(100)
    .round(2)
)

print("\n=== DELAY RATE BY PRODUCT CATEGORY ===")
print(
    df.groupby("Product Category")["Delivery Delay"]
    .mean()
    .sort_values(ascending=False)
    .mul(100)
    .round(2)
)

df["value_bucket"] = pd.cut(
    df["Order Value (INR)"], bins=4, duplicates="drop"
)
print("\n=== DELAY RATE BY ORDER VALUE BUCKET ===")
print(
    df.groupby("value_bucket", observed=True)["Delivery Delay"]
    .mean()
    .mul(100)
    .round(2)
)

print("\n=== DELAY RATE BY ORDER HOUR ===")
print(
    df.groupby("Order Hour")["Delivery Delay"]
    .mean()
    .sort_index()
    .mul(100)
    .round(2)
)

# Create output folder for charts
os.makedirs("outputs", exist_ok=True)

# 3.1 Delay count
plt.figure(figsize=(6, 4))
df["Delivery Delay"].value_counts().sort_index().plot(kind="bar")
plt.title("Delayed vs Non-Delayed Orders")
plt.xlabel("Delivery Delay (0=No, 1=Yes)")
plt.ylabel("Count")
plt.tight_layout()
plt.savefig("outputs/delay_count.png")
plt.show()

# 3.2 Platform vs delay rate
platform_delay = (
    df.groupby("Platform")["Delivery Delay"]
    .mean()
    .sort_values(ascending=False)
    .mul(100)
)
plt.figure(figsize=(8, 5))
platform_delay.plot(kind="bar")
plt.title("Delay Rate by Platform")
plt.xlabel("Platform")
plt.ylabel("Delay Rate (%)")
plt.tight_layout()
plt.savefig("outputs/platform_delay_rate.png")
plt.show()

# 3.3 Refund rate by delay status
refund_by_delay = (
    df.groupby("Delivery Delay")["Refund Requested"]
    .mean()
    .sort_index()
    .mul(100)
)
plt.figure(figsize=(6, 4))
refund_by_delay.plot(kind="bar")
plt.title("Refund Rate by Delay Status")
plt.xlabel("Delivery Delay (0=No, 1=Yes)")
plt.ylabel("Refund Rate (%)")
plt.tight_layout()
plt.savefig("outputs/refund_by_delay.png")
plt.show()

# 3.4 Delivery time distribution
plt.figure(figsize=(8, 5))
plt.hist(df["Delivery Time (Minutes)"], bins=20, edgecolor="black")
plt.title("Distribution of Delivery Time")
plt.xlabel("Delivery Time (Minutes)")
plt.ylabel("Frequency")
plt.tight_layout()
plt.savefig("outputs/delivery_time_distribution.png")
plt.show()

# 3.5 Order value by delay status
group0 = df[df["Delivery Delay"] == 0]["Order Value (INR)"]
group1 = df[df["Delivery Delay"] == 1]["Order Value (INR)"]

plt.figure(figsize=(7, 5))
plt.boxplot([group0, group1], labels=["No Delay", "Delay"])
plt.title("Order Value by Delay Status")
plt.ylabel("Order Value (INR)")
plt.tight_layout()
plt.savefig("outputs/order_value_by_delay.png")
plt.show()

# 3.6 Service rating by delay status
rating0 = df[df["Delivery Delay"] == 0]["Service Rating"]
rating1 = df[df["Delivery Delay"] == 1]["Service Rating"]

plt.figure(figsize=(7, 5))
plt.boxplot([rating0, rating1], labels=["No Delay", "Delay"])
plt.title("Service Rating by Delay Status")
plt.ylabel("Service Rating")
plt.tight_layout()
plt.savefig("outputs/service_rating_by_delay.png")
plt.show()

# 3.7 Category vs average delivery time
cat_delivery_time = (
    df.groupby("Product Category")["Delivery Time (Minutes)"]
    .mean()
    .sort_values(ascending=False)
)
plt.figure(figsize=(10, 5))
cat_delivery_time.plot(kind="bar")
plt.title("Average Delivery Time by Product Category")
plt.xlabel("Product Category")
plt.ylabel("Average Delivery Time (Minutes)")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.savefig("outputs/category_delivery_time.png")
plt.show()


# -----------------------------
# 4. HYPOTHESIS TESTING
# -----------------------------
print("\n=== HYPOTHESIS TESTING ===")

# 4.1 T-test: delivery time for delayed vs non-delayed
delayed_time = df[df["Delivery Delay"] == 1]["Delivery Time (Minutes)"]
not_delayed_time = df[df["Delivery Delay"] == 0]["Delivery Time (Minutes)"]

t_stat, p_val = ttest_ind(delayed_time, not_delayed_time, equal_var=False)
print("\nT-test: Delivery Time for Delayed vs Non-Delayed Orders")
print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_val:.6f}")
if p_val < 0.05:
    print("Result: Significant difference in delivery time between delayed and non-delayed orders.")
else:
    print("Result: No significant difference found.")

# 4.2 T-test: service rating for delayed vs non-delayed
t_stat, p_val = ttest_ind(rating1, rating0, equal_var=False)
print("\nT-test: Service Rating for Delayed vs Non-Delayed Orders")
print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_val:.6f}")
if p_val < 0.05:
    print("Result: Significant difference in service rating between delayed and non-delayed orders.")
else:
    print("Result: No significant difference found.")

# 4.3 Chi-square: delay vs refund requested
contingency_1 = pd.crosstab(df["Delivery Delay"], df["Refund Requested"])
chi2, p_delay_refund, dof, expected = chi2_contingency(contingency_1)
print("\nChi-square Test: Delivery Delay vs Refund Requested")
print("Contingency Table:")
print(contingency_1)
print(f"Chi-square: {chi2:.4f}")
print(f"P-value: {p_delay_refund:.6f}")
if p_delay_refund < 0.05:
    print("Result: Delivery delay and refund request are significantly associated (association, not causation).")
else:
    print("Result: Refund behavior does not significantly vary with delivery delay in this dataset.")

# 4.4 Chi-square: platform vs delay
contingency_2 = pd.crosstab(df["Platform"], df["Delivery Delay"])
chi2, p_platform_delay, dof, expected = chi2_contingency(contingency_2)
print("\nChi-square Test: Platform vs Delivery Delay")
print("Contingency Table:")
print(contingency_2)
print(f"Chi-square: {chi2:.4f}")
print(f"P-value: {p_platform_delay:.6f}")
if p_platform_delay < 0.05:
    print("Result: Platform and delivery delay are significantly associated.")
else:
    print("Result: Platform differences in delay rate are not statistically significant.")


# -----------------------------
# 5. PREPARE DATA FOR MODELING
# -----------------------------
# Goal: predict Delivery Delay using only pre-order / operational inputs (no post-delivery leakage).
# Features: platform/category encodings, order value, hour, high-value flag, category/platform volume,
#           time_bucket (encoded).
model_df = df.copy()

drop_cols = [
    "Order ID",
    "Customer ID",
    "Customer Feedback",
    "Order Date & Time",
    "Delivery Time (Minutes)",
    "Fast Delivery",
    "Service Rating",
    "Refund Requested",
    "Low Rating",
    "Feedback Length",
    "value_bucket",
]
model_df = model_df.drop(columns=drop_cols, errors="ignore")

# Encode categorical columns (include Categorical e.g. time_bucket from pd.cut)
label_encoders = {}
_cat_like = model_df.select_dtypes(include=["object", "category"]).columns
for col in _cat_like:
    le = LabelEncoder()
    model_df[col] = le.fit_transform(model_df[col].astype(str))
    label_encoders[col] = le

print("\n=== MODEL DATA PREVIEW ===")
print(model_df.head())

# Features and target
X = model_df.drop(columns=["Delivery Delay"])
y = model_df["Delivery Delay"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("\n=== TRAIN / TEST SHAPES ===")
print("X_train:", X_train.shape)
print("X_test :", X_test.shape)
print("y_train:", y_train.shape)
print("y_test :", y_test.shape)


# -----------------------------
# 6. LOGISTIC REGRESSION
# -----------------------------
log_model = LogisticRegression(max_iter=1000, class_weight="balanced")
log_model.fit(X_train, y_train)

y_pred_log = log_model.predict(X_test)
y_prob_log = log_model.predict_proba(X_test)[:, 1]

print("\n=== LOGISTIC REGRESSION RESULTS ===")
print("Accuracy:", round(accuracy_score(y_test, y_pred_log), 4))
print("ROC-AUC :", round(roc_auc_score(y_test, y_prob_log), 4))
print("\nClassification Report:")
print(classification_report(y_test, y_pred_log))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred_log))

# Logistic regression coefficients
coef_df = pd.DataFrame({
    "Feature": X.columns,
    "Coefficient": log_model.coef_[0]
}).sort_values(by="Coefficient", ascending=False)

print("\n=== LOGISTIC REGRESSION FEATURE COEFFICIENTS ===")
print(coef_df)

coef_df.to_csv("outputs/logistic_regression_coefficients.csv", index=False)


# -----------------------------
# 7. RANDOM FOREST
# -----------------------------
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight="balanced"
)
rf_model.fit(X_train, y_train)

y_pred_rf = rf_model.predict(X_test)
y_prob_rf = rf_model.predict_proba(X_test)[:, 1]

print("\n=== RANDOM FOREST RESULTS ===")
print("Accuracy:", round(accuracy_score(y_test, y_pred_rf), 4))
print("ROC-AUC :", round(roc_auc_score(y_test, y_prob_rf), 4))
print("\nClassification Report:")
print(classification_report(y_test, y_pred_rf))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred_rf))

# Feature importance
importance_df = pd.DataFrame({
    "Feature": X.columns,
    "Importance": rf_model.feature_importances_
}).sort_values(by="Importance", ascending=False)

print("\n=== RANDOM FOREST FEATURE IMPORTANCE ===")
print(importance_df)

_max_imp = float(importance_df["Importance"].max())
_uniform = 1.0 / len(importance_df)
print("\n=== RANDOM FOREST FEATURE IMPORTANCE - INTERPRETATION ===")
if _max_imp < 0.2 or _max_imp < 1.5 * _uniform:
    print(
        "No single feature strongly predicts delay: importance is spread across inputs "
        f"(max importance {_max_imp:.3f}; uniform baseline {_uniform:.3f})."
    )
else:
    _top = importance_df.iloc[0]
    print(
        f"Strongest signal from '{_top['Feature']}' (importance {_top['Importance']:.3f}), "
        "but check ROC-AUC - modest overall separability is still possible."
    )

importance_df.to_csv("outputs/random_forest_feature_importance.csv", index=False)

plt.figure(figsize=(10, 6))
plt.barh(importance_df["Feature"], importance_df["Importance"])
plt.gca().invert_yaxis()
plt.title("Random Forest Feature Importance")
plt.xlabel("Importance")
plt.tight_layout()
plt.savefig("outputs/random_forest_feature_importance.png")
plt.show()


# -----------------------------
# 8. ROC CURVE COMPARISON
# -----------------------------
fpr_log, tpr_log, _ = roc_curve(y_test, y_prob_log)
fpr_rf, tpr_rf, _ = roc_curve(y_test, y_prob_rf)

plt.figure(figsize=(8, 6))
plt.plot(fpr_log, tpr_log, label=f"Logistic Regression (AUC={roc_auc_score(y_test, y_prob_log):.3f})")
plt.plot(fpr_rf, tpr_rf, label=f"Random Forest (AUC={roc_auc_score(y_test, y_prob_rf):.3f})")
plt.plot([0, 1], [0, 1], linestyle="--")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve Comparison")
plt.legend()
plt.tight_layout()
plt.savefig("outputs/roc_curve_comparison.png")
plt.show()


# -----------------------------
# 9. EXPORT CLEANED DATA FOR TABLEAU
# -----------------------------
tableau_df = df.copy()

# Add some ready-made dashboard columns
tableau_df["Delay Label"] = tableau_df["Delivery Delay"].map({0: "No Delay", 1: "Delayed"})
tableau_df["Refund Label"] = tableau_df["Refund Requested"].map({0: "No Refund", 1: "Refund Requested"})

tableau_df.to_csv("outputs/ecommerce_delivery_cleaned_for_tableau.csv", index=False)
print("\nCleaned Tableau file saved to: outputs/ecommerce_delivery_cleaned_for_tableau.csv")


# -----------------------------
# 10. OPTIONAL SUMMARY OUTPUT
# -----------------------------
print("\n=== FINAL BUSINESS SUMMARY ===")
print(
    "Goal: Predict delivery delays using pre-order and operational features, "
    "and analyze business factors affecting delivery performance."
)
print(
    "Modeling uses no post-delivery outcomes (e.g. realized delivery time, ratings, refunds) "
    "as predictors - see exports for coefficients / feature importance."
)

worst_platform = (
    df.groupby("Platform")["Delivery Delay"]
    .mean()
    .sort_values(ascending=False)
    .index[0]
)
best_platform = (
    df.groupby("Platform")["Delivery Delay"]
    .mean()
    .sort_values(ascending=True)
    .index[0]
)

print(f"Highest observed delay rate by platform (descriptive): {worst_platform}")
print(f"Lowest observed delay rate by platform (descriptive): {best_platform}")
if p_platform_delay >= 0.05:
    print(
        "Statistical note: platform vs delay is not significant at alpha=0.05 - "
        "do not treat platform rankings as proven drivers."
    )

refund_when_delayed = df[df["Delivery Delay"] == 1]["Refund Requested"].mean() * 100
refund_when_not_delayed = df[df["Delivery Delay"] == 0]["Refund Requested"].mean() * 100

print(f"Refund rate when delayed (descriptive): {refund_when_delayed:.2f}%")
print(f"Refund rate when not delayed (descriptive): {refund_when_not_delayed:.2f}%")
if p_delay_refund >= 0.05:
    print(
        "Statistical note: refund rate does not differ significantly by delay status - "
        "avoid claiming that delays cause or explain refunds from this test alone."
    )
else:
    print(
        "Statistical note: significant association between delay and refund - "
        "still association, not proof of causation."
    )

print(
    "Descriptive: realized delivery time differs between delayed vs non-delayed labels "
    "(see t-test above); that is about observed times, not a leak-free prediction setup."
)

print("\nFiles generated inside the 'outputs' folder:")
for file_name in sorted(os.listdir("outputs")):
    print("-", file_name)