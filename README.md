# Used Car Price Prediction Using Machine Learning

**Course:** ES 335 Machine Learning · Course Project  
**Author:** Gouru Prakarsha (Roll: 25110121)  
**Institution:** Indian Institute of Technology Gandhinagar  
**Live Website:** https://gouruprakarsha-pixel.github.io/Used-car-price-project/  
**GitHub Repository:** https://github.com/gouruprakarsha-pixel/Used-car-price-project

---

## 1. Project Overview & Question

In secondary automotive resale markets, listing prices reflect high non-linear volatility driven by age, cumulative mileage wear, accident history, and brand tiers.

* **Research Question:** Can observable pre-purchase vehicle attributes reliably predict secondary market listing prices, and do non-linear tree ensembles significantly outperform linear depreciation baselines?
* **Unit of Observation:** A single used car listing on Cars.com.
* **Target Variable:** Asking price in USD (`price`, continuous float).
* **Prediction-Time Boundary:** Restricted strictly to attributes observable before purchasing (excluding post-sale negotiation and market duration to prevent data leakage).

---

## 2. Quantitative Evaluation & Results

All models were evaluated on the exact same unseen holdout test split of **797 vehicles** (20% split, `random_state=42`):

| Model | MAE ($) ↓ | RMSE ($) ↓ | R² ↑ | MAPE (%) ↓ |
| :--- | :---: | :---: | :---: | :---: |
| **Dummy Baseline (Training Mean)** | $24,161.53 | $36,300.91 | -0.0013 | 124.04% |
| **Simple Linear Regression (Mileage)** | $19,425.80 | $30,556.03 | 0.2906 | 81.38% |
| **Ridge Regression (L2 Regularized)** | $17,658.43 | $29,139.80 | 0.3548 | 67.45% |
| **Random Forest Regressor** | $14,745.80 | **$26,576.84** | **0.4633** | 46.17% |
| **★ XGBoost Regressor (Best MAE)** | **$14,512.50** | $27,046.53 | 0.4442 | **43.44%** |

### Statistical Uncertainty (Bootstrap 95% Confidence Intervals)
Computed via 2,000 bootstrap resamples on the test set (`seed=42`):
* **XGBoost Test MAE 95% CI:** `[$13,009.41, $16,168.28]`
* **Random Forest Test MAE 95% CI:** `[$13,330.08, $16,355.04]`
* **Interpretation:** Because the 95% confidence intervals heavily overlap, the two tree ensembles **cannot be clearly separated** statistically on this test sample. Random Forest edges ahead on RMSE and R², while XGBoost performs slightly better on MAE and MAPE.

### Performance by Price Segment (XGBoost)
* **Under $20k** (n=262): MAE = $6,002.3 | Median Error = 33.1%
* **$20k–$40k** (n=246): MAE = $12,290.9 | Median Error = 29.1%
* **$40k–$75k** (n=206): MAE = $15,376.5 | Median Error = 20.7%
* **Above $75k** (n=83): MAE = $45,816.1 | Median Error = 33.0%
* *Weighted Average Test MAE:* Exact check $(262 \times 6002.3 + 246 \times 12290.9 + 206 \times 15376.5 + 83 \times 45816.1) / 797 = \$14,512.50$.

---

## 3. Repository & Folder Structure

```
Used-car-price-project/
├── index.html                   # Complete 14-section project website
├── style.css                    # Responsive styling (clean palette, mobile-friendly)
├── app.js                       # Valuation calculator & dynamic test explorer
├── requirements.txt             # Python dependencies for reproduction
├── README.md                    # Project documentation & runbook
│
├── assets/                      # Generated figures embedded on site
│   ├── eda_distributions.png    # Figure 1: Target distribution & mileage decay
│   ├── feature_importance.png   # Figure 2: Gini impurity predictor rankings
│   └── residuals_plot.png       # Figure 3: Residual error vs. predicted values
│
├── notebook/                    # Executable machine learning code
│   └── Used_Car_Price_Prediction.ipynb  # Full data pipeline & training with outputs
│
└── results/                     # Saved model artifacts & predictions
    ├── test_predictions.json    # Holdout test predictions powering interactive explorer
    ├── test_predictions.csv     # Tabular test output with errors and segments
    └── metrics_table.csv        # Full comparative performance metrics
```

---

## 4. Setup, Installation & Reproduction Steps

Follow these steps to reproduce the exact results locally from scratch:

### 1. Clone the Repository
```bash
git clone https://github.com/gouruprakarsha-pixel/Used-car-price-project.git
cd Used-car-price-project
```

### 2. Environment Setup
Recommended Python version: 3.10+
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Data Access
1. Download the dataset from Kaggle: [Taeef Najib: Used Car Price Prediction Dataset](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset) (scraped from Cars.com).
2. Place the raw CSV as `used_cars.csv` in the root repository directory (or inside `notebook/`).

### 4. Execute the Pipeline
Launch Jupyter Notebook or Google Colab:
```bash
jupyter notebook notebook/Used_Car_Price_Prediction.ipynb
```
Run all cells top-to-bottom. The script will:
* Clean strings (stripping `$`, `,`, `mi.`) and drop 26 placeholder/missing rows ($4,009 \rightarrow 3,983$).
* Split into 80% train ($n=3,186$) and 20% test ($n=797$) with `random_state=42`.
* Fit all transformers (`StandardScaler`, `OneHotEncoder`) solely on the training partition.
* Train Dummy, Simple Linear, Ridge, Random Forest, and XGBoost models.
* Export figures to `assets/` and serialized predictions to `results/test_predictions.json`.

---

## 5. Preprocessing & Data Leakage Prevention

* **Strict Train-Test Partition:** The 80/20 train/test split was performed **before** any feature engineering or scaling was applied.
* **Leakage Safeguards:** Feature transformers were fit strictly on the 3,186 training records. Test data was transformed using training statistics only (means, standard deviations, categorical bins).
* **Missing & Outlier Handling:**
  * Rows with target asking prices below $1,000 or missing values were removed ($26$ rows).
  * High-value luxury listings above $200k were preserved to avoid artificial target trimming, but are diagnosed as major error drivers.
  * No imputation was used.
  * Deduplication was checked and resolved prior to splitting.

---

## 6. Documented Changes from Original Proposal

1. **Baseline Metric:** Implemented as the training **mean** (proposal indicated median) to align with standard MSE/L2 optimality.
2. **Log Transformation:** Raw dollar values were retained throughout to preserve direct financial interpretability. High RMSE indicates severe high-end variance that future work could address via log-price modeling.
3. **Dropped Columns:** `engine`, `model`, `ext_col`, `int_col`, and `clean_title` were omitted due to high-cardinality unstructured text, missingness, or lack of standardized nomenclature.
4. **Interactive Valuation Tool:** Section 7's calculator is clearly documented as a **heuristic illustration** of empirical depreciation dynamics, while the accompanying **Test Set Explorer** displays actual holdout test outputs from the trained XGBoost model.
5. **Feature Importance:** Gini impurity importance from Random Forest was utilized in place of SHAP for robust, lightweight deployment.

---

## 7. Key Findings & Limitations

### Findings
1. **Odometer mileage alone** accounts for **29.06%** of market price variation, verifying usage wear as the single most critical baseline indicator.
2. Non-linear tree ensembles capture depreciation curves substantially better than linear models, cutting average error by approximately **40%** relative to the baseline.
3. **The "Other" Brand Effect:** 4 of the 5 worst individual model predictions fell into the "Other" manufacturer category. Collapsing low-volume, ultra-luxury manufacturers (e.g., bespoke supercars, vintage collector vehicles) into a catch-all group obscures severe price signals and drives large residuals.

### Limitations
* **Market Snapshot:** Dataset is cross-sectional asking prices from Cars.com (USD) and does not record final negotiated transaction amounts or recent inflation dynamics.
* **Unobserved Confounders:** Physical mechanical wear, full vehicle options/packages, battery state-of-health, and interior condition are absent from tabular listings.
* **Generalization Bounds:** Evaluated on a single seeded split ($n=797$ test cases); overlapping bootstrap intervals show RF and XGBoost are practically tied.

---

## 8. AI Tools & Contribution Disclosure

In accordance with course academic integrity guidelines:
* **Google Gemini:** Utilized for drafting responsive HTML/CSS layouts and page structure scaffolding.
* **ChatGPT:** Utilized for syntax validation and structuring the scikit-learn pipeline boilerplate.
* **Claude:** Utilized for copy-editing prose, text polishing, and refining technical explanations.
* **Human Responsibility:** All model training runs, hyperparameter evaluation, statistical sanity checks, metric verification, and interpretation of results were independently executed and verified by Gouru Prakarsha.

---

## 9. References

1. Najib, T. (2024). *Used Car Price Prediction Dataset*, Kaggle (sourced from Cars.com). [Dataset URL](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset)
2. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, 2825–2830.
3. Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. *Proc. 22nd ACM SIGKDD International Conference*, 785–794.