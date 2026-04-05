const https = require('https');

const fetchStockPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`;

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const price = parsed.chart.result[0].meta.regularMarketPrice;
          const companyName = parsed.chart.result[0].meta.longName || symbol;
          resolve({ symbol, price, companyName });
        } catch (err) {
          reject(new Error('Could not fetch price for ' + symbol));
        }
      });
    }).on('error', reject);
  });
};

module.exports = { fetchStockPrice };