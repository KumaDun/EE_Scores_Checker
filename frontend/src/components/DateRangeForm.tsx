import React, { useState } from 'react';

interface DateRangeFormProps {
  onQuery: (startDate: string, endDate: string) => void;
  onClear: () => void;
  loading: boolean;
}

const DateRangeForm: React.FC<DateRangeFormProps> = ({ onQuery, onClear, loading }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before or equal to end date');
      return;
    }

    onQuery(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onClear();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="startDate">Start Date (Optional):</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          max={today}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date (Optional):</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          max={today}
        />
      </div>

      <div style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
        <p>Leave both dates empty to see all rounds, or select a date range to filter results.</p>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Querying...' : 'Query CRS Scores'}
      </button>
      <button type="button" className="btn-secondary" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
};

export default DateRangeForm;

