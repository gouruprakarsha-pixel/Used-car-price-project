# Used Car Price Prediction Using Machine Learning
**Course:** ES 335 · Machine Learning (Undergraduate Track)  
**Author:** Gouru Prakarsha (Roll No: 25110121)  
**Institution:** Indian Institute of Technology Gandhinagar  

🌐 **Live Project Website:** [https://gouruprakarsha-pixel.github.io/Used-car-price-project/](https://gouruprakarsha-pixel.github.io/Used-car-price-project/)  
📂 **Source Code Repository:** [https://github.com/gouruprakarsha-pixel/Used-car-price-project](https://github.com/gouruprakarsha-pixel/Used-car-price-project)

---

## 1. Project Overview & Scope
This project formulates used car valuation as a continuous supervised regression task using secondary vehicle marketplace listings. It examines how observable pre-purchase vehicle attributes (brand prestige tier, odometer mileage, vehicle age, fuel type, transmission, and accident history) predict fair market prices under strict zero-leakage validation protocols.

## 2. Dataset Access & Quality Checks
- **Source:** [Taeef Najib: Used Car Price Prediction Dataset (Kaggle)](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset)
- **Unit of Observation:** A single used car advertisement listed on an online resale platform.
- **Observations:** 4,009 raw records cleaned to 3,983 valid entries after string cleaning, removing currency symbols, mileage suffixes, and filtering non-viable target outliers ($< \$1,000$).
- **Partition:** 80% Training set (3,186 samples) and 20% Holdout Test set (797 samples), split strictly *before* fitting preprocessors.

## 3. Empirical Results Summary
Evaluated on the identical 797 unseen holdout test vehicles:

| Model Candidate | MAE ($) ↓ | RMSE ($) ↓ | R² Score ↑ | MAPE (%) ↓ |
| :--- | :--- | :--- | :--- | :--- |
| Dummy Baseline (Mean) | $24,161.53 | $36,300.91 | -0.0013 | 124.04% |
| Simple Linear (Mileage only) | $19,425.80 | $30,556.03 | 0.2906 | 81.38% |
| Ridge Regression (L2) | $17,658.43 | $29,139.80 | 0.3548 | 67.45% |
| Random Forest Regressor | $14,745.80 | **$26,576.84** | **0.4633** | 46.17% |
| **XGBoost Regressor (Best)** | **$14,512.50** | $27,046.53 | 0.4442 | **43.44%** |

## 4. Setup & Reproduction Steps
To reproduce all experiments, data processing, and figures:

1. Clone this repository:
   ```bash
   git clone https://github.com/gouruprakarsha-pixel/Used-car-price-project.git
   cd Used-car-price-project
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the complete training notebook:
   Open and execute `notebook/Used_Car_Price_Prediction.ipynb` in Jupyter Notebook or Google Colab.

## 5. Repository Structure
```text
Used-car-price-project/
├── index.html              # Main live interactive website
├── style.css               # Clean aesthetic cream/white styling
├── app.js                  # Client-side valuation calculator & scale meter
├── assets/
│   ├── eda_distributions.png     # Exploratory distribution figures
│   ├── feature_importance.png    # Top Gini split feature importances
│   └── residuals_plot.png        # Test set residual error diagnosis
├── notebook/
│   └── Used_Car_Price_Prediction.ipynb   # Full reproducible pipeline
├── requirements.txt        # Python dependency specifications
└── README.md               # Reproduction steps and disclosures
```

## 6. AI-Use Disclosure
In compliance with the course project guidelines, generative AI tools were used for initial script scaffolding, HTML/CSS layout drafting, and text polishing. All data cleaning strategies, feature engineering logic, validation partitioning, model training, and analytical interpretations were conceived, verified, and defended independently by the author.

## 7. Citations & References
1. Najib, T. (2024). *Used Car Price Prediction Dataset*, Kaggle.
2. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, 2825–2830.
3. Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. In *Proceedings of the 22nd ACM SIGKDD International Conference* (pp. 785–794).