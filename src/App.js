// CurrencyConverter.jsx
import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("CAD");
  const [toCurrency, setToCurrency] = useState("CNY");
  const [converted, setConverted] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (amount > 0) {
      async function convert() {

        // Check if currencies are the same
        if (fromCurrency === toCurrency) {
            setConverted(amount);
            setError("");
            return;
          }

        try {
          setError("");
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
          );
          const data = await res.json();
          
          if (data.rates && data.rates[toCurrency]) {
            setConverted(data.rates[toCurrency]);
          } else {
            setConverted("");
            setError("Unable to get conversion rate");
          }
        } catch (err) {
          setConverted("");
          setError("Failed to convert currency");
        }
      }
      convert();
    } else {
      setConverted("");
      setError("Please enter a valid amount");
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || value <= 0) {
      setAmount(0);
    } else {
      setAmount(Number(value));
    }
  };

  return (
    <div className="converter-container">
      <input
        type="number"
        value={amount || ""}
        onChange={handleAmountChange}
        min="0"
        step="any"
        className="converter-input"
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        className="converter-select"
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="CNY">CNY</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        className="converter-select"
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="CNY">CNY</option>
      </select>
      {error ? (
        <p className="converter-error">{error}</p>
      ) : (
        converted && (
          <p className="converter-result">
            {amount} {fromCurrency} = {converted} {toCurrency}
          </p>
        )
      )}
    </div>
  );
}