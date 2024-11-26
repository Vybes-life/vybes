(function() {
  let countryCode;

  function geoip(json) {
    countryCode = json.country_code;
    setPriceForCountry(countryCode);
  }

  function setPriceForCountry(code) {
    let prices = {
      'US': '$19',
      'GB': '£17',
      'FR': '€19',
      'IT': '€19',
      'JP': '¥2,899',
      
      // High-Income Markets
      'AE': 'AED 88',
      'SA': 'SAR 90',
      'SG': 'SGD 29',
      'HK': 'HKD 189',
      
      // Developed Markets
      'DE': '€19',
      'AU': 'AUD 29',
      'CA': 'CAD 24',
      'NL': '€19',
      'CH': 'CHF 22',
      
      // Growing Fashion Markets
      'KR': 'KRW 30,799',
      'CN': 'CNY 159',
      'RU': 'RUB 1,599',
      
      // Emerging Markets
      'BR': 'BRL 99',
      'IN': '₹1,299',
      'MX': 'MXN 379',
      'TH': 'THB 699',
      'MY': 'MYR 89',
      'PH': '₱999',
      'ID': 'IDR 239,000',
      
      // Other Markets
      'ES': '€17',
      'NO': 'NOK 199',
      'DK': 'DKK 149',
      'SE': 'SEK 199',
      'NZ': 'NZD 29',
      'TW': 'TWD 599',
      'IL': 'ILS 69',
      'TR': 'TRY 519',
      'ZA': 'ZAR 272',
      'QA': 'QAR 88',
      'KW': 'KWD 7.5',
      'BH': 'BHD 8.3'
    };
    window.price = prices[code] || '$49';  // Save the price in global variable
    
    document.querySelectorAll('#price').forEach(function (element) {
      element.textContent = window.price;
    });
  }

  // Expose only necessary functions and getters
  window.geoip = geoip;
  Object.defineProperty(window, 'countryCode', {
    get: function() {
      return countryCode;
    },
    configurable: false,
    enumerable: false
  });
})();
