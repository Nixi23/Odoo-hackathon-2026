// currencyService.js
// Centralized mock currency exchange-rate service for GlobeTrotter

const CURRENCY_DATABASE = {
  "India": { code: "INR", symbol: "₹", rate: 1.0, name: "Indian Rupee" },
  "France": { code: "EUR", symbol: "€", rate: 0.0112, name: "Euro" },
  "Italy": { code: "EUR", symbol: "€", rate: 0.0112, name: "Euro" },
  "Switzerland": { code: "CHF", symbol: "CHF", rate: 0.0105, name: "Swiss Franc" },
  "UK": { code: "GBP", symbol: "£", rate: 0.0096, name: "British Pound" },
  "United Kingdom": { code: "GBP", symbol: "£", rate: 0.0096, name: "British Pound" },
  "UAE": { code: "AED", symbol: "AED", rate: 0.044, name: "UAE Dirham" },
  "United Arab Emirates": { code: "AED", symbol: "AED", rate: 0.044, name: "UAE Dirham" },
  "Singapore": { code: "SGD", symbol: "S$", rate: 0.016, name: "Singapore Dollar" },
  "Thailand": { code: "THB", symbol: "฿", rate: 0.43, name: "Thai Baht" },
  "Japan": { code: "JPY", symbol: "¥", rate: 1.85, name: "Japanese Yen" },
  "USA": { code: "USD", symbol: "$", rate: 0.012, name: "US Dollar" },
  "United States": { code: "USD", symbol: "$", rate: 0.012, name: "US Dollar" },
  "Indonesia": { code: "IDR", symbol: "Rp", rate: 192.5, name: "Indonesian Rupiah" }
};

export const currencyService = {
  // Get currency info based on country
  getCurrencyInfoByCountry(countryName) {
    if (!countryName) return CURRENCY_DATABASE["India"];
    const countryKey = Object.keys(CURRENCY_DATABASE).find(
      key => key.toLowerCase() === countryName.toLowerCase()
    );
    return CURRENCY_DATABASE[countryKey] || CURRENCY_DATABASE["India"];
  },

  // Convert INR to Local Currency
  convertFromINR(amountInINR, countryName) {
    const currency = this.getCurrencyInfoByCountry(countryName);
    return Math.round(amountInINR * currency.rate);
  },

  // Format currency with proper symbols (Indian digit grouping for INR)
  format(amount, countryName) {
    const currency = this.getCurrencyInfoByCountry(countryName);
    const value = Math.round(amount || 0);

    if (currency.code === "INR") {
      // Indian standard grouping (lakh, crore)
      // e.g. 150000 -> 1,50,000
      const strVal = value.toString();
      let lastThree = strVal.substring(strVal.length - 3);
      const otherNumbers = strVal.substring(0, strVal.length - 3);
      if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
      }
      const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      return `${currency.symbol}${formatted}`;
    }

    // Standard grouping for other currencies
    return `${currency.symbol}${value.toLocaleString()}`;
  },

  // Get details for static view
  getStaticConversionDetails(amountInINR, countryName) {
    const currency = this.getCurrencyInfoByCountry(countryName);
    if (currency.code === "INR") return null;

    const converted = this.convertFromINR(amountInINR, countryName);
    return {
      inr: this.format(amountInINR, "India"),
      local: `${currency.symbol}${converted.toLocaleString()} ${currency.code}`,
      rateText: `1 INR ≈ ${currency.rate} ${currency.code}`,
      note: "Exchange rates are approximate and may change."
    };
  }
};
