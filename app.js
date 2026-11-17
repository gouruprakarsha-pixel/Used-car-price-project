// ================================================================
// ES 335: Interactive Valuation Calculator & Test Set Explorer
// ================================================================

let allTestPredictions = [
  {"brand_clean":"Ford","car_age":18,"milage":64500,"band":"<20k","y":16000,"p":18887.2,"abs_err":2887.2,"pct_err":18.0},
  {"brand_clean":"BMW","car_age":10,"milage":74850,"band":"20-40k","y":21900,"p":25155.5,"abs_err":3255.5,"pct_err":14.9},
  {"brand_clean":"Porsche","car_age":4,"milage":4700,"band":">75k","y":134000,"p":150581.2,"abs_err":16581.2,"pct_err":12.4},
  {"brand_clean":"Mercedes-Benz","car_age":6,"milage":48000,"band":"40-75k","y":49995,"p":93523.1,"abs_err":43528.1,"pct_err":87.1},
  {"brand_clean":"RAM","car_age":8,"milage":67865,"band":"20-40k","y":36500,"p":35537.6,"abs_err":962.4,"pct_err":2.6},
  {"brand_clean":"Toyota","car_age":7,"milage":91843,"band":"20-40k","y":30500,"p":31976.7,"abs_err":1476.7,"pct_err":4.8},
  {"brand_clean":"GMC","car_age":7,"milage":65212,"band":"40-75k","y":42995,"p":37141.6,"abs_err":5853.4,"pct_err":13.6},
  {"brand_clean":"Chevrolet","car_age":17,"milage":139000,"band":"<20k","y":14500,"p":10842.8,"abs_err":3657.2,"pct_err":25.2},
  {"brand_clean":"Lexus","car_age":9,"milage":73948,"band":"20-40k","y":31990,"p":29549.7,"abs_err":2440.3,"pct_err":7.6},
  {"brand_clean":"Nissan","car_age":9,"milage":187141,"band":"<20k","y":16995,"p":16539.3,"abs_err":455.7,"pct_err":2.7}
];

document.addEventListener("DOMContentLoaded", () => {
  updateValuation();
  renderPredictionsTable(allTestPredictions, "all");
  loadFullPredictions();
});

// 1. Interactive Money Predictor Calculator
function updateValuation() {
  const brandElem = document.getElementById("v_brand");
  if (!brandElem) return;

  const brand = brandElem.value;
  const age = parseInt(document.getElementById("v_age").value);
  const miles = parseInt(document.getElementById("v_miles").value);
  const hasAccident = document.getElementById("v_accident").value === "1";
  const fuel = document.getElementById("v_fuel").value;
  const trans = document.getElementById("v_trans").value;

  document.getElementById("disp_age").textContent = `${age} yrs`;
  document.getElementById("disp_miles").textContent = `${miles.toLocaleString('en-US')} mi`;

  let basePrice = 28000;
  if (brand === "mid") basePrice = 48000;
  if (brand === "luxury") basePrice = 75000;

  const depRate = brand === "luxury" ? 0.098 : 0.076;
  const ageLoss = basePrice * (1 - Math.pow(1 - depRate, age));
  const mileageLoss = miles * 0.082;
  const accidentLoss = hasAccident ? (basePrice - ageLoss) * 0.12 : 0;

  let powertrainMod = 0;
  if (trans === "auto") powertrainMod += 600;
  if (fuel === "hybrid") powertrainMod += 1500;
  if (fuel === "electric") powertrainMod += 2200;
  if (fuel === "diesel") powertrainMod -= 400;

  let estimated = basePrice - ageLoss - mileageLoss - accidentLoss + powertrainMod;
  estimated = Math.max(1800, Math.round(estimated / 50) * 50);

  document.getElementById("calc_price").textContent = `$${estimated.toLocaleString('en-US')}`;
  document.getElementById("bd_base").textContent = `$${basePrice.toLocaleString('en-US')}`;
  document.getElementById("bd_age").textContent = `-$${Math.round(ageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_miles").textContent = `-$${Math.round(mileageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_acc").textContent = accidentLoss > 0 ? `-$${Math.round(accidentLoss).toLocaleString('en-US')}` : "$0";

  const ptElem = document.getElementById("bd_powertrain");
  if (powertrainMod >= 0) {
    ptElem.textContent = `+$${powertrainMod.toLocaleString('en-US')}`;
    ptElem.parentElement.className = "breakdown-row green-text";
  } else {
    ptElem.textContent = `-$${Math.abs(powertrainMod).toLocaleString('en-US')}`;
    ptElem.parentElement.className = "breakdown-row red-text";
  }

  const dotPct = Math.min(98, Math.max(2, ((estimated - 2000) / 98000) * 100));
  const meterDot = document.getElementById("meter_dot");
  if (meterDot) meterDot.style.left = `calc(${dotPct}% - 2px)`;
}

function loadPreset(type) {
  if (type === "commuter") {
    document.getElementById("v_brand").value = "economy";
    document.getElementById("v_age").value = 4;
    document.getElementById("v_miles").value = 35000;
    document.getElementById("v_accident").value = "0";
    document.getElementById("v_fuel").value = "gas";
    document.getElementById("v_trans").value = "auto";
  } else if (type === "fleet") {
    document.getElementById("v_brand").value = "mid";
    document.getElementById("v_age").value = 7;
    document.getElementById("v_miles").value = 115000;
    document.getElementById("v_accident").value = "1";
    document.getElementById("v_fuel").value = "diesel";
    document.getElementById("v_trans").value = "auto";
  } else if (type === "luxury") {
    document.getElementById("v_brand").value = "luxury";
    document.getElementById("v_age").value = 3;
    document.getElementById("v_miles").value = 22000;
    document.getElementById("v_accident").value = "0";
    document.getElementById("v_fuel").value = "hybrid";
    document.getElementById("v_trans").value = "auto";
  }
  updateValuation();
}

// 2. Interactive Predictions Table
async function loadFullPredictions() {
  try {
    const res = await fetch("results/test_predictions.json");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allTestPredictions = data;
        renderPredictionsTable(allTestPredictions, "all");
      }
    }
  } catch (e) {
    console.log("Using embedded test data.");
  }
}

function filterTestPredictions(band) {
  const buttons = document.querySelectorAll("#explorer-btns .btn-preset");
  buttons.forEach(btn => btn.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");

  const filtered = band === "all" ? allTestPredictions : allTestPredictions.filter(item => item.band === band);
  renderPredictionsTable(filtered, band);
}

function renderPredictionsTable(data, band) {
  const tbody = document.getElementById("test-table-body");
  const statusMsg = document.getElementById("table-status-msg");
  if (!tbody) return;

  const count = data.length;
  const limit = Math.min(50, count);

  if (statusMsg) {
    statusMsg.textContent = `Showing ${limit} of ${count} test vehicles in this segment:`;
  }

  tbody.innerHTML = "";
  if (count === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:16px; color:#888;">No records found.</td></tr>`;
    return;
  }

  data.slice(0, limit).forEach(row => {
    const actual = Math.round(row.y);
    const pred = Math.round(row.p);
    const signedErr = actual - pred;
    const absErr = Math.abs(signedErr);
    const pctErr = row.pct_err !== undefined ? row.pct_err.toFixed(1) : ((absErr / (actual || 1)) * 100).toFixed(1);

    const signText = signedErr >= 0 ? `+$${signedErr.toLocaleString('en-US')}` : `-$${Math.abs(signedErr).toLocaleString('en-US')}`;
    const signColor = signedErr >= 0 ? "#16a34a" : "#dc2626";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.brand_clean || "Other"}</strong></td>
      <td>${row.car_age} yrs</td>
      <td>${Math.round(row.milage).toLocaleString('en-US')} mi</td>
      <td>$${actual.toLocaleString('en-US')}</td>
      <td>$${pred.toLocaleString('en-US')}</td>
      <td style="color:${signColor}; font-weight:600;">${signText}</td>
      <td>$${absErr.toLocaleString('en-US')}</td>
      <td>${pctErr}%</td>
    `;
    tbody.appendChild(tr);
  });
}
