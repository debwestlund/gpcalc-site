// Update product percentage label when dropdown changes
function updateProductPercent() {
  var sel = document.getElementById('productSelect');
  var pct = sel.value;
  var name = sel.options[sel.selectedIndex].text;
  document.getElementById('productHelp').textContent = 'Concentration: ' + pct + '%';
}

document.getElementById('productSelect').addEventListener('change', function() {
  updateProductPercent();
});

// Unit toggle - update price label
document.getElementById('unit').addEventListener('change', function() {
  var unitLabel = this.value === 'liters' ? 'liter' : 'gallon';
  document.getElementById('priceUnitLabel').textContent = unitLabel;
});

document.getElementById('sulfreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Read inputs
  var volume = parseFloat(document.getElementById('waterVolume').value);
  var ppm = parseFloat(document.getElementById('h2sPpm').value);
  var productPct = parseFloat(document.getElementById('productSelect').value);
  var price = parseFloat(document.getElementById('pricePerUnit').value);
  var unit = document.getElementById('unit').value;

  if (isNaN(volume) || isNaN(ppm) || isNaN(price) || volume <= 0 || ppm <= 0 || price < 0) {
    alert('Please fill in all fields with valid numbers.');
    return;
  }

  // Convert to gallons for calculation
  var volumeGallons = unit === 'liters' ? volume * 0.264172 : volume;

  // H2S amount: volume * (PPM / 1,000,000) - in gallons
  var h2sAmount = volumeGallons * (ppm / 1000000);

  // Concentrate needed (5:1 ratio)
  var concentrateNeeded = h2sAmount * 5;

  // Adjust for product concentration
  var totalProductGallons = concentrateNeeded / (productPct / 100);

  // Convert results back to input unit
  var displayH2S, displayConcentrate, displayProduct;
  var unitLabel = unit === 'liters' ? 'liters' : 'gallons';

  if (unit === 'liters') {
    displayH2S = h2sAmount * 3.78541;
    displayConcentrate = concentrateNeeded * 3.78541;
    displayProduct = totalProductGallons * 3.78541;
  } else {
    displayH2S = h2sAmount;
    displayConcentrate = concentrateNeeded;
    displayProduct = totalProductGallons;
  }

  // Cost: totalProductGallons * price
  var totalCost = totalProductGallons * price;

  // Populate results
  document.getElementById('resultH2S').textContent = formatNum(displayH2S);
  document.getElementById('resultConcentrate').textContent = formatNum(displayConcentrate);
  document.getElementById('resultProduct').textContent = formatNum(displayProduct);
  document.getElementById('resultH2SUnit').textContent = unitLabel;
  document.getElementById('resultConcentrateUnit').textContent = unitLabel;
  document.getElementById('resultProductUnit').textContent = unitLabel;

  // Cost section
  var priceUnit = unit === 'liters' ? 'liter' : 'gallon';
  document.getElementById('costUnitLabel').textContent = priceUnit;
  document.getElementById('costProductAmount').textContent = formatNum(displayProduct) + ' ' + unitLabel;
  document.getElementById('costPerUnit').textContent = '$' + formatNum(price) + ' per ' + priceUnit;
  document.getElementById('costTotal').textContent = '$' + formatNum(totalCost);

  // Show results
  document.getElementById('resultsPanel').style.display = 'block';
  document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

function formatNum(num) {
  if (num === 0) return '0';
  if (isNaN(num) || !isFinite(num)) return '—';
  if (num < 0.0001) return '<0.0001';
  if (num < 1) return num.toFixed(5);
  if (num < 10) return num.toFixed(4);
  if (num < 100) return num.toFixed(3);
  if (num >= 1000) return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

// Init
updateProductPercent();
