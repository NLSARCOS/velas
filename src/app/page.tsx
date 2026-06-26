"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(1); // 1: Water Weight Input, 2: Results Dashboard
  const [waterWeight, setWaterWeight] = useState<string>("");
  const [candleQty, setCandleQty] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on step 1
  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [step]);

  const handleWaterWeightSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseFloat(waterWeight);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg("Por favor, ingresa un peso válido mayor a 0.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleReset = () => {
    setWaterWeight("");
    setCandleQty(1);
    setStep(1);
    setErrorMsg("");
  };

  // Perform Calculations
  const waterVal = parseFloat(waterWeight) || 0;
  const waxPerCandle = waterVal * 0.9;
  const prodCPerCandle = waxPerCandle * 0.05; // 50g per 1KG is 5%
  const remainingPerCandle = waxPerCandle - prodCPerCandle;
  const prodAPerCandle = remainingPerCandle * 0.6;
  const prodBPerCandle = remainingPerCandle * 0.4;

  // Multiplied totals
  const totalWax = waxPerCandle * candleQty;
  const totalProdA = prodAPerCandle * candleQty;
  const totalProdB = prodBPerCandle * candleQty;
  const totalProdC = prodCPerCandle * candleQty;

  return (
    <>
      <div className="ambient-glow" />
      <div className="ambient-glow-bottom" />
      <main>
        <div className="glass-container">
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>

          {/* Step 1: Water Weight */}
          {step === 1 && (
            <form onSubmit={handleWaterWeightSubmit} className="step-container">
              <h2>¿Cuánto pesa tu molde con agua?</h2>
              <p>
                Llena el molde con agua y pésalo en gramos. Como la densidad del agua es 1.0 g/ml, nos dará el volumen exacto de tu vela.
              </p>
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="Ej. 100"
                  className="input-field"
                  value={waterWeight}
                  onChange={(e) => {
                    setWaterWeight(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  autoFocus
                />
                <span className="input-unit">g (Agua)</span>
              </div>

              {errorMsg && (
                <div style={{ color: "var(--error)", fontSize: "0.9rem", fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              <div className="btn-group">
                <button type="submit" className="btn-primary">
                  Calcular Proporciones
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Results Dashboard */}
          {step === 2 && (
            <div className="step-container">
              <h2>Proporciones de la Vela</h2>
              <p>
                Aquí tienes las proporciones ideales según tu molde de <strong>{waterWeight}g de agua</strong>:
              </p>

              {/* Candle Qty Controller */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                  Cantidad de Velas a Fabricar:
                </span>
                <div className="amount-controller">
                  <button
                    className="amount-btn"
                    onClick={() => setCandleQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="amount-display">{candleQty}</span>
                  <button
                    className="amount-btn"
                    onClick={() => setCandleQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Grid cards */}
              <div className="results-grid">
                <div className="result-card highlighted">
                  <div className="result-label">Peso Total de Cera Requerido</div>
                  <div className="result-value">
                    {totalWax.toFixed(1)}
                    <span className="unit">g</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "var(--text-secondary)" }}>
                    Calculado usando la densidad de la cera (90% del peso en agua).
                  </p>
                </div>

                <div className="result-card">
                  <div className="result-label">Producto A (60%)</div>
                  <div className="result-value">
                    {totalProdA.toFixed(1)}
                    <span className="unit">g</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    60% del peso restante de cera.
                  </p>
                </div>

                <div className="result-card">
                  <div className="result-label">Producto B (40%)</div>
                  <div className="result-value">
                    {totalProdB.toFixed(1)}
                    <span className="unit">g</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    40% del peso restante de cera.
                  </p>
                </div>

                <div className="result-card highlighted" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(245, 158, 11, 0.05) 100%)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                  <div className="result-label">Producto C (50g / KG)</div>
                  <div className="result-value">
                    {totalProdC.toFixed(1)}
                    <span className="unit">g</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    5% del total de la cera (equivalente a 50 gramos por cada Kilogramo de cera).
                  </p>
                </div>
              </div>

              {/* Formula Explanation box */}
              <div style={{
                background: "rgba(0,0,0,0.02)",
                border: "1px dashed rgba(0,0,0,0.1)",
                borderRadius: "16px",
                padding: "1.25rem",
                marginTop: "1rem"
              }}>
                <h4 style={{ fontSize: "0.95rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  💡 Explicación de la Fórmula
                </h4>
                <ul style={{ fontSize: "0.85rem", color: "var(--text-secondary)", listStyleType: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <li>• <strong>Peso Cera</strong> = Agua × 0.9</li>
                  <li>• <strong>Producto C</strong> = Cera Total × 5%</li>
                  <li>• <strong>Cera Restante</strong> = Cera Total − Producto C</li>
                  <li>• <strong>Producto A</strong> = Cera Restante × 60%</li>
                  <li>• <strong>Producto B</strong> = Cera Restante × 40%</li>
                </ul>
              </div>

              <div className="btn-group" style={{ marginTop: "1.5rem" }}>
                <button className="btn-secondary" onClick={handleReset}>
                  Atrás / Nueva Vela
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
