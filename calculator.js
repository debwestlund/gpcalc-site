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

// Unit dropdown removed - we keep it for volume toggle but remove price unit logic
document.getElementById('unit').addEventListener('change', function() {});

document.getElementById('sulfreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Read inputs
  var volume = parseFloat(document.getElementById('waterVolume').value);
  var ppm = parseFloat(document.getElementById('h2sPpm').value);
  var productPct = parseFloat(document.getElementById('productSelect').value);
  var pricePerGallon = parseFloat(document.getElementById('pricePerGallon').value);
  var pricePerLiter = parseFloat(document.getElementById('pricePerLiter').value);
  var unit = document.getElementById('unit').value;

  if (isNaN(volume) || isNaN(ppm) || volume <= 0 || ppm <= 0) {
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
  var totalProductLiters = totalProductGallons * 3.78541;

  // Costs
  var totalCostGallons = (!isNaN(pricePerGallon)) ? totalProductGallons * pricePerGallon : null;
  var totalCostLiters = (!isNaN(pricePerLiter)) ? totalProductLiters * pricePerLiter : null;

  // Product amount display (always show both)
  document.getElementById('costProductAmount').textContent = formatNum(totalProductGallons) + ' gallons (' + formatNum(totalProductLiters) + ' liters)';

  // Gallon costs
  if (!isNaN(pricePerGallon)) {
    document.getElementById('costPerGallon').textContent = '$' + formatNum(pricePerGallon);
    document.getElementById('costTotalGallon').textContent = '$' + formatNum(totalCostGallons);
    document.getElementById('costPerGallon').style.display = '';
    document.getElementById('costTotalGallon').style.display = '';
  } else {
    document.getElementById('costPerGallon').textContent = '—';
    document.getElementById('costTotalGallon').textContent = '—';
  }

  // Liter costs
  if (!isNaN(pricePerLiter)) {
    document.getElementById('costPerLiter').textContent = '$' + formatNum(pricePerLiter);
    document.getElementById('costTotalLiter').textContent = '$' + formatNum(totalCostLiters);
    document.getElementById('costPerLiter').style.display = '';
    document.getElementById('costTotalLiter').style.display = '';
  } else {
    document.getElementById('costPerLiter').textContent = '—';
    document.getElementById('costTotalLiter').textContent = '—';
  }

  // Show results panel
  document.getElementById('resultH2S').textContent = formatNum(totalProductGallons * (productPct / 100) / 5);
  // Re-calculate H2S from formula: h2sAmount = volumeGallons * (ppm / 1000000)
  var h2sGallons = volumeGallons * (ppm / 1000000);
  var h2sLiters = h2sGallons * 3.78541;
  document.getElementById('resultH2S').textContent = formatNum(h2sGallons);
  document.getElementById('resultH2SUnit').textContent = 'gallons (' + formatNum(h2sLiters) + ' L)';

  var concGallons = concentrateNeeded;
  var concLiters = concentrateNeeded * 3.78541;
  document.getElementById('resultConcentrate').textContent = formatNum(concGallons);
  document.getElementById('resultConcentrateUnit').textContent = 'gallons (' + formatNum(concLiters) + ' L)';

  document.getElementById('resultProduct').textContent = formatNum(totalProductGallons);
  document.getElementById('resultProductUnit').textContent = 'gallons (' + formatNum(totalProductLiters) + ' L)';

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
