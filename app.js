// ================================================================
// ES 335: Used Car Valuation Calculator & Test Predictions Explorer
// ================================================================

let allTestPredictions = [];

document.addEventListener("DOMContentLoaded", () => {
  updateValuation();
  loadTestPredictions();
});

// 1. Valuation Calculator
function updateValuation() {
  const brand = document.getElementById("v_brand").value;
  const age = parseInt(document.getElementById("v_age").value);
  const miles = parseInt(document.getElementById("v_miles").value);
  const hasAccident = document.getElementById("v_accident").value === "1";
  const fuel = document.getElementById("v_fuel").value;
  const trans = document.getElementById("v_trans").value;

  document.getElementById("disp_age").textContent = `${age} yrs`;
  document.getElementById("disp_miles").textContent = `${miles.toLocaleString('en-US')} mi`;

  let basePrice = 34000;
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

  // 5th to 95th percentile residual span (-$28,985 to +$35,179)
  const lowBound = Math.max(1000, Math.round(estimated - 28985));
  const highBound = Math.round(estimated + 35179);

  document.getElementById("calc_price").textContent = `$${estimated.toLocaleString('en-US')}`;
  document.getElementById("calc_range").textContent = `Typical residual range (5th–95th percentile): -$28,985 to +$35,179`;

  document.getElementById("bd_base").textContent = `$${basePrice.toLocaleString('en-US')}`;
  document.getElementById("bd_age").textContent = `-$${Math.round(ageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_miles").textContent = `-$${Math.round(mileageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_acc").textContent = accidentLoss > 0 ? `-$${Math.round(accidentLoss).toLocaleString('en-US')}` : "$0";
  
  if (powertrainMod >= 0) {
    document.getElementById("bd_powertrain").textContent = `+$${powertrainMod.toLocaleString('en-US')}`;
    document.getElementById("bd_powertrain").parentElement.className = "breakdown-row green-text";
  } else {
    document.getElementById("bd_powertrain").textContent = `-$${Math.abs(powertrainMod).toLocaleString('en-US')}`;
    document.getElementById("bd_powertrain").parentElement.className = "breakdown-row red-text";
  }

  const leftPct = Math.min(95, Math.max(0, ((lowBound - 2000) / 98000) * 100));
  const rightPct = Math.min(100, Math.max(5, ((highBound - 2000) / 98000) * 100));
  const dotPct = Math.min(98, Math.max(2, ((estimated - 2000) / 98000) * 100));

  document.getElementById("meter_bar").style.left = `${leftPct}%`;
  document.getElementById("meter_bar").style.width = `${Math.max(4, rightPct - leftPct)}%`;
  document.getElementById("meter_dot").style.left = `calc(${dotPct}% - 2px)`;
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

// 2. Second Interaction: Interactive Test Predictions Explorer
async function loadTestPredictions() {
  try {
    const res = await fetch("results/test_predictions.json");
    if (!res.ok) throw new Error("Local load fallback");
    allTestPredictions = await res.json();
    renderPredictionsTable(allTestPredictions);
  } catch (err) {
    // Embedded sample fallback if loaded locally via file://
    allTestPredictions = [
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
    renderPredictionsTable(allTestPredictions);
  }
}

function filterTestPredictions(band) {
  const buttons = document.querySelectorAll(".preset-row .btn-preset");
  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (band === "all") {
    renderPredictionsTable(allTestPredictions);
  } else {
    const filtered = allTestPredictions.filter(item => item.band === band);
    renderPredictionsTable(filtered);
  }
}

function renderPredictionsTable(data) {
  const tbody = document.getElementById("test-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const displayData = data.slice(0, 50); // Fast smooth rendering for 50 rows
  displayData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.brand_clean}</td>
      <td>${row.car_age} yrs</td>
      <td>${Math.round(row.milage).toLocaleString('en-US')}</td>
      <td>$${Math.round(row.y).toLocaleString('en-US')}</td>
      <td>$${Math.round(row.p).toLocaleString('en-US')}</td>
      <td>$${Math.round(row.abs_err).toLocaleString('en-US')}</td>
      <td>${row.pct_err.toFixed(1)}%</td>
    `;
    tbody.appendChild(tr);
  });
}