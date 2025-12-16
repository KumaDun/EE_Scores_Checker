import React from 'react';

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

interface ResultsPanelProps {
  results: CRSRound[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="results-panel">
        <div className="no-results">
          <div className="no-results-icon">📊</div>
          <h3>No Results Found</h3>
          <p>No CRS score data found for the selected date range. Please try different dates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <h2>Query Results ({results.length} round{results.length !== 1 ? 's' : ''})</h2>
      {results.map((result, index) => (
        <div key={index} className="result-card">
          <div className="result-header">
            <div>
              <div className="result-date">{result.drawDateFull}</div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                Draw #{result.drawNumber}
              </div>
            </div>
            <div className="result-program">{result.drawName}</div>
          </div>
          <div className="result-details">
            <div className="detail-item">
              <div className="detail-label">CRS Score</div>
              <div className="detail-value highlight">{result.drawCRS}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Invitations Issued</div>
              <div className="detail-value">{parseInt(result.drawSize.replace(/,/g, '')).toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Draw Date & Time</div>
              <div className="detail-value small">{result.drawDateTime}</div>
            </div>
            {result.drawCutOff && (
              <div className="detail-item">
                <div className="detail-label">Tie-breaking Rule</div>
                <div className="detail-value small">{result.drawCutOff}</div>
              </div>
            )}
          </div>
          {result.drawText2 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#666' }}>
              <strong>Programs:</strong> {result.drawText2}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultsPanel;
