# Used Car Price Prediction Using Machine Learning
**Course:** ES 335 (Undergraduate Project Deliverable)  
**Author:** Gouru Prakarsha (Roll No: 25110121)  
**Live Website:** https://gouruprakarsha-pixel.github.io/used-car-price-project/

---

## 1. Project Overview & Scope
This project formulates used car valuation as a supervised regression task on secondary vehicle marketplace listings. It examines how well pre-purchase vehicle attributes (brand tier, mileage, age, fuel type, transmission, and accident history) predict sale prices while enforcing strict no-leakage validation protocols.

## 2. Dataset
- **Source:** [Taeef Najib: Used Car Price Prediction Dataset (Kaggle)](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset)
- **Observations:** 4,009 raw listings, cleaned to 3,983 valid entries.
- **Holdout Test Set:** 797 samples (20%) strictly isolated prior to fitting scalers and encoders.

## 3. Results Summary
| Model | MAE ($) | RMSE ($) | R² Score | MAPE (%) |
| :--- | :--- | :--- | :--- | :--- |
| Dummy Baseline (Mean) | $24,161.53 | $36,300.91 | -0.0013 | 124.04% |
| Simple Linear (Mileage only) | $19,425.80 | $30,556.03 | 0.2906 | 81.38% |
| Ridge Regression (L2) | $17,658.43 | $29,139.80 | 0.3548 | 67.45% |
| Random Forest Regressor | $14,745.80 | $26,576.84 | 0.4633 | 46.17% |
| **XGBoost Regressor (Best)** | **$14,512.50** | $27,046.53 | 0.4442 | **43.44%** |

## 4. Reproduction Steps
1. Clone repository:
   ```bash
   git clone https://github.com/gouruprakarsha-pixel/used-car-price-project.git
   cd used-car-price-project
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the notebook in `notebook/Used_Car_Price_Prediction.ipynb`.

## 5. AI-Use Disclosure
Generative AI tools were used for initial script scaffolding, HTML/CSS layout drafting, and text polishing. All preprocessing, model evaluation, validation splits, and analytical interpretations were implemented and verified independently by the author.