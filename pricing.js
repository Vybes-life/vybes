function geoip(json) {
    

  setPriceForCountry(json.country_code); // Call the price-setting function
}

// Function to set the price based on the country code
function setPriceForCountry(countryCode) {
  let prices = {
    'AE': 'AED 329',
    'SA': 'SAR 299',
    'QA': 'QAR 325',
    'KW': 'KWD 22.9',
    'BH': 'BHD 25.9',
    'SG': 'SGD 109',
    'JP': '¥11,990',
    'KR': '₩89,000',
    'HK': 'HKD 588',
    'AU': 'AUD 99.95',
    'NZ': 'NZD 99.95',
    'CH': 'CHF 69.90',
    'NO': 'NOK 729',
    'DK': 'DKK 449',
    'SE': 'SEK 679',
    'GB': '£47.99',
    'DE': '€54.99',
    'FR': '€49.99',
    'NL': '€49.99',
    'US': '$49.99',
    'CA': 'CAD 69.99',
    'IT': '€44.99',
    'ES': '€39.99',
    'TW': 'TWD 1,399',
    'IL': 'ILS 159',
    'RU': 'RUB 3,299',
    'MY': 'MYR 179',
    'CN': 'CNY ¥279',
    'TH': 'THB 1,259',
    'BR': 'BRL 179',
    'MX': 'MXN 599',
    'TR': 'TRY 1,099',
    'ZA': 'ZAR 599',
    'ID': 'IDR 459,000',
    'IN': '₹1,999',
    'PH': '₱1,399'
  };

  window.price = prices[countryCode] || '$49';  // Save the price in global variable

  document.querySelectorAll('#price').forEach(function (element) {
    element.textContent = window.price;
  });
  
}