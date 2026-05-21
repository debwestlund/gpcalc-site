// Sulfree H₂S Dosage Calculator — runs entirely in the browser
document.getElementById('sulfreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('.btn-calculate');
  submitBtn.textContent = 'Calculating...';
  submitBtn.disabled = true;

  const waterVolume = parseFloat(document.getElementById('waterVolume').value);
  const h2sPpm = parseFloat(document.getElementById('h2sPpm').value);
  const productPct = parseFloat(document.getElementById('productPercentage').value);
  const unit = document.getElementById('unit').value;

  if (isNaN(waterVolume) || isNaN(h2sPpm) || isNaN(productPct)) {
    alert('Please fill in all fields with valid numbers.');
    resetBtn();
    return;
  }
  if (waterVolume <= 0 || h2sPpm <= 0 || productPct <= 0) {
    alert('All values must be greater than zero.');
    resetBtn();
    return;
  }
  if (productPct > 100) {
    alert('Product percentage cannot exceed 100%.');
    resetBtn();
    return;
  }

  // Convert liters→gallons internally
  let vGal = unit === 'liters' ? waterVolume * 0.264172 : waterVolume;

  // Step 1: H₂S mass = volume × PPM ÷ 1,000,000
  const h2sGal = vGal * (h2sPpm / 1000000);
  // Step 2: Concentrate = H₂S × 5 (5:1 ratio)
  const concGal = h2sGal * 5;
  // Step 3: Product = concentrate ÷ (pct ÷ 100)
  const prodGal = concGal / (productPct / 100);

  // Convert back if user entered liters
  if (unit === 'liters') {
    var h2sOut = h2sGal / 0.264172;
    var concOut = concGal / 0.264172;
    var prodOut = prodGal / 0.264172;
  } else {
    var h2sOut = h2sGal;
    var concOut = concGal;
    var prodOut = prodGal;
  }

  document.getElementById('resultH2S').textContent = fmt(h2sOut);
  document.getElementById('resultConcentrate').textContent = fmt(concOut);
  document.getElementById('resultProduct').textContent = fmt(prodOut);

  var uLabel = unit === 'liters' ? 'liters' : 'gallons/lbs';
  document.getElementById('resultH2SUnit').textContent = uLabel;
  document.getElementById('resultConcentrateUnit').textContent = uLabel;
  document.getElementById('resultProductUnit').textContent = uLabel;

  // Step-by-step breakdown
  var steps = document.getElementById('calcSteps');
  steps.innerHTML =
    '<div class="steps-box">' +
    '<p class="steps-title"><strong>How it works:</strong></p>' +
    '<ol class="steps-list">' +
    '<li><strong>Step 1 — H₂S mass:</strong> ' + fmt(vGal) + ' ' + (unit === 'liters' ? 'gallons' : 'gal') +
    ' × (' + h2sPpm + ' PPM ÷ 1,000,000) = <strong>' + fmt(h2sGal) + '</strong> gallons of H₂S</li>' +
    '<li><strong>Step 2 — Concentrate (5:1):</strong> ' + fmt(h2sGal) + ' × 5 = <strong>' + fmt(concGal) + '</strong> gallons concentrate needed</li>' +
    '<li><strong>Step 3 — Product dose:</strong> ' + fmt(concGal) + ' ÷ ' + (productPct / 100) +
    ' (' + productPct + '% strength) = <strong>' + fmt(prodGal) + '</strong> gallons/lbs Sulfree product</li>' +
    '</ol></div>';

  document.getElementById('resultsPanel').style.display = 'block';
  document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  resetBtn();
});

function resetBtn() {
  var btn = document.querySelector('.btn-calculate');
  btn.textContent = 'Calculate Dosage';
  btn.disabled = false;
}

function fmt(n) {
  if (n === 0) return '0';
  if (n < 0.0001) return n.toExponential(3);
  if (n < 1) return n.toFixed(6);
  if (n < 10) return n.toFixed(3);
  if (n < 1000) return n.toFixed(2);
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
