# 💱 CurrEx — Real-time Currency Converter

<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/API-ExchangeRate--API-7c3aed?style=flat-square" />
  <img src="https://img.shields.io/badge/Responsive-All%20Devices-38bdf8?style=flat-square" />
  <img src="https://img.shields.io/badge/Animated-Yes-a78bfa?style=flat-square" />
</p>

<p align="center">
  A sleek, fully animated, real-time currency converter built with React.<br/>
  Features a deep-space glassmorphism UI, smooth number transitions, live particle effects, conversion history, and support for 160+ currencies.
</p>

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌐 **Live Exchange Rates** | Powered by [ExchangeRate-API](https://www.exchangerate-api.com/) — fetches real-time rates |
| 💹 **Animated Results** | Smooth number count-up animation when conversion result appears |
| 🎨 **Deep Space UI** | Glassmorphism card, ambient glows, animated particle canvas background |
| ⚡ **Quick Pairs** | One-click preset pairs: USD/INR, EUR/USD, GBP/USD, USD/JPY, USD/AED |
| 🔁 **Currency Swap** | Swap From/To currencies with animated button + rotation effect |
| 🏁 **Currency Flags** | Emoji flags for 30 popular currencies |
| 🕓 **Conversion History** | Stores last 5 conversions — click any entry to reload it |
| ⌨️ **Keyboard Support** | Press `Enter` to convert |
| 🚀 **Rate Caching** | API response is cached per session to minimize unnecessary requests |
| 📱 **Fully Responsive** | Optimized for all screen sizes from 360px to 4K |
| ♿ **Accessible** | Proper labels, `aria-label` on interactive buttons, focus management |

---

## 📂 Project Structure

```
src/
├── assets/
│   ├── currencyCodes.js     # Currency list + API key
│   └── logo.png             # (optional – logo no longer required in new version)
├── pages/
│   └── Home/
│       ├── Home.jsx         # ← Replace with new file
│       └── Home.css         # ← Replace with new file
└── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/currex.git
cd currex

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 API Configuration

The API key is stored in `src/assets/currencyCodes.js`:

```js
export const api = "YOUR_API_KEY_HERE";
```

To get a free API key:
1. Visit [exchangerate-api.com](https://www.exchangerate-api.com/)
2. Sign up for a free account (1,500 requests/month free)
3. Copy your API key and paste it into `currencyCodes.js`

> ⚠️ **Note:** Never commit your real API key to a public repository. Consider using environment variables (`.env`) for production deployments.

### Using Environment Variables (Recommended)

Create a `.env` file in the project root:

```env
VITE_EXCHANGE_API_KEY=your_api_key_here
```

Then update `currencyCodes.js`:

```js
export const api = import.meta.env.VITE_EXCHANGE_API_KEY;
```

---

## 🎨 Customization

### Changing the Color Theme

All colors are defined as CSS variables at the top of `Home.css`:

```css
:root {
  --purple-1: #7c3aed;   /* Primary accent */
  --purple-2: #a78bfa;   /* Secondary accent */
  --cyan-1:   #0ea5e9;   /* Button gradient end */
  --bg-deep:  #05070f;   /* Page background */
  /* ... */
}
```

### Adding More Quick Pairs

In `Home.jsx`, update the `POPULAR_PAIRS` array:

```js
const POPULAR_PAIRS = [
  ['USD', 'INR'],
  ['EUR', 'USD'],
  ['GBP', 'USD'],
  ['USD', 'JPY'],
  ['USD', 'AED'],
  // Add your own pairs here
];
```

### Adding More Currency Flags

In the `CurrencyFlag` component inside `Home.jsx`, extend the `flagMap` object:

```js
const flagMap = {
  USD: '🇺🇸',
  // Add more country code → flag emoji mappings
};
```

---

## 🧩 Component Overview

### `Home.jsx`

| Component | Purpose |
|---|---|
| `Home` | Root component — manages all state and API calls |
| `AnimatedNumber` | Animates a number from its previous value to a new one using `requestAnimationFrame` |
| `ParticleCanvas` | Renders a canvas with floating dot particles for the background |
| `CurrencyFlag` | Renders an emoji flag for a given currency code |

### Key State

| State | Description |
|---|---|
| `amount` | User input value |
| `fromCurrency` / `toCurrency` | Selected currency codes |
| `result` | Converted amount string |
| `rate` | Per-unit exchange rate |
| `isProcessing` | Controls loading state on convert button |
| `history` | Array of last 5 conversions |
| `ratesCache` | Cached API response to avoid repeated calls |

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to Netlify, Vercel, or any static host.

---

## 🌐 Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your app will be live in seconds.

---

## 🔒 Security Notes

- The ExchangeRate-API key is exposed client-side (it's a public API key for currency data — this is standard practice for this service)
- For sensitive keys, always use a backend proxy
- Rate limiting: the free tier allows 1,500 requests/month. The app caches rates per session to stay within limits

---

## 🛠️ Tech Stack

- **React 18** — UI library
- **Vite** — Build tool & dev server
- **ExchangeRate-API v6** — Currency data
- **DM Sans + DM Mono** — Typography (Google Fonts)
- **Pure CSS Animations** — No animation library needed
- **Canvas API** — Particle background

---

## 📄 License

MIT License © 2025 — Free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using React · ExchangeRate-API · CSS magic</p>