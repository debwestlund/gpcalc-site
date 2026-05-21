/**
 * SulFree Fix Series — H₂S Scavenger Dosage & Cost Calculator
 * Everything calculated in GALLONS internally.
 */

document.addEventListener("DOMContentLoaded", function() {

  // Product dropdown label
  var prodSel = document.getElementById("productSelect");
  prodSel.addEventListener("change", function() {
    document.getElementById("productHelp").textContent = "Concentration: " + this.value + "%";
  });

  // Form submit
  document.getElementById("sulfreeForm").addEventListener("submit", function(e) {
    e.preventDefault();
    calc();
  });
});

function calc() {
  var waterVol  = parseFloat(document.getElementById("waterVolume").value);
  var h2sPpm    = parseFloat(document.getElementById("h2sPpm").value);
  var prodPct   = parseFloat(document.getElementById("productSelect").value);
  var price     = parseFloat(document.getElementById("pricePerUnit").value) || 0;
  var waterUnit = document.getElementById("waterUnit").value;
  var priceUnit = document.getElementById("priceUnit").value;

  // Validate
  if (isNaN(waterVol) || waterVol <= 0 || isNaN(h2sPpm) || h2sPpm <= 0 || isNaN(prodPct) || prodPct <= 0) {
    alert("Please fill in Water Volume, H₂S PPM, and select a Sulfree product.");
    return;
  }

  var waterIsL = (waterUnit === "liters");

  // ---- convert to gallons ----
  var volGal = waterIsL ? waterVol * 0.264172 : waterVol;

  // ---- formula ----
  var h2sGal     = volGal * (h2sPpm / 1000000);
  var concGal    = h2sGal * 5;
  var productGal = concGal / (prodPct / 100);

  // ---- liters versions ----
  var volL   = volGal * 3.78541;
  var h2sL   = h2sGal * 3.78541;
  var concL  = concGal * 3.78541;
  var prodL  = productGal * 3.78541;

  // ---- populate result cards ----
  document.getElementById("resultH2S").textContent        = f(h2sGal) + " gal (" + f(h2sL) + " L)";
  document.getElementById("resultConcentrate").textContent = f(concGal) + " gal (" + f(concL) + " L)";
  document.getElementById("resultProduct").textContent     = f(productGal) + " gal (" + f(prodL) + " L)";

  // ---- conversion summary ----
  if (waterIsL) {
    document.getElementById("convText").innerHTML =
      "<strong>Water volume:</strong> " + f(waterVol) + " liters = " + f(volGal) + " gallons<br>" +
      "<strong>Sulfree needed:</strong> " + f(productGal) + " gallons (" + f(prodL) + " liters) to treat " + f(waterVol) + " liters of water";
  } else {
    document.getElementById("convText").innerHTML =
      "<strong>Water volume:</strong> " + f(waterVol) + " gallons = " + f(volL) + " liters<br>" +
      "<strong>Sulfree needed:</strong> " + f(productGal) + " gallons (" + f(prodL) + " liters) to treat " + f(waterVol) + " gallons of water";
  }

  // ---- cost section ----
  var costCard = document.getElementById("costCard");
  if (price > 0) {
    var amt = (priceUnit === "liters") ? prodL : productGal;
    var total = amt * price;
    var label = (priceUnit === "liters") ? "Price per liter" : "Price per gallon";

    document.getElementById("costUnitLabel").textContent = label;
    document.getElementById("costPerUnit2").textContent  = "$" + f(price);
    document.getElementById("costProductAmount").textContent = f(amt) + " " + (priceUnit === "liters" ? "liters" : "gallons");
    document.getElementById("costTotal").textContent     = "$" + f(total);
    costCard.style.display = "block";
  } else {
    costCard.style.display = "none";
  }

  // ---- show results ----
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("resultsPanel").scrollIntoView({ behavior: "smooth" });
}

// ---------- formatting ----------
function f(n) {
  if (n === 0)          return "0";
  if (isNaN(n))         return "\u2014";
  if (n < 0.0001)       return n.toExponential(2);
  if (n < 1)            return n.toFixed(5);
  if (n < 10)           return n.toFixed(4);
  if (n < 100)          return n.toFixed(2);
  if (n < 10000)        return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return Math.round(n).toLocaleString();
}

// Initial label
(function() {
  var s = document.getElementById("productSelect");
  if (s) document.getElementById("productHelp").textContent = "Concentration: " + s.value + "%";
})();
