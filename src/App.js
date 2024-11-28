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
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  useEffect(() => {

    const timer = setTimeout(() => {
        setDebouncedAmount(amount);
      }, 500); // Wait 500ms after last keystroke
  
      return () => clearTimeout(timer);
    }, [amount]);

    // Change this useEffect to use debouncedAmount instead of amount
  useEffect(() => {
    if (debouncedAmount > 0) {
      async function convert() {
        if (fromCurrency === toCurrency) {
          setConverted(debouncedAmount);
          setError("");
          return;
        }

        setLoading(true);
        try {
          setError("");
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${debouncedAmount}&from=${fromCurrency}&to=${toCurrency}`
          );
          const data = await res.json();
          console.log(data);

          if (data.rates && data.rates[toCurrency]) {
            setConverted(data.rates[toCurrency]);
          } else {
            setConverted("");
            setError("Unable to get conversion rate");
          }
        } catch (err) {
          setConverted("");
          setError("Failed to convert currency");
        } finally {
          setLoading(false);
        }
      }
      convert();
    } else {
      setConverted("");
      setError("Please enter a valid amount");
    }
  }, [debouncedAmount, fromCurrency, toCurrency]); // Changed from amount to debouncedAmount

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
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="CNY">CNY</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        className="converter-select"
        disabled={isLoading}
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
