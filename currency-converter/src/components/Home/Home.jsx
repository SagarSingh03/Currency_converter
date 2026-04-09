import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import { currency_list, api } from '../../assets/currencyCodes.js';

const POPULAR_PAIRS = [
  ['USD', 'INR'],
  ['EUR', 'USD'],
  ['GBP', 'USD'],
  ['USD', 'JPY'],
  ['USD', 'AED'],
];

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (!value || value === prevRef.current) return;
    const start = parseFloat(prevRef.current) || 0;
    const end = parseFloat(value);
    const duration = 800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = (start + (end - start) * eased).toFixed(2);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = value;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span>{display}</span>;
}

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

function CurrencyFlag({ code }) {
  const flagMap = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳', JPY: '🇯🇵',
    AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', AED: '🇦🇪',
    SGD: '🇸🇬', HKD: '🇭🇰', NOK: '🇳🇴', SEK: '🇸🇪', NZD: '🇳🇿',
    MXN: '🇲🇽', BRL: '🇧🇷', ZAR: '🇿🇦', KRW: '🇰🇷', TRY: '🇹🇷',
    RUB: '🇷🇺', PLN: '🇵🇱', THB: '🇹🇭', IDR: '🇮🇩', MYR: '🇲🇾',
    PHP: '🇵🇭', PKR: '🇵🇰', NGN: '🇳🇬', EGP: '🇪🇬', SAR: '🇸🇦',
  };
  return <span className="currency-flag">{flagMap[code] || '🏳️'}</span>;
}

export default function Home() {
  const [amount, setAmount]           = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency]   = useState('INR');
  const [result, setResult]           = useState('');
  const [rate, setRate]               = useState('');
  const [status, setStatus]           = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError]             = useState('');
  const [swapping, setSwapping]       = useState(false);
  const [history, setHistory]         = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [ratesCache, setRatesCache]   = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setResult('');
      setStatus('');
      setRate('');
      setSwapping(false);
    }, 300);
  };

  const handleQuickPair = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
    setResult('');
    setStatus('');
    setRate('');
  };

  const fetchData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const convertAmount = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setError('');
    setIsProcessing(true);
    setResult('');
    setStatus('');
    setRate('');

    try {
      let data = ratesCache;
      if (!data) {
        data = await fetchData(`https://v6.exchangerate-api.com/v6/${api}/latest/USD`);
        setRatesCache(data);
      }
      const fromRate = data.conversion_rates[fromCurrency];
      const toRate   = data.conversion_rates[toCurrency];
      const perRate  = (toRate / fromRate).toFixed(6);
      const converted = (num * toRate / fromRate).toFixed(2);

      setRate(perRate);
      setStatus(`1 ${fromCurrency} = ${perRate} ${toCurrency}`);
      setResult(converted);
      setLastUpdated(new Date().toLocaleTimeString());

      setHistory(prev => [
        { from: fromCurrency, to: toCurrency, amount: num, result: converted, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
    } catch (e) {
      setError(`Conversion failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') convertAmount(); };

  const fromName = currency_list.find(([c]) => c === fromCurrency)?.[1] || '';
  const toName   = currency_list.find(([c]) => c === toCurrency)?.[1] || '';

  return (
    <div className="cc-root">
      <ParticleCanvas />

      <div className="cc-glow cc-glow-1" />
      <div className="cc-glow cc-glow-2" />

      <main className="cc-card">
        <header className="cc-header">
          <div className="cc-logo">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
              <circle cx="18" cy="18" r="17" stroke="url(#g1)" strokeWidth="2"/>
              <path d="M12 18 Q18 10 24 18 Q18 26 12 18Z" fill="url(#g1)" opacity="0.8"/>
              <path d="M10 18 H26M18 10 V26" stroke="url(#g1)" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#a78bfa"/>
                  <stop offset="100%" stopColor="#38bdf8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="cc-title">Currency Converter</h1>
            <p className="cc-subtitle">Real-time exchange rates</p>
          </div>
          {lastUpdated && (
            <div className="cc-updated">
              <span className="cc-dot" />
              Live · {lastUpdated}
            </div>
          )}
        </header>

        <div className="cc-quick-pairs">
          {POPULAR_PAIRS.map(([f, t]) => (
            <button
              key={f + t}
              className={`cc-pair-chip ${fromCurrency === f && toCurrency === t ? 'active' : ''}`}
              onClick={() => handleQuickPair(f, t)}
            >
              {f}/{t}
            </button>
          ))}
        </div>

        <div className="cc-amount-row">
          <label className="cc-label" htmlFor="amountInput">Amount</label>
          <div className="cc-input-wrap">
            <span className="cc-input-currency">{fromCurrency}</span>
            <input
              ref={inputRef}
              id="amountInput"
              className={`cc-input ${error ? 'cc-input--error' : ''}`}
              type="number"
              min="0"
              step="any"
              placeholder="100"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>
          {error && <p className="cc-error">{error}</p>}
        </div>

        <div className="cc-selects-row">
          <div className="cc-select-group">
            <label className="cc-label">From</label>
            <div className="cc-select-wrap">
              <CurrencyFlag code={fromCurrency} />
              <select
                className="cc-select"
                value={fromCurrency}
                onChange={(e) => { setFromCurrency(e.target.value); setResult(''); setRate(''); }}
              >
                {currency_list.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>
              <span className="cc-select-arrow">▾</span>
            </div>
            <p className="cc-currency-name">{fromName}</p>
          </div>

          <button
            className={`cc-swap-btn ${swapping ? 'swapping' : ''}`}
            onClick={handleSwap}
            title="Swap currencies"
            aria-label="Swap currencies"
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M7 16V4m0 0L4 7m3-3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8v12m0 0l3-3m-3 3l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="cc-select-group">
            <label className="cc-label">To</label>
            <div className="cc-select-wrap">
              <CurrencyFlag code={toCurrency} />
              <select
                className="cc-select"
                value={toCurrency}
                onChange={(e) => { setToCurrency(e.target.value); setResult(''); setRate(''); }}
              >
                {currency_list.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>
              <span className="cc-select-arrow">▾</span>
            </div>
            <p className="cc-currency-name">{toName}</p>
          </div>
        </div>

        <button
          className={`cc-convert-btn ${isProcessing ? 'loading' : ''}`}
          onClick={convertAmount}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="cc-spinner-wrap">
              <span className="cc-spinner" />
              Converting…
            </span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ marginRight: 8 }}>
                <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Convert
            </>
          )}
        </button>

        {(result || status) && !error && (
          <div className="cc-result-card">
            <div className="cc-result-rate">{status}</div>
            <div className="cc-result-main">
              <span className="cc-result-from">{amount} {fromCurrency}</span>
              <span className="cc-result-eq">=</span>
              <span className="cc-result-to">
                <AnimatedNumber value={result} /> {toCurrency}
              </span>
            </div>
            <div className="cc-result-meta">
              <span>Rate: {rate}</span>
              <span className="cc-result-divider">·</span>
              <span>{toName}</span>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="cc-history-section">
            <button
              className="cc-history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style={{ marginRight: 6 }}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Recent conversions
              <span className={`cc-chevron ${showHistory ? 'open' : ''}`}>▾</span>
            </button>

            {showHistory && (
              <div className="cc-history-list">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="cc-history-item"
                    onClick={() => {
                      setFromCurrency(h.from);
                      setToCurrency(h.to);
                      setAmount(String(h.amount));
                      setResult('');
                      setStatus('');
                    }}
                  >
                    <span className="cc-history-pair">{h.from} → {h.to}</span>
                    <span className="cc-history-values">{h.amount} = {h.result}</span>
                    <span className="cc-history-time">{h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}