import React from "react";
import "./App.css";
import DateRangeForm from "./components/DateRangeForm";
import ResultsPanel from "./components/ResultsPanel";
import ErrorMessage from "./components/ErrorMessage";

const API_ENDPOINT = "https://21b21ml5bk.execute-api.us-east-1.amazonaws.com/";

interface CRSRound {
  drawNumber: string;
  drawDate: string;
  drawDateFull: string;
  drawName: string;
  drawSize: string;
  drawCRS: string;
  drawDateTime: string;
  drawCutOff: string;
  drawText2: string;
}

function App() {
  const [results, setResults] = React.useState<CRSRound[]>([]);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleQuery = async (startDate: string, endDate: string) => {
    setError("");
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const url = `${API_ENDPOINT}/api/crs-scores${
        params.toString() ? "?" + params.toString() : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch CRS scores");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResults([]);
    setError("");
  };

  return (
    <div className="container">
      <header>
        <h1>EE Score Checker</h1>
        <p className="subtitle">
          Query Comprehensive Ranking System scores from IRCC Express Entry
          draws
        </p>
      </header>

      <div className="query-panel">
        <DateRangeForm
          onQuery={handleQuery}
          onClear={handleClear}
          loading={loading}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      {results.length > 0 && <ResultsPanel results={results} />}
    </div>
  );
}

export default App;
