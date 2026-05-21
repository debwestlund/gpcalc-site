/**
 * Sulfree H2S Dosage Calculator
 * Everything calculated in GALLONS internally.
 * Results always shown in BOTH gallons and liters.
 */

// Product percentage label
function updateProductPercent() {
  var sel = document.getElementById('productSelect');
  document.getElementById('productHelp').textContent = 'Concentration: ' + sel.value + '%';
}

document.getElementById('sulfreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  var waterVol   = parseFloat(document.getElementById('waterVolume').value);
  var h2sPpm     = parseFloat(document.getElementById('h2sPpm').value);
  var productPct = parseFloat(document.getElementById('productSelect').value);
  var price      = parseFloat(document.getElementById('pricePerUnit').value) || 0;
  var waterUnit  = document.getElementById('waterUnit').value;   // gallons | liters
  var priceUnit  = document.getElementById('priceUnit').value;   // gallons | liters
  var waterIsLiters = (waterUnit === 'liters');

  if (isNaN(waterVol) || waterVol <= 0 || isNaN(h2sPpm) || h2sPpm <= 0 || isNaN(productPct) || productPct <= 0) {
    alert('Please fill in all fields with valid positive numbers.');
    return;
  }

  /* ---- all calculations in GALLONS ---- */
  // Convert water volume to gallons
  var volGal = waterIsLiters ? waterVol * 0.264172 : waterVol;

  // H2S amount (gallons of H2S in the water)
  var h2sGal = volGal * (h2sPpm / 1000000);

  // Sulfree concentrate needed (5 : 1 ratio)
  var concGal = h2sGal * 5;

  // Adjust for product concentration
  var productGal = concGal / (productPct / 100);

  // Liters equivalents
  var volL  = volGal * 3.78541;
  var h2sL  = h2sGal * 3.78541;
  var concL = concGal * 3.78541;
  var prodL = productGal * 3.78541;

  /* ---- populate 3 result cards (both units) ---- */
  document.getElementById('resultH2S').textContent     = f(h2sGal) + ' gal (' + f(h2sL) + ' L)';
  document.getElementById('resultH2SUnit').textContent  = '';

  document.getElementById('resultConcentrate').textContent    = f(concGal) + ' gal (' + f(concL) + ' L)';
  document.getElementById('resultConcentrateUnit').textContent = '';

  document.getElementById('resultProduct').textContent     = f(productGal) + ' gal (' + f(prodL) + ' L)';
  document.getElementById('resultProductUnit').textContent  = '';

  /* ---- conversion summary ---- */
  var convLines = '';
  if (waterIsLiters) {
    convLines  = '<strong>Water volume:</strong> ' + f(waterVol) + ' liters = ' + f(volGal) + ' gallons<br>';
    convLines += '<strong>Sulfree needed:</strong> ' + f(productGal) + ' gallons (' + f(prodL) + ' liters) to treat ' + f(waterVol) + ' liters of water';
  } else {
    convLines  = '<strong>Water volume:</strong> ' + f(waterVol) + ' gallons = ' + f(volL) + ' liters<br>';
    convLines += '<strong>Sulfree needed:</strong> ' + f(productGal) + ' gallons (' + f(prodL) + ' liters) to treat ' + f(waterVol) + ' gallons of water';
  }
  document.getElementById('convText').innerHTML = convLines;

  /* ---- cost ---- */
  var costCard = document.getElementById('costCard');
  if (price > 0) {
    // Price is in whatever unit the user selected; convert product to that unit
    var productForPrice = (priceUnit === 'liters') ? prodL : productGal;
    var totalCost = productForPrice * price;
    var puLabel = (priceUnit === 'liters') ? 'Price per liter' : 'Price per gallon';

    document.getElementById('costUnitLabel').textContent = puLabel;
    document.getElementById('costPerUnit2').textContent  = '$' + f(price);
    document.getElementById('costProductAmount').textContent = f(productForPrice) + ' ' + (priceUnit === 'liters' ? 'liters' : 'gallons');
    document.getElementById('costTotal').textContent     = '$' + f(totalCost);
    costCard.style.display = 'block';
  } else {
    costCard.style.display = 'none';
  }

  /* ---- show results panel ---- */
  document.getElementById('resultsPanel').style.display = 'block';
  document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Format helper
function f(num) {
  if (num === 0)  return '0';
  if (isNaN(num)) return '—';
  if (num < 0.0001)  return num.toExponential(2);
  if (num < 1)       return num.toFixed(5);
  if (num < 10)      return num.toFixed(4);
  if (num < 100)     return num.toFixed(2);
  if (num < 10000)   return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  return Math.round(num).toLocaleString();
}

// Init
updateProductPercent();
