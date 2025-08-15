import React from 'react'
import './Home.css'
import logo from '../../assets/logo.png'
// import { currency_list , api } from '../../assets/currencyCodes.js'

function Home() {
  return (
    <div className="currency-converter">
      <div className="container">
        <h1>Realtime Currency Converter</h1>  <br />
        <img src={logo} alt="currency converter logo" className="home-logo" /> <br />
        <input type="number" id="userValue" min="1" name="userInput" placeholder="100" />

        <div className="select-container">
          <select id="fromCurrency" name="fromCurrency" title="convert from"></select>
          <button type="button" id="switchCurrency">🔁</button>
          <select id="toCurrency" name="toCurrency" title="convert to"></select>
        </div>

        <br />

        <div className="staus-container">
        <p id="status"></p> <br />
        <button id="button">Convert</button> <br />
        <p id="result"></p>
        </div>
      </div>
    </div>
  )
}

export default Home
