# Used Car Price Prediction Using Machine Learning
**Course:** ES 335 · Machine Learning (Undergraduate Track)  
**Author:** Gouru Prakarsha (Roll No: 25110121)  
**Institution:** Indian Institute of Technology Gandhinagar  

🌐 **Live Project Website:** [https://gouruprakarsha-pixel.github.io/Used-car-price-project/](https://gouruprakarsha-pixel.github.io/Used-car-price-project/)  
📂 **Source Code Repository:** [https://github.com/gouruprakarsha-pixel/Used-car-price-project](https://github.com/gouruprakarsha-pixel/Used-car-price-project)

---

## 1. Project Overview & Scope
This project formulates used car valuation as a continuous supervised regression task on secondary vehicle marketplace listings. It examines how observable pre-purchase vehicle attributes (brand prestige tier, odometer mileage, vehicle age, fuel type, transmission, and accident history) predict fair market prices under strict validation protocols where all preprocessors are fitted on training data only.

## 2. Data Access
1. Download `used_cars.csv` from [Taeef Najib: Used Car Price Prediction Dataset (Kaggle)](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset) (subject to Kaggle's terms; listings originate from Cars.com). Accessed November 2026.
2. Place it at `data/used_cars.csv` (not committed). Notebook expects this path.
3. Cleaned dataset contains 3,983 valid observations (26 dropped due to prices < $1,000 or missing values).

## 3. Empirical Results Summary
Evaluated on the identical 797 unseen holdout test vehicles:

| Model Candidate | MAE ($) ↓ | RMSE ($) ↓ | R² Score ↑ | MAPE (%) ↓ |
| :--- | :--- | :--- | :--- | :--- |
| Dummy Baseline (Mean) | $24,161.53 | $36,300.91 | -0.0013 | 124.04% |
| Simple Linear (Mileage only) | $19,425.80 | $30,556.03 | 0.2906 | 81.38% |
| Ridge Regression (L2) | $17,658.43 | $29,139.80 | 0.3548 | 67.45% |
| Random Forest Regressor | $14,745.80 | **$26,576.84** | **0.4633** | 46.17% |
| **XGBoost Regressor (Best)** | **$14,512.50** | $27,046.53 | 0.4442 | **43.44%** |

- **95% Bootstrap CI on Test MAE:** XGBoost [$13,009.41, $16,168.28] vs. Random Forest [$13,330.08, $16,355.04] (overlapping intervals).

## 4. Reproducibility
- **Split:** 80/20 train/test split, `random_state=42`, performed before any fitting.
- **Tuning:** 5-fold cross-validation on 3,186 training cars only. Test set evaluated strictly once.
- **Outputs saved in `results/`:** `test_predictions.json` (used by live site explorer).
- **Environment:** Python 3.10+; pinned in `requirements.txt`.

## 5. AI-Use Disclosure
Generative AI assistance (Claude, ChatGPT, Gemini) was used for initial script scaffolding, HTML/CSS drafting, and editorial text polishing. Preprocessing, data splits, model training, and analytical interpretations were conceived, verified, and defended independently by the author.

## 6. Citations & References
1. Najib, T. (2024). *Used Car Price Prediction Dataset*, Kaggle.
2. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *Journal of Machine Learning Research*, 12, 2825–2830.
3. Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. In *Proceedings of the 22nd ACM SIGKDD International Conference* (pp. 785–794).