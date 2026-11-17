// ================================================================
// ES 335: Interactive Test Predictions Explorer & Valuation Tool
// ================================================================

let allTestPredictions = [];

document.addEventListener("DOMContentLoaded", () => {
  updateValuation();
  loadTestPredictions();
});

// 1. Interactive Holdout Test Predictions Explorer
async function loadTestPredictions() {
  const statusMsg = document.getElementById("table-status-msg");
  try {
    const res = await fetch("results/test_predictions.json");
    if (!res.ok) throw new Error("Local HTTP Fetch Failed");
    allTestPredictions = await res.json();
    renderPredictionsTable(allTestPredictions, "all");
  } catch (err) {
    if (statusMsg) {
      statusMsg.innerHTML = `<span style="color:#b45309;">Notice: Viewing embedded holdout sample records. (Full 797 records load via GitHub Pages/web server).</span>`;
    }
    // Reliable representative test subset
    allTestPredictions = [
      {"brand_clean":"Ford","car_age":18,"milage":64500,"band":"<20k","y":16000,"p":18887.2,"err":-2887.2,"abs_err":2887.2,"pct_err":18.0},
      {"brand_clean":"BMW","car_age":10,"milage":74850,"band":"20-40k","y":21900,"p":25155.5,"err":-3255.5,"abs_err":3255.5,"pct_err":14.9},
      {"brand_clean":"Porsche","car_age":4,"milage":4700,"band":">75k","y":134000,"p":150581.2,"err":-16581.2,"abs_err":16581.2,"pct_err":12.4},
      {"brand_clean":"Mercedes-Benz","car_age":6,"milage":48000,"band":"40-75k","y":49995,"p":93523.1,"err":-43528.1,"abs_err":43528.1,"pct_err":87.1},
      {"brand_clean":"RAM","car_age":8,"milage":67865,"band":"20-40k","y":36500,"p":35537.6,"err":962.4,"abs_err":962.4,"pct_err":2.6},
      {"brand_clean":"Toyota","car_age":7,"milage":91843,"band":"20-40k","y":30500,"p":31976.7,"err":-1476.7,"abs_err":1476.7,"pct_err":4.8},
      {"brand_clean":"GMC","car_age":7,"milage":65212,"band":"40-75k","y":42995,"p":37141.6,"err":5853.4,"abs_err":5853.4,"pct_err":13.6},
      {"brand_clean":"Chevrolet","car_age":17,"milage":139000,"band":"<20k","y":14500,"p":10842.8,"err":3657.2,"abs_err":3657.2,"pct_err":25.2},
      {"brand_clean":"Lexus","car_age":9,"milage":73948,"band":"20-40k","y":31990,"p":29549.7,"err":2440.3,"abs_err":2440.3,"pct_err":7.6},
      {"brand_clean":"Nissan","car_age":9,"milage":187141,"band":"<20k","y":16995,"p":16539.3,"err":455.7,"abs_err":455.7,"pct_err":2.7}
    ];
    renderPredictionsTable(allTestPredictions, "all");
  }
}

function filterTestPredictions(band) {
  const buttons = document.querySelectorAll(".preset-row .btn-preset");
  buttons.forEach(btn => btn.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");

  const filtered = band === "all" ? allTestPredictions : allTestPredictions.filter(d => d.band === band);
  renderPredictionsTable(filtered, band);
}

function renderPredictionsTable(data, band) {
  const tbody = document.getElementById("test-table-body");
  const statusMsg = document.getElementById("table-status-msg");
  if (!tbody) return;

  const totalCount = data.length;
  const displayLimit = Math.min(50, totalCount);
  if (statusMsg && !statusMsg.innerHTML.includes("Notice:")) {
    statusMsg.textContent = `Showing first ${displayLimit} of ${totalCount} cars in this segment (sorted by actual price):`;
  }

  tbody.innerHTML = "";
  if (totalCount === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#888;">No records found for this segment.</td></tr>`;
    return;
  }

  const sortedData = [...data].sort((a, b) => b.y - a.y).slice(0, displayLimit);

  sortedData.forEach(row => {
    const signedErr = Math.round(row.err !== undefined ? row.err : (row.y - row.p));
    const errSign = signedErr >= 0 ? `+$${signedErr.toLocaleString('en-US')}` : `-$${Math.abs(signedErr).toLocaleString('en-US')}`;
    const errClass = signedErr >= 0 ? "style='color:#16a34a; font-weight:500;'" : "style='color:#dc2626; font-weight:500;'";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.brand_clean}</strong></td>
      <td>${row.car_age} yrs</td>
      <td>${Math.round(row.milage).toLocaleString('en-US')} mi</td>
      <td>$${Math.round(row.y).toLocaleString('en-US')}</td>
      <td>$${Math.round(row.p).toLocaleString('en-US')}</td>
      <td ${errClass}>${errSign}</td>
      <td>$${Math.round(row.abs_err).toLocaleString('en-US')}</td>
      <td>${row.pct_err.toFixed(1)}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// 2. Heuristic Depreciation Tool
function updateValuation() {
  const brand = document.getElementById("v_brand").value;
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
  document.getElementById("meter_bar").style.left = `20%`;
  document.getElementById("meter_bar").style.width = `40%`;
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