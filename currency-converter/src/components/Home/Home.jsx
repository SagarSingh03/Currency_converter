import React, { useState, useEffect } from 'react';
import './Home.css';
import logo from '../../assets/logo.png';
import { currency_list, api } from '../../assets/currencyCodes.js';

function Home() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
  }, []);

  // Handle currency swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult('');
    setStatus('');
  };

  // Fetch API data
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(`Fetch API Error: ${error.message}`);
      setIsProcessing(false);
      throw error;
    }
  }

  // Convert amount
  const convertAmount = async () => {
    if (!amount || amount < 1 || isNaN(amount)) {
      setError('Error: Only numeric values greater than 0 are allowed.');
      return;
    }

    setError('');
    setIsProcessing(true);
    setResult('');
    setStatus('');

    try {
      const data = await fetchData(`https://v6.exchangerate-api.com/v6/${api}/latest/USD`);
      const fromRates = data.conversion_rates[fromCurrency];
      const toRates = data.conversion_rates[toCurrency];

      const perRate = (1 * (toRates / fromRates)).toFixed(2);
      const convertedAmount = (amount * (toRates / fromRates)).toFixed(2);

      setStatus(`1 ${fromCurrency} = ${perRate} ${toCurrency}`);
      setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    } catch (error) {
      console.log(`Additional information about error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="currency-converter">
      <div className="container">
        <h1>Realtime Currency Converter</h1>
        <br />
        <img src={logo} alt="currency converter logo" className="home-logo" />
        <br />
        <input
          type="number"
          id="userValue"
          min="1"
          name="userInput"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ border: error ? '1px solid red' : '1px solid gray' }}
        />

        <div className="select-container">
          <select
            id="fromCurrency"
            name="fromCurrency"
            title="convert from"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currency_list.map(([code, countryName]) => (
              <option key={code} value={code}>
                {`${code} - ${countryName}`}
              </option>
            ))}
          </select>
          <button type="button" id="switchCurrency" onClick={handleSwap}>
            🔁
          </button>
          <select
            id="toCurrency"
            name="toCurrency"
            title="convert to"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currency_list.map(([code, countryName]) => (
              <option key={code} value={code}>
                {`${code} - ${countryName}`}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div className="status-container">
          <p id="status">{status}</p>
          <br />
          <button
            id="btn"
            onClick={convertAmount}
            disabled={isProcessing}
            style={{
              color: isProcessing ? 'gray' : 'black',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? 'Processing: have patience...' : 'Convert'}
          </button>
          <br />
          <p id="result" style={{ color: error ? 'red' : 'black' }}>
            {error || result}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
