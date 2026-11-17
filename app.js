// ================================================================
// ES 335: Used Car Valuation Calculator & Presets Engine
// Pure client-side inference with non-linear depreciation curves
// ================================================================

function updateValuation() {
  const brand = document.getElementById("v_brand").value;
  const age = parseInt(document.getElementById("v_age").value);
  const miles = parseInt(document.getElementById("v_miles").value);
  const hasAccident = document.getElementById("v_accident").value === "1";
  const fuel = document.getElementById("v_fuel").value;
  const trans = document.getElementById("v_trans").value;

  // Use standard US formatting for automotive mileage (e.g. 200,000 mi)
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

  const lowBound = Math.max(1000, Math.round(estimated * 0.75));
  const highBound = Math.round(estimated * 1.25);

  document.getElementById("calc_price").textContent = `$${estimated.toLocaleString('en-US')}`;
  document.getElementById("calc_range").textContent = `90% Confidence Interval: $${lowBound.toLocaleString('en-US')} to $${highBound.toLocaleString('en-US')}`;

  document.getElementById("bd_base").textContent = `$${basePrice.toLocaleString('en-US')}`;
  document.getElementById("bd_age").textContent = `-$${Math.round(ageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_miles").textContent = `-$${Math.round(mileageLoss).toLocaleString('en-US')}`;
  document.getElementById("bd_acc").textContent = accidentLoss > 0 ? `-$${Math.round(accidentLoss).toLocaleString('en-US')}` : "$0";
  
  // Format powertrain modifier cleanly with sign in front of dollar sign (+$600 or -$400)
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

document.addEventListener("DOMContentLoaded", () => {
  updateValuation();
});